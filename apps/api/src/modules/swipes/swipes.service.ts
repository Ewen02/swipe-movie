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

  async getUserStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all user's rooms
    const userRooms = await this.prisma.roomMember.findMany({
      where: { userId },
      select: { roomId: true },
    });

    const roomIds = userRooms.map((r) => r.roomId);

    if (roomIds.length === 0) {
      return {
        totalMatches: 0,
        totalSwipes: 0,
        totalSwipesToday: 0,
      };
    }

    // Count total matches across all user's rooms
    const totalMatches = await this.prisma.match.count({
      where: { roomId: { in: roomIds } },
    });

    // Count total swipes by user
    const totalSwipes = await this.prisma.swipe.count({
      where: { userId },
    });

    // Count swipes today
    const totalSwipesToday = await this.prisma.swipe.count({
      where: {
        userId,
        createdAt: { gte: today },
      },
    });

    return {
      totalMatches,
      totalSwipes,
      totalSwipesToday,
    };
  }

  async getRoomAnalytics(roomId: string, userId: string) {
    // Verify room exists and user is a member
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isMember = room.members.some((m) => m.user.id === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room');
    }

    // Get all swipes for this room
    const swipes = await this.prisma.swipe.findMany({
      where: { roomId },
      select: {
        id: true,
        userId: true,
        movieId: true,
        value: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all matches for this room
    const matches = await this.prisma.match.findMany({
      where: { roomId },
      select: {
        id: true,
        movieId: true,
        createdAt: true,
      },
    });

    // Calculate statistics
    const totalSwipes = swipes.length;
    const totalLikes = swipes.filter((s) => s.value === true).length;
    const totalDislikes = swipes.filter((s) => s.value === false).length;
    const totalMatches = matches.length;

    // Member activity
    const memberActivity = room.members.map((member) => {
      const memberSwipes = swipes.filter((s) => s.userId === member.user.id);
      const memberLikes = memberSwipes.filter((s) => s.value === true).length;
      const memberDislikes = memberSwipes.filter(
        (s) => s.value === false,
      ).length;

      return {
        userId: member.user.id,
        userName: member.user.name,
        totalSwipes: memberSwipes.length,
        likes: memberLikes,
        dislikes: memberDislikes,
        likePercentage:
          memberSwipes.length > 0
            ? Math.round((memberLikes / memberSwipes.length) * 100)
            : 0,
      };
    });

    // Most liked/disliked movies (top 5)
    const movieStats = swipes.reduce(
      (acc, swipe) => {
        if (!acc[swipe.movieId]) {
          acc[swipe.movieId] = { likes: 0, dislikes: 0, movieId: swipe.movieId };
        }
        if (swipe.value) {
          acc[swipe.movieId].likes++;
        } else {
          acc[swipe.movieId].dislikes++;
        }
        return acc;
      },
      {} as Record<string, { likes: number; dislikes: number; movieId: string }>,
    );

    const mostLiked = Object.values(movieStats)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
      .map((m) => ({ movieId: m.movieId, likes: m.likes }));

    const mostDisliked = Object.values(movieStats)
      .sort((a, b) => b.dislikes - a.dislikes)
      .slice(0, 5)
      .map((m) => ({ movieId: m.movieId, dislikes: m.dislikes }));

    // Activity over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSwipes = swipes.filter(
      (s) => s.createdAt >= sevenDaysAgo,
    );

    const dailyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const daySwipes = recentSwipes.filter(
        (s) => s.createdAt >= date && s.createdAt < nextDate,
      );

      return {
        date: date.toISOString().split('T')[0],
        swipes: daySwipes.length,
        likes: daySwipes.filter((s) => s.value === true).length,
        dislikes: daySwipes.filter((s) => s.value === false).length,
      };
    });

    // Match rate (percentage of likes that resulted in a match)
    const matchRate =
      totalLikes > 0 ? Math.round((totalMatches / totalLikes) * 100) : 0;

    return {
      overview: {
        totalSwipes,
        totalLikes,
        totalDislikes,
        totalMatches,
        likePercentage:
          totalSwipes > 0 ? Math.round((totalLikes / totalSwipes) * 100) : 0,
        matchRate,
      },
      memberActivity: memberActivity.sort((a, b) => b.totalSwipes - a.totalSwipes),
      mostLiked,
      mostDisliked,
      dailyActivity,
    };
  }
}
