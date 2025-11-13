import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesService } from '../matches/matches.service';

import { ResponseSwipeDto, ResponseCreateSwipeDto } from './dtos';

@Injectable()
export class SwipesService {
  constructor(
    private prisma: PrismaService,
    private matchesService: MatchesService,
  ) {}

  async create(
    userId: string,
    roomId: string,
    movieId: string,
    value: boolean,
  ): Promise<ResponseCreateSwipeDto> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const swipe = await this.prisma.swipe.upsert({
      where: {
        userId_roomId_movieId: {
          userId,
          roomId,
          movieId,
        },
      },
      update: {
        value,
      },
      create: {
        userId,
        roomId,
        movieId,
        value,
      },
      select: {
        id: true,
        userId: true,
        roomId: true,
        movieId: true,
        value: true,
        createdAt: true,
      },
    });

    const match = value
      ? await this.matchesService.createIfNeeded(roomId, movieId)
      : null;
    return { ...swipe, matchCreated: !!match };
  }

  async findByRoom(roomId: string): Promise<ResponseSwipeDto[]> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return this.prisma.swipe.findMany({
      where: { roomId },
    });
  }

  async findByUser(userId: string): Promise<ResponseSwipeDto[]> {
    return this.prisma.swipe.findMany({
      where: { userId },
    });
  }

  async findByUserInRoom(
    userId: string,
    roomId: string,
  ): Promise<ResponseSwipeDto[]> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.prisma.swipe.findMany({
      where: {
        userId,
        roomId,
      },
    });
  }
}
