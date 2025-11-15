import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesGateway } from './matches.gateway';

import { ResponseMatchDto } from './dtos';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
  getPaginationParams,
} from '../../common/dtos';

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MatchesGateway))
    private matchesGateway: MatchesGateway,
  ) {}

  async createIfNeeded(
    roomId: string,
    movieId: string,
  ): Promise<ResponseMatchDto | null> {
    const likes = await this.prisma.swipe.count({
      where: { roomId, movieId, value: true },
    });

    if (likes < 2) {
      return null;
    }

    const match = await this.prisma.match.upsert({
      where: { roomId_movieId: { roomId, movieId } },
      update: {},
      create: { roomId, movieId },
      select: { id: true, roomId: true, movieId: true, createdAt: true },
    });

    const matchDto = {
      ...match,
      voteCount: likes,
    };

    // Emit WebSocket event for real-time notification
    this.matchesGateway.emitMatchCreated(roomId, matchDto);

    return matchDto;
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
    return matches.map((match) => ({
      ...match,
      voteCount: voteCountMap.get(match.movieId) || 0,
    }));
  }
}
