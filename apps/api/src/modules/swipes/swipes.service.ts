import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesService } from '../matches/matches.service';
import { SubscriptionService } from '../subscription/subscription.service';

import { ResponseSwipeDto, ResponseCreateSwipeDto } from './dtos';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  USER_SWIPES_IN_ROOM: 2 * 60 * 1000, // 2 minutes
} as const;

@Injectable()
export class SwipesService {
  constructor(
    private prisma: PrismaService,
    private matchesService: MatchesService,
    @Inject(forwardRef(() => SubscriptionService))
    private subscriptionService: SubscriptionService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Invalidate user swipes cache for a specific room
   */
  private async invalidateUserSwipesCache(userId: string, roomId: string): Promise<void> {
    await this.cacheManager.del(`swipes:user:${userId}:room:${roomId}`);
  }

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

    // Check if this is a new swipe (not an update) before checking limits
    const existingSwipe = await this.prisma.swipe.findUnique({
      where: {
        userId_roomId_movieId: { userId, roomId, movieId },
      },
    });

    // Only check swipe limit for new swipes, not updates
    if (!existingSwipe) {
      const swipesCount = await this.prisma.swipe.count({
        where: { userId, roomId },
      });

      const { allowed, limit } = await this.subscriptionService.checkLimit(
        userId,
        'maxSwipes',
        swipesCount,
      );

      if (!allowed) {
        throw new ForbiddenException({
          message: `Swipe limit reached. You can make up to ${limit} swipes per room on your current plan.`,
          code: 'SWIPE_LIMIT_REACHED',
          limit,
          current: swipesCount,
          upgradeRequired: true,
        });
      }
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

    // Invalidate cache after swipe
    await this.invalidateUserSwipesCache(userId, roomId);

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
    const cacheKey = `swipes:user:${userId}:room:${roomId}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<ResponseSwipeDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const swipes = await this.prisma.swipe.findMany({
      where: {
        userId,
        roomId,
      },
    });

    // Store in cache
    await this.cacheManager.set(cacheKey, swipes, CACHE_TTL.USER_SWIPES_IN_ROOM);

    return swipes;
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

    // Invalidate cache after delete
    await this.invalidateUserSwipesCache(userId, roomId);

    return { deleted: true };
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

  async getUserStats(userId: string) {
    // Get all rooms the user is a member of
    const memberships = await this.prisma.roomMember.findMany({
      where: { userId },
      select: { roomId: true },
    });

    const roomIds = memberships.map((m) => m.roomId);

    if (roomIds.length === 0) {
      return {
        totalMatches: 0,
        totalSwipes: 0,
        totalSwipesToday: 0,
      };
    }

    // Get all swipes for this user across all their rooms
    const swipes = await this.prisma.swipe.findMany({
      where: {
        userId,
        roomId: { in: roomIds },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Get all matches in the user's rooms
    const matches = await this.prisma.match.findMany({
      where: {
        roomId: { in: roomIds },
      },
      select: {
        id: true,
      },
    });

    // Calculate swipes today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalSwipesToday = swipes.filter((swipe) => {
      const swipeDate = new Date(swipe.createdAt);
      swipeDate.setHours(0, 0, 0, 0);
      return swipeDate.getTime() === today.getTime();
    }).length;

    return {
      totalMatches: matches.length,
      totalSwipes: swipes.length,
      totalSwipesToday,
    };
  }
}
