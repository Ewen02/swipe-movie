import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesGateway } from './matches.gateway';

import { ResponseMatchDto } from './dtos';

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

  async findByRoom(roomId: string): Promise<ResponseMatchDto[]> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const matches = await this.prisma.match.findMany({
      where: {
        roomId,
      },
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
