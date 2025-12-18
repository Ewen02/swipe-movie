import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesService } from '../matches/matches.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { RecommendationsService } from '../recommendations/recommendations.service';

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
    @Inject(forwardRef(() => RecommendationsService))
    private recommendationsService: RecommendationsService,
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

    // Invalidate caches after swipe
    await Promise.all([
      this.invalidateUserSwipesCache(userId, roomId),
      this.recommendationsService.invalidateRoomRecommendationsCache(roomId),
    ]);

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

      // If less than 2 likes remain, delete the match via matchesService
      // This will also emit the WebSocket event to notify other users
      if (remainingLikes < 2) {
        await this.matchesService.deleteMatch(roomId, movieId);
      }
    }

    // Invalidate caches after delete
    await Promise.all([
      this.invalidateUserSwipesCache(userId, roomId),
      this.recommendationsService.invalidateRoomRecommendationsCache(roomId),
    ]);

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

    // Use parallel queries with aggregations for better performance
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      // Aggregated overview stats
      overviewStats,
      // Total matches count
      totalMatches,
      // Member activity aggregated by userId and value
      memberStats,
      // Movie stats aggregated by movieId and value
      movieStats,
      // Recent swipes for daily activity (only last 7 days)
      recentSwipes,
    ] = await Promise.all([
      // Overview: group by value to get likes/dislikes counts
      this.prisma.swipe.groupBy({
        by: ['value'],
        where: { roomId },
        _count: { id: true },
      }),
      // Matches count
      this.prisma.match.count({ where: { roomId } }),
      // Member activity: group by userId and value
      this.prisma.swipe.groupBy({
        by: ['userId', 'value'],
        where: { roomId },
        _count: { id: true },
      }),
      // Movie stats: group by movieId and value
      this.prisma.swipe.groupBy({
        by: ['movieId', 'value'],
        where: { roomId },
        _count: { id: true },
      }),
      // Only fetch recent swipes for daily activity calculation
      this.prisma.swipe.findMany({
        where: { roomId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, value: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Calculate overview from aggregated data
    const totalLikes = overviewStats.find(s => s.value === true)?._count.id || 0;
    const totalDislikes = overviewStats.find(s => s.value === false)?._count.id || 0;
    const totalSwipes = totalLikes + totalDislikes;

    // Build member activity from aggregated stats
    const memberActivity = room.members.map((member) => {
      const userStats = memberStats.filter(s => s.userId === member.user.id);
      const memberLikes = userStats.find(s => s.value === true)?._count.id || 0;
      const memberDislikes = userStats.find(s => s.value === false)?._count.id || 0;
      const memberTotalSwipes = memberLikes + memberDislikes;

      return {
        userId: member.user.id,
        userName: member.user.name,
        totalSwipes: memberTotalSwipes,
        likes: memberLikes,
        dislikes: memberDislikes,
        likePercentage:
          memberTotalSwipes > 0
            ? Math.round((memberLikes / memberTotalSwipes) * 100)
            : 0,
      };
    });

    // Build movie stats map from aggregated data
    const movieStatsMap = new Map<string, { likes: number; dislikes: number }>();
    movieStats.forEach(stat => {
      if (!movieStatsMap.has(stat.movieId)) {
        movieStatsMap.set(stat.movieId, { likes: 0, dislikes: 0 });
      }
      const stats = movieStatsMap.get(stat.movieId)!;
      if (stat.value) {
        stats.likes = stat._count.id;
      } else {
        stats.dislikes = stat._count.id;
      }
    });

    const mostLiked = Array.from(movieStatsMap.entries())
      .map(([movieId, stats]) => ({ movieId, likes: stats.likes }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);

    const mostDisliked = Array.from(movieStatsMap.entries())
      .map(([movieId, stats]) => ({ movieId, dislikes: stats.dislikes }))
      .sort((a, b) => b.dislikes - a.dislikes)
      .slice(0, 5);

    // Calculate daily activity from recent swipes (client-side for simplicity)
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

    // Calculate today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Use parallel count queries instead of fetching all data
    const [totalSwipes, totalSwipesToday, totalMatches] = await Promise.all([
      // Total swipes count
      this.prisma.swipe.count({
        where: {
          userId,
          roomId: { in: roomIds },
        },
      }),
      // Swipes today count
      this.prisma.swipe.count({
        where: {
          userId,
          roomId: { in: roomIds },
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Total matches in user's rooms
      this.prisma.match.count({
        where: {
          roomId: { in: roomIds },
        },
      }),
    ]);

    return {
      totalMatches,
      totalSwipes,
      totalSwipesToday,
    };
  }
}
