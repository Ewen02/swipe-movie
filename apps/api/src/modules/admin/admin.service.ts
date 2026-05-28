import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';

// Cache TTL constants (in milliseconds)
const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getGlobalStats() {
    const cacheKey = 'admin:global-stats';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    // `totalUsers` here is authenticated accounts only — guests are tracked
    // separately in getTrialStats() so KPIs aren't inflated by ephemeral
    // trial sessions that get cleaned up at T+24h.
    const [
      totalUsers,
      totalGuests,
      totalRooms,
      totalSwipes,
      totalMatches,
      activeTodayResult,
      activeWeekResult,
      activeMonthResult,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isGuest: false } }),
      this.prisma.user.count({ where: { isGuest: true } }),
      this.prisma.room.count({ where: { deletedAt: null } }),
      this.prisma.swipe.count(),
      this.prisma.match.count(),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: todayStart },
          user: { isGuest: false },
        },
      }),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: weekAgo },
          user: { isGuest: false },
        },
      }),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: monthAgo },
          user: { isGuest: false },
        },
      }),
    ]);

    const result = {
      totalUsers,
      totalGuests,
      totalRooms,
      totalSwipes,
      totalMatches,
      activeToday: activeTodayResult.length,
      activeWeek: activeWeekResult.length,
      activeMonth: activeMonthResult.length,
    };
    await this.cacheManager.set(cacheKey, result, ADMIN_CACHE_TTL);
    return result;
  }

  async getRetention() {
    const cacheKey = 'admin:retention';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

    // Retention cohorts must only count authenticated users — guests have a
    // hard 24h ceiling so they'd always be reported as "not retained" past J1
    // and would drag every cohort to 0%.
    const [users, lastSwipes] = await Promise.all([
      this.prisma.user.findMany({
        where: { createdAt: { gte: ninetyDaysAgo }, isGuest: false },
        select: { id: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        _max: { createdAt: true },
      }),
    ]);

    const lastSwipeMap = new Map(
      lastSwipes.map((s) => [s.userId, s._max.createdAt]),
    );

    // Group users into weekly cohorts
    const cohorts = new Map<string, { users: string[]; createdAt: Date }>();

    for (const user of users) {
      const weekStart = new Date(user.createdAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().split('T')[0] ?? '';

      if (!cohorts.has(key)) {
        cohorts.set(key, { users: [], createdAt: weekStart });
      }
      cohorts.get(key)!.users.push(user.id);
    }

    const userDateMap = new Map(users.map((u) => [u.id, u.createdAt]));

    const result = Array.from(cohorts.entries()).map(([week, cohort]) => {
      const total = cohort.users.length;
      let retainedJ1 = 0;
      let retainedJ7 = 0;
      let retainedJ30 = 0;

      for (const userId of cohort.users) {
        const lastSwipe = lastSwipeMap.get(userId);
        if (!lastSwipe) continue;
        const userCreated = userDateMap.get(userId)!;
        const diff = lastSwipe.getTime() - userCreated.getTime();
        if (diff >= 30 * 86400000) {
          retainedJ30++;
          retainedJ7++;
          retainedJ1++;
        } else if (diff >= 7 * 86400000) {
          retainedJ7++;
          retainedJ1++;
        } else if (diff >= 1 * 86400000) {
          retainedJ1++;
        }
      }

      return {
        week,
        users: total,
        j1: total > 0 ? Math.round((retainedJ1 / total) * 100) : 0,
        j7: total > 0 ? Math.round((retainedJ7 / total) * 100) : 0,
        j30: total > 0 ? Math.round((retainedJ30 / total) * 100) : 0,
      };
    });

    const retentionResult = { cohorts: result };
    await this.cacheManager.set(cacheKey, retentionResult, ADMIN_CACHE_TTL);
    return retentionResult;
  }

  async getUsers(
    page: number,
    limit: number,
    filter: 'all' | 'users' | 'guests' = 'users',
  ) {
    const skip = (page - 1) * limit;

    // Default to authenticated-only so the admin table is not flooded with
    // ephemeral trial guests — pass filter=all or filter=guests to override.
    const where =
      filter === 'all'
        ? {}
        : filter === 'guests'
          ? { isGuest: true }
          : { isGuest: false };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          roles: true,
          createdAt: true,
          isGuest: true,
          convertedFromGuestAt: true,
          _count: {
            select: {
              swipes: true,
              members: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Fetch last swipe only for the users on the current page (avoids N+1 / full-table groupBy)
    const userIds = users.map((u) => u.id);
    const lastSwipes =
      userIds.length > 0
        ? await this.prisma.swipe.groupBy({
            by: ['userId'],
            where: { userId: { in: userIds } },
            _max: { createdAt: true },
          })
        : [];

    const lastSwipeMap = new Map(
      lastSwipes.map((s) => [s.userId, s._max.createdAt]),
    );

    const data = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      createdAt: user.createdAt,
      isGuest: user.isGuest,
      convertedFromGuestAt: user.convertedFromGuestAt,
      swipesCount: user._count.swipes,
      roomsCount: user._count.members,
      lastActive: lastSwipeMap.get(user.id) ?? null,
    }));

    return {
      data,
      total,
      page,
      limit,
      filter,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDailyActivity(days = 30): Promise<{
    days: Array<{
      date: string;
      swipes: number;
      matches: number;
      newUsers: number;
      newGuests: number;
      newConversions: number;
      newRooms: number;
    }>;
  }> {
    const cacheKey = `admin:daily-activity:${days}`;
    const cached = await this.cacheManager.get<{
      days: Array<{
        date: string;
        swipes: number;
        matches: number;
        newUsers: number;
        newGuests: number;
        newConversions: number;
        newRooms: number;
      }>;
    }>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 86400000);
    startDate.setHours(0, 0, 0, 0);

    // Split signups into authenticated users vs guests so the chart shows the
    // true growth signal alongside top-of-funnel trial acquisition. Also pull
    // guest→user conversions so we can plot the funnel close.
    const [swipes, matches, newUsers, newGuests, newConversions, newRooms] =
      await Promise.all([
        this.prisma.swipe.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true },
        }),
        this.prisma.match.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true },
        }),
        this.prisma.user.findMany({
          where: { createdAt: { gte: startDate }, isGuest: false },
          select: { createdAt: true },
        }),
        this.prisma.user.findMany({
          where: { createdAt: { gte: startDate }, isGuest: true },
          select: { createdAt: true },
        }),
        this.prisma.user.findMany({
          where: { convertedFromGuestAt: { gte: startDate } },
          select: { convertedFromGuestAt: true },
        }),
        this.prisma.room.findMany({
          where: { createdAt: { gte: startDate }, deletedAt: null },
          select: { createdAt: true },
        }),
      ]);

    // Pre-bucket data by date string to avoid O(n*days) filtering
    const bucketByDate = (items: { createdAt: Date }[]) => {
      const map = new Map<string, number>();
      for (const item of items) {
        const key = item.createdAt.toISOString().split('T')[0] ?? '';
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      return map;
    };

    const swipeBuckets = bucketByDate(swipes);
    const matchBuckets = bucketByDate(matches);
    const userBuckets = bucketByDate(newUsers);
    const guestBuckets = bucketByDate(newGuests);
    const conversionBuckets = bucketByDate(
      newConversions
        .filter((c) => c.convertedFromGuestAt !== null)
        .map((c) => ({ createdAt: c.convertedFromGuestAt as Date })),
    );
    const roomBuckets = bucketByDate(newRooms);

    const result = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - 1 - i));
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split('T')[0] ?? '';

      return {
        date: key,
        swipes: swipeBuckets.get(key) ?? 0,
        matches: matchBuckets.get(key) ?? 0,
        newUsers: userBuckets.get(key) ?? 0,
        newGuests: guestBuckets.get(key) ?? 0,
        newConversions: conversionBuckets.get(key) ?? 0,
        newRooms: roomBuckets.get(key) ?? 0,
      };
    });

    const activityResult = { days: result };
    await this.cacheManager.set(cacheKey, activityResult, ADMIN_CACHE_TTL);
    return activityResult;
  }

  async getConversionStats() {
    const cacheKey = 'admin:conversions';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Funnel is computed over authenticated users only. Guests have
    // onboardingCompleted=true by default (they skip onboarding) and would
    // drag the denominator up while contributing fake "100% onboarded" rows,
    // which made the onboarding rate look artificially low.
    const [
      totalUsers,
      onboardedUsers,
      usersWithRoom,
      usersWithSwipe,
      totalMatchesCount,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isGuest: false } }),
      this.prisma.user.count({
        where: { isGuest: false, onboardingCompleted: true },
      }),
      this.prisma.roomMember
        .findMany({
          where: { user: { isGuest: false } },
          distinct: ['userId'],
          select: { userId: true },
        })
        .then((r) => r.length),
      this.prisma.swipe
        .findMany({
          where: { user: { isGuest: false } },
          distinct: ['userId'],
          select: { userId: true },
        })
        .then((r) => r.length),
      this.prisma.match.count(),
    ]);

    const calc = (n: number) =>
      totalUsers > 0 ? Math.round((n / totalUsers) * 100) : 0;

    const conversionResult = {
      totalUsers,
      onboarded: { count: onboardedUsers, rate: calc(onboardedUsers) },
      withRoom: { count: usersWithRoom, rate: calc(usersWithRoom) },
      withSwipe: { count: usersWithSwipe, rate: calc(usersWithSwipe) },
      totalMatches: totalMatchesCount,
    };
    await this.cacheManager.set(cacheKey, conversionResult, ADMIN_CACHE_TTL);
    return conversionResult;
  }

  async getSubscriptionStats() {
    const cacheKey = 'admin:subscriptions';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const subscriptions = await this.prisma.subscription.groupBy({
      by: ['plan', 'status'],
      _count: { id: true },
    });

    const plans: Record<string, { active: number; total: number }> = {};
    for (const sub of subscriptions) {
      if (!plans[sub.plan]) {
        plans[sub.plan] = { active: 0, total: 0 };
      }
      plans[sub.plan]!.total += sub._count.id;
      if (sub.status === 'active' || sub.status === 'trialing') {
        plans[sub.plan]!.active += sub._count.id;
      }
    }

    const totalPaid = Object.entries(plans)
      .filter(([plan]) => plan !== 'free')
      .reduce((sum, [, v]) => sum + v.active, 0);

    // Denominator excludes guests: they're on the synthetic TRIAL plan, can
    // never have a Subscription row, and including them sinks the paid rate
    // toward zero (e.g. 5 paid / 100 mixed = 5% vs 5 paid / 20 real = 25%).
    const totalUsers = await this.prisma.user.count({
      where: { isGuest: false },
    });

    const subsResult = {
      plans,
      totalPaid,
      totalUsers,
      paidRate: totalUsers > 0 ? Math.round((totalPaid / totalUsers) * 100) : 0,
    };
    await this.cacheManager.set(cacheKey, subsResult, ADMIN_CACHE_TTL);
    return subsResult;
  }

  async getTrialStats() {
    const cacheKey = 'admin:trial-stats';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

    const ghostUserIds = await this.prisma.user.findMany({
      where: { isGuest: true },
      select: { id: true },
    });
    const ghostIds = ghostUserIds.map((u) => u.id);

    const [
      activeGhosts,
      totalGhosts,
      totalGhostsExpired,
      ghostSwipes,
      ghostRoomIds,
      totalConversions,
      conversions30d,
      conversionSwipesAgg,
      engagedActiveGhosts,
      guestsCreated30d,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { isGuest: true, createdAt: { gte: oneDayAgo } },
      }),
      this.prisma.user.count({ where: { isGuest: true } }),
      this.prisma.user.count({
        where: { isGuest: true, createdAt: { lt: oneDayAgo } },
      }),
      ghostIds.length > 0
        ? this.prisma.swipe.count({
            where: { userId: { in: ghostIds } },
          })
        : Promise.resolve(0),
      ghostIds.length > 0
        ? this.prisma.room
            .findMany({
              where: { createdBy: { in: ghostIds }, deletedAt: null },
              select: { id: true },
            })
            .then((rooms) => rooms.map((r) => r.id))
        : Promise.resolve([] as string[]),
      // Lifetime conversions: real users that started as guests.
      this.prisma.user.count({
        where: { convertedFromGuestAt: { not: null } },
      }),
      this.prisma.user.count({
        where: { convertedFromGuestAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.user.aggregate({
        where: { convertedFromGuestAt: { not: null } },
        _avg: { guestSwipesAtConversion: true },
        _sum: { guestSwipesAtConversion: true },
      }),
      // Engaged-but-still-active ghosts: high-intent trials that haven't
      // converted yet — these are the at-risk segment (will be wiped at T+24h
      // by the cleanup cron if they don't sign up).
      this.prisma.user
        .findMany({
          where: { isGuest: true, createdAt: { gte: oneDayAgo } },
          select: {
            id: true,
            _count: { select: { swipes: true } },
          },
        })
        .then((rows) => rows.filter((u) => u._count.swipes >= 5).length),
      // Total guests created in last 30d (denominator for 30d conversion
      // rate). Includes already-deleted/converted ones via summing.
      this.prisma.user.count({
        where: {
          isGuest: true,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    const ghostMatches =
      ghostRoomIds.length > 0
        ? await this.prisma.match.count({
            where: { roomId: { in: ghostRoomIds } },
          })
        : 0;

    // 30d conversion rate denominator approximates "guests who entered the
    // funnel in the last 30d". The numerator is converted users (which were
    // guests at some point). It's an approximation because converted guests
    // no longer have isGuest=true, so we sum both.
    const guestFunnel30d = guestsCreated30d + conversions30d;
    const conversionRate30d =
      guestFunnel30d > 0
        ? Math.round((conversions30d / guestFunnel30d) * 100)
        : 0;

    const trialResult = {
      activeGhosts,
      totalGhosts,
      totalGhostsExpired,
      ghostSwipes,
      ghostMatches,
      engagedActiveGhosts,
      totalConversions,
      conversions30d,
      conversionRate30d,
      avgGuestSwipesAtConversion:
        conversionSwipesAgg._avg.guestSwipesAtConversion ?? 0,
      totalGuestSwipesConverted:
        conversionSwipesAgg._sum.guestSwipesAtConversion ?? 0,
    };
    await this.cacheManager.set(cacheKey, trialResult, ADMIN_CACHE_TTL);
    return trialResult;
  }

  async getTopMatches(limit = 10) {
    const cacheKey = `admin:top-matches:${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const matches = await this.prisma.match.groupBy({
      by: ['movieId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const topMatchesResult = {
      movies: matches.map((m) => ({
        movieId: m.movieId,
        matchCount: m._count.id,
      })),
    };
    await this.cacheManager.set(cacheKey, topMatchesResult, ADMIN_CACHE_TTL);
    return topMatchesResult;
  }
}
