import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    // Verify user is a member of the room
    const member = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
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

  async delete(
    userId: string,
    roomId: string,
    movieId: string,
  ): Promise<{ deleted: boolean }> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Find the swipe to check if it was a like (value: true)
    const swipe = await this.prisma.swipe.findUnique({
      where: {
        userId_roomId_movieId: {
          userId,
          roomId,
          movieId,
        },
      },
    });

    if (!swipe) {
      // Swipe doesn't exist, nothing to delete
      return { deleted: false };
    }

    const wasLike = swipe.value;

    // Delete the swipe
    await this.prisma.swipe.delete({
      where: {
        userId_roomId_movieId: {
          userId,
          roomId,
          movieId,
        },
      },
    });

    // If it was a like, check if we need to delete the match
    if (wasLike) {
      const remainingLikes = await this.prisma.swipe.count({
        where: { roomId, movieId, value: true },
      });

      // If less than 2 likes remain, delete the match
      if (remainingLikes < 2) {
        await this.prisma.match.deleteMany({
          where: { roomId, movieId },
        });
      }
    }

    return { deleted: true };
  }
}
