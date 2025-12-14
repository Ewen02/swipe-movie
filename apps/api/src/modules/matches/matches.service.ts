import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesGateway } from './matches.gateway';

import { ResponseMatchDto } from './dtos';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
  getPaginationParams,
} from '../../common/dtos';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  ROOM_MATCHES: 60 * 1000, // 1 minute (real-time data needs frequent updates)
} as const;

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MatchesGateway))
    private matchesGateway: MatchesGateway,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Invalidate matches cache for a room
   */
  private async invalidateRoomMatchesCache(roomId: string): Promise<void> {
    await this.cacheManager.del(`matches:room:${roomId}`);
  }

  async createIfNeeded(
    roomId: string,
    movieId: string,
  ): Promise<ResponseMatchDto | null> {
    // Use transaction with serializable isolation to prevent race conditions
    // when multiple users like the same movie simultaneously
    const result = await this.prisma.$transaction(
      async (tx) => {
        const likes = await tx.swipe.count({
          where: { roomId, movieId, value: true },
        });

        if (likes < 2) {
          return null;
        }

        // Check if match already exists to avoid duplicate WebSocket events
        const existingMatch = await tx.match.findUnique({
          where: { roomId_movieId: { roomId, movieId } },
          select: { id: true },
        });

        if (existingMatch) {
          // Match already exists, don't emit duplicate event
          return null;
        }

        const match = await tx.match.create({
          data: { roomId, movieId },
          select: { id: true, roomId: true, movieId: true, createdAt: true },
        });

        return {
          ...match,
          voteCount: likes,
          isNew: true,
        };
      },
      {
        isolationLevel: 'Serializable',
      },
    );

    if (!result) {
      return null;
    }

    const { isNew, ...matchDto } = result;

    // Invalidate cache after match creation
    await this.invalidateRoomMatchesCache(roomId);

    // Emit WebSocket event for real-time notification (only for new matches)
    if (isNew) {
      this.matchesGateway.emitMatchCreated(roomId, matchDto);
    }

    return matchDto;
  }

  /**
   * Delete a match and notify all users in the room
   */
  async deleteMatch(roomId: string, movieId: string): Promise<boolean> {
    const deleted = await this.prisma.match.deleteMany({
      where: { roomId, movieId },
    });

    if (deleted.count > 0) {
      // Invalidate cache
      await this.invalidateRoomMatchesCache(roomId);

      // Emit WebSocket event to notify all users
      this.matchesGateway.emitMatchDeleted(roomId, movieId);

      return true;
    }

    return false;
  }

  async findByRoom(
    roomId: string,
    pagination?: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ResponseMatchDto> | ResponseMatchDto[]> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const where = { roomId };

    // If pagination is provided, return paginated response
    if (pagination) {
      const { skip, take } = getPaginationParams(
        pagination.page ?? 1,
        pagination.limit ?? 20,
      );

      const [matches, total] = await Promise.all([
        this.prisma.match.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.match.count({ where }),
      ]);

      if (matches.length === 0) {
        return new PaginatedResponseDto(
          [],
          pagination.page ?? 1,
          pagination.limit ?? 20,
          0,
        );
      }

      // Get all vote counts in a single query using GROUP BY
      const voteCounts = await this.prisma.swipe.groupBy({
        by: ['movieId'],
        where: {
          roomId,
          movieId: {
            in: matches.map((m) => m.movieId),
          },
          value: true,
        },
        _count: {
          id: true,
        },
      });

      // Create a map for O(1) lookup
      const voteCountMap = new Map(
        voteCounts.map((vc) => [vc.movieId, vc._count.id]),
      );

      // Enrich matches with vote counts
      const enrichedMatches = matches.map((match) => ({
        ...match,
        voteCount: voteCountMap.get(match.movieId) || 0,
      }));

      return new PaginatedResponseDto(
        enrichedMatches,
        pagination.page ?? 1,
        pagination.limit ?? 20,
        total,
      );
    }

    // Otherwise, return all matches (backward compatibility)
    const cacheKey = `matches:room:${roomId}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<ResponseMatchDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const matches = await this.prisma.match.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (matches.length === 0) {
      return [];
    }

    // Get all vote counts in a single query using GROUP BY
    const voteCounts = await this.prisma.swipe.groupBy({
      by: ['movieId'],
      where: {
        roomId,
        movieId: {
          in: matches.map((m) => m.movieId),
        },
        value: true,
      },
      _count: {
        id: true,
      },
    });

    // Create a map for O(1) lookup
    const voteCountMap = new Map(
      voteCounts.map((vc) => [vc.movieId, vc._count.id]),
    );

    // Enrich matches with vote counts
    const result = matches.map((match) => ({
      ...match,
      voteCount: voteCountMap.get(match.movieId) || 0,
    }));

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.ROOM_MATCHES);

    return result;
  }
}
