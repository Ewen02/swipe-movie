import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';

import { ResponseMatchDto } from './dtos';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.match.upsert({
      where: { roomId_movieId: { roomId, movieId } },
      update: {},
      create: { roomId, movieId },
      select: { id: true, roomId: true, movieId: true, createdAt: true },
    });
  }

  async findByRoom(roomId: string): Promise<ResponseMatchDto[]> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return this.prisma.match.findMany({
      where: {
        roomId,
      },
    });
  }
}
