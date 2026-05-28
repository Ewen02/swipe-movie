import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { MoviesService } from '../movies/movies.service';

// Cache TTL constants (in milliseconds)
const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly moviesService: MoviesService,
  ) {}

  // Resolve a batch of TMDB movie IDs into title/poster/year for the admin
  // panel. Wraps in try/catch because TMDB outages should degrade the admin
  // dashboard, not break it — we fall back to bare IDs.
  private async enrichMovies(
    movieIds: string[],
  ): Promise<
    Map<string, { title: string; posterUrl: string; year: string | null }>
  > {
    const enriched = new Map<
      string,
      { title: string; posterUrl: string; year: string | null }
    >();
    if (movieIds.length === 0) return enriched;
    try {
      const numericIds = movieIds
        .map((id) => Number(id))
        .filter((n) => Number.isFinite(n));
      const details = await this.moviesService.getBatchMovieDetails(numericIds);
      for (const d of details) {
        enriched.set(String(d.id), {
          title: d.title,
          posterUrl: d.posterUrl,
          year: d.releaseDate ? d.releaseDate.slice(0, 4) : null,
        });
      }
    } catch (err) {
      this.logger.warn(
        `enrichMovies: TMDB lookup failed, falling back to bare IDs: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
    return enriched;
  }

  // Same idea for genres: resolve TMDB genre IDs to French names. Single call,
  // cached server-side by MovieDiscoverService, so cheap to repeat.
  private async resolveGenreNames(): Promise<Map<number, string>> {
    const map = new Map<number, string>();
    try {
      const genres = await this.moviesService.getGenres();
      for (const g of genres) map.set(g.id, g.name);
    } catch (err) {
      this.logger.warn(
        `resolveGenreNames: TMDB lookup failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
    return map;
  }

  // Providers come from a region-scoped lookup (FR by default). Same fail-soft
  // pattern — admin shows the IDs if TMDB is unreachable.
  private async resolveProviderNames(): Promise<
    Map<number, { name: string; logoUrl: string | null }>
  > {
    const map = new Map<number, { name: string; logoUrl: string | null }>();
    try {
      const providers = await this.moviesService.getAllWatchProviders('FR');
      for (const p of providers) {
        map.set(p.id, {
          name: p.name,
          logoUrl: p.logoPath || null,
        });
      }
    } catch (err) {
      this.logger.warn(
        `resolveProviderNames: TMDB lookup failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
    return map;
  }

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

  // ============================================================
  // A. Engagement: how deeply users actually use the product
  // ============================================================
  async getEngagementStats() {
    const cacheKey = 'admin:engagement';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Per-user swipe counts (real users only). The distribution buckets help
    // distinguish drive-by signups from real activation.
    const userSwipes = await this.prisma.swipe.groupBy({
      by: ['userId'],
      where: { user: { isGuest: false } },
      _count: { id: true },
      _min: { createdAt: true },
    });

    const userIds = userSwipes.map((u) => u.userId);
    const users =
      userIds.length > 0
        ? await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, createdAt: true },
          })
        : [];
    const userCreatedMap = new Map(users.map((u) => [u.id, u.createdAt]));

    // Time-to-first-swipe (signup → first swipe), in minutes.
    const firstSwipeDeltas: number[] = [];
    for (const row of userSwipes) {
      const created = userCreatedMap.get(row.userId);
      if (!created || !row._min.createdAt) continue;
      const deltaMin =
        (row._min.createdAt.getTime() - created.getTime()) / 60000;
      if (deltaMin >= 0) firstSwipeDeltas.push(deltaMin);
    }

    const swipeCounts = userSwipes.map((u) => u._count.id);
    swipeCounts.sort((a, b) => a - b);

    const percentile = (sorted: number[], p: number) => {
      if (sorted.length === 0) return 0;
      const idx = Math.min(
        sorted.length - 1,
        Math.floor((p / 100) * sorted.length),
      );
      return sorted[idx] ?? 0;
    };

    // Distribution buckets — pick widths that map to product moments:
    // 0 = signed up but never swiped (dead lead)
    // 1-10 = tried but bounced
    // 11-50 = real session
    // 51+ = heavy user
    const buckets = { b0: 0, b1_10: 0, b11_50: 0, b51_plus: 0 };
    for (const c of swipeCounts) {
      if (c === 0) buckets.b0++;
      else if (c <= 10) buckets.b1_10++;
      else if (c <= 50) buckets.b11_50++;
      else buckets.b51_plus++;
    }
    // Account for users that have 0 swipes (not in groupBy result).
    const totalRealUsers = await this.prisma.user.count({
      where: { isGuest: false },
    });
    buckets.b0 += Math.max(0, totalRealUsers - swipeCounts.length);

    // Time-to-first-match (signup → first match in any of their rooms).
    // Match rows don't carry userId, so we join: match.room → room.members.
    const usersWithMatchData = await this.prisma.user.findMany({
      where: { isGuest: false },
      select: {
        id: true,
        createdAt: true,
        members: {
          select: {
            room: {
              select: {
                matches: {
                  select: { createdAt: true },
                  orderBy: { createdAt: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
      take: 2000, // cap so the join doesn't explode on big tables
    });
    const firstMatchDeltas: number[] = [];
    for (const u of usersWithMatchData) {
      let firstMatch: Date | null = null;
      for (const m of u.members) {
        const candidate = m.room.matches[0]?.createdAt;
        if (!candidate) continue;
        if (!firstMatch || candidate < firstMatch) firstMatch = candidate;
      }
      if (firstMatch) {
        const deltaMin = (firstMatch.getTime() - u.createdAt.getTime()) / 60000;
        if (deltaMin >= 0) firstMatchDeltas.push(deltaMin);
      }
    }

    // Like rate: % of swipes that are "yes". Tells us how lenient the catalog
    // feels — a 90% like rate means the algorithm is too easy.
    const [likes, totalSwipes] = await Promise.all([
      this.prisma.swipe.count({ where: { value: true } }),
      this.prisma.swipe.count(),
    ]);

    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((s, n) => s + n, 0) / arr.length : 0;
    const sorted = (arr: number[]) => [...arr].sort((a, b) => a - b);

    const sortedFirstSwipe = sorted(firstSwipeDeltas);
    const sortedFirstMatch = sorted(firstMatchDeltas);

    const result = {
      swipesPerUser: {
        median: percentile(swipeCounts, 50),
        p75: percentile(swipeCounts, 75),
        p95: percentile(swipeCounts, 95),
        max: swipeCounts[swipeCounts.length - 1] ?? 0,
      },
      distribution: buckets,
      timeToFirstSwipeMin: {
        median: Math.round(percentile(sortedFirstSwipe, 50)),
        p75: Math.round(percentile(sortedFirstSwipe, 75)),
        avg: Math.round(avg(firstSwipeDeltas)),
        sampleSize: firstSwipeDeltas.length,
      },
      timeToFirstMatchMin: {
        median: Math.round(percentile(sortedFirstMatch, 50)),
        p75: Math.round(percentile(sortedFirstMatch, 75)),
        avg: Math.round(avg(firstMatchDeltas)),
        sampleSize: firstMatchDeltas.length,
      },
      likeRate: totalSwipes > 0 ? Math.round((likes / totalSwipes) * 100) : 0,
      totalSwipes,
      totalLikes: likes,
    };
    await this.cacheManager.set(cacheKey, result, ADMIN_CACHE_TTL);
    return result;
  }

  // ============================================================
  // B. Viral funnel: how rooms spread and fill up
  // ============================================================
  async getViralStats() {
    const cacheKey = 'admin:viral';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const memberCounts = await this.prisma.roomMember.groupBy({
      by: ['roomId'],
      _count: { id: true },
    });

    const sizes = memberCounts.map((m) => m._count.id);
    sizes.sort((a, b) => a - b);

    const sizeDist = { size1: 0, size2: 0, size3_4: 0, size5_plus: 0 };
    for (const s of sizes) {
      if (s <= 1) sizeDist.size1++;
      else if (s === 2) sizeDist.size2++;
      else if (s <= 4) sizeDist.size3_4++;
      else sizeDist.size5_plus++;
    }

    const totalRooms = await this.prisma.room.count({
      where: { deletedAt: null },
    });
    // Rooms with no member row at all = code generated but nobody joined.
    const roomsWithMembers = memberCounts.length;
    const orphanRooms = Math.max(0, totalRooms - roomsWithMembers);

    const avgRoomSize =
      sizes.length > 0
        ? Math.round((sizes.reduce((s, n) => s + n, 0) / sizes.length) * 10) /
          10
        : 0;

    const multiUserRooms = sizes.filter((s) => s >= 2).length;
    const multiUserRate =
      sizes.length > 0 ? Math.round((multiUserRooms / sizes.length) * 100) : 0;

    // Top inviters: users whose rooms attract the most members.
    const allRoomsWithCreator = await this.prisma.room.findMany({
      where: { deletedAt: null },
      select: {
        createdBy: true,
        _count: { select: { members: true } },
      },
    });
    const inviterMap = new Map<string, { rooms: number; members: number }>();
    for (const r of allRoomsWithCreator) {
      const cur = inviterMap.get(r.createdBy) ?? { rooms: 0, members: 0 };
      cur.rooms++;
      cur.members += r._count.members;
      inviterMap.set(r.createdBy, cur);
    }
    const topInviterIds = Array.from(inviterMap.entries())
      .sort((a, b) => b[1].members - a[1].members)
      .slice(0, 10);
    const inviterUsers =
      topInviterIds.length > 0
        ? await this.prisma.user.findMany({
            where: { id: { in: topInviterIds.map(([id]) => id) } },
            select: { id: true, email: true, name: true, isGuest: true },
          })
        : [];
    const inviterUserMap = new Map(inviterUsers.map((u) => [u.id, u]));
    const topInviters = topInviterIds.map(([id, agg]) => ({
      userId: id,
      email: inviterUserMap.get(id)?.email ?? '(deleted)',
      name: inviterUserMap.get(id)?.name ?? null,
      isGuest: inviterUserMap.get(id)?.isGuest ?? false,
      roomsCreated: agg.rooms,
      totalMembersAttracted: agg.members,
    }));

    const recurringRooms = await this.prisma.room.count({
      where: { deletedAt: null, isRecurring: true },
    });

    const result = {
      avgRoomSize,
      multiUserRate,
      sizeDistribution: sizeDist,
      orphanRooms,
      totalActiveRooms: totalRooms,
      recurringRooms,
      recurringRate:
        totalRooms > 0 ? Math.round((recurringRooms / totalRooms) * 100) : 0,
      topInviters,
    };
    await this.cacheManager.set(cacheKey, result, ADMIN_CACHE_TTL);
    return result;
  }

  // ============================================================
  // D. Content: what the catalog actually looks like in use
  // ============================================================
  async getContentStats(limit = 10) {
    const cacheKey = `admin:content:${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Top swiped movies (vs top matched, which we already expose).
    const [topSwiped, perMovie] = await Promise.all([
      this.prisma.swipe.groupBy({
        by: ['movieId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit,
      }),
      // For per-movie like rate / "controversial" detection we need likes+dislikes.
      // Cap to top 200 most-swiped to keep this tractable.
      this.prisma.swipe.groupBy({
        by: ['movieId', 'value'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1000,
      }),
    ]);

    const movieStats = new Map<string, { likes: number; dislikes: number }>();
    for (const row of perMovie) {
      const cur = movieStats.get(row.movieId) ?? { likes: 0, dislikes: 0 };
      if (row.value) cur.likes += row._count.id;
      else cur.dislikes += row._count.id;
      movieStats.set(row.movieId, cur);
    }

    // Controversial = at least 20 swipes AND like rate between 40-60%.
    // Below the threshold the signal is noise.
    const MIN_SWIPES_FOR_CONTROVERSY = 20;
    const controversial = Array.from(movieStats.entries())
      .map(([movieId, s]) => {
        const total = s.likes + s.dislikes;
        return {
          movieId,
          totalSwipes: total,
          likeRate: total > 0 ? Math.round((s.likes / total) * 100) : 0,
        };
      })
      .filter(
        (m) =>
          m.totalSwipes >= MIN_SWIPES_FOR_CONTROVERSY &&
          m.likeRate >= 40 &&
          m.likeRate <= 60,
      )
      .sort((a, b) => b.totalSwipes - a.totalSwipes)
      .slice(0, limit);

    // "Dead" movies: heavily swiped but never matched. Find candidates by
    // intersecting top-swiped with movies that have zero matches.
    const matchedMovieIds = new Set(
      (await this.prisma.match.groupBy({ by: ['movieId'] })).map(
        (m) => m.movieId,
      ),
    );
    const deadMovies = Array.from(movieStats.entries())
      .filter(
        ([id, s]) =>
          !matchedMovieIds.has(id) &&
          s.likes + s.dislikes >= MIN_SWIPES_FOR_CONTROVERSY,
      )
      .map(([movieId, s]) => ({
        movieId,
        totalSwipes: s.likes + s.dislikes,
        likes: s.likes,
      }))
      .sort((a, b) => b.totalSwipes - a.totalSwipes)
      .slice(0, limit);

    // Top genres (from rooms — better proxy than aggregating each swipe's TMDB
    // metadata which we'd have to refetch).
    const genreCounts = await this.prisma.room.groupBy({
      by: ['genreId'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    // Top providers — unnest the array.
    const allRoomProviders = await this.prisma.room.findMany({
      where: { deletedAt: null },
      select: { watchProviders: true },
    });
    const providerCount = new Map<number, number>();
    for (const r of allRoomProviders) {
      for (const p of r.watchProviders) {
        providerCount.set(p, (providerCount.get(p) ?? 0) + 1);
      }
    }
    const topProviders = Array.from(providerCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([providerId, count]) => ({ providerId, roomCount: count }));

    // Movie/TV split.
    const [movieRooms, tvRooms] = await Promise.all([
      this.prisma.room.count({ where: { deletedAt: null, type: 'MOVIE' } }),
      this.prisma.room.count({ where: { deletedAt: null, type: 'TV' } }),
    ]);

    // Enrich IDs into titles/posters/genre names/provider names so the admin
    // doesn't have to mentally translate TMDB IDs. All lookups go through
    // batch-cached TMDB calls and fail soft (we just return the raw ID).
    const allMovieIds = Array.from(
      new Set([
        ...topSwiped.map((m) => m.movieId),
        ...controversial.map((m) => m.movieId),
        ...deadMovies.map((m) => m.movieId),
      ]),
    );
    const [movieMeta, genreMap, providerMap] = await Promise.all([
      this.enrichMovies(allMovieIds),
      this.resolveGenreNames(),
      this.resolveProviderNames(),
    ]);

    const decorateMovie = (movieId: string) => {
      const meta = movieMeta.get(movieId);
      return {
        title: meta?.title ?? null,
        posterUrl: meta?.posterUrl ?? null,
        year: meta?.year ?? null,
      };
    };

    const result = {
      topSwiped: topSwiped.map((m) => ({
        movieId: m.movieId,
        swipeCount: m._count.id,
        ...decorateMovie(m.movieId),
      })),
      controversial: controversial.map((m) => ({
        ...m,
        ...decorateMovie(m.movieId),
      })),
      deadMovies: deadMovies.map((m) => ({
        ...m,
        ...decorateMovie(m.movieId),
      })),
      topGenres: genreCounts.map((g) => ({
        genreId: g.genreId,
        roomCount: g._count.id,
        name: genreMap.get(g.genreId) ?? null,
      })),
      topProviders: topProviders.map((p) => ({
        ...p,
        name: providerMap.get(p.providerId)?.name ?? null,
        logoUrl: providerMap.get(p.providerId)?.logoUrl ?? null,
      })),
      mediaTypeSplit: { movie: movieRooms, tv: tvRooms },
    };
    await this.cacheManager.set(cacheKey, result, ADMIN_CACHE_TTL);
    return result;
  }

  // ============================================================
  // E. Revenue: MRR, ARPU, churn, LTV
  // ============================================================
  async getRevenueStats() {
    const cacheKey = 'admin:revenue';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // We don't store prices in the DB; the canonical source is
    // packages/subscription. Hardcoding here would drift — instead we count
    // active paying subscriptions per plan and let the caller resolve price.
    const activeSubs = await this.prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trialing'] },
        deletedAt: null,
      },
      select: {
        plan: true,
        status: true,
        periodStart: true,
        periodEnd: true,
        trialEnd: true,
        createdAt: true,
      },
    });

    const planCounts: Record<string, { active: number; trialing: number }> = {};
    for (const s of activeSubs) {
      const slot = (planCounts[s.plan] ??= { active: 0, trialing: 0 });
      if (s.status === 'trialing') slot.trialing++;
      else slot.active++;
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

    // Churn proxy: subs cancelled (deletedAt set) in last 30/90d, relative to
    // active+cancelled in the same window. Not actuarial but useful directional.
    const [cancelled30d, cancelled90d] = await Promise.all([
      this.prisma.subscription.count({
        where: { deletedAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.subscription.count({
        where: { deletedAt: { gte: ninetyDaysAgo } },
      }),
    ]);

    const activeCount = Object.values(planCounts).reduce(
      (s, v) => s + v.active + v.trialing,
      0,
    );
    const churnRate30d =
      activeCount + cancelled30d > 0
        ? Math.round((cancelled30d / (activeCount + cancelled30d)) * 100)
        : 0;

    // Trial-end conversion: subs with trialEnd in past 30d that are still
    // active = trial converted to paid.
    const [trialEnded30d, trialConverted30d] = await Promise.all([
      this.prisma.subscription.count({
        where: {
          trialEnd: { gte: thirtyDaysAgo, lte: new Date() },
        },
      }),
      this.prisma.subscription.count({
        where: {
          trialEnd: { gte: thirtyDaysAgo, lte: new Date() },
          status: 'active',
          deletedAt: null,
        },
      }),
    ]);

    const trialToPaidRate =
      trialEnded30d > 0
        ? Math.round((trialConverted30d / trialEnded30d) * 100)
        : 0;

    // Avg subscription age (days) for currently-active paying subs — proxy for
    // tenure / LTV trend.
    const paidActive = activeSubs.filter(
      (s) => s.status === 'active' && s.plan !== 'free' && s.plan !== 'FREE',
    );
    const avgTenureDays =
      paidActive.length > 0
        ? Math.round(
            paidActive.reduce(
              (sum, s) => sum + (Date.now() - s.createdAt.getTime()) / 86400000,
              0,
            ) / paidActive.length,
          )
        : 0;

    const result = {
      planCounts,
      activePaying: paidActive.length,
      cancelled30d,
      cancelled90d,
      churnRate30d,
      trialEnded30d,
      trialConverted30d,
      trialToPaidRate,
      avgTenureDays,
    };
    await this.cacheManager.set(cacheKey, result, ADMIN_CACHE_TTL);
    return result;
  }

  // ============================================================
  // F. Performance / health
  // ============================================================
  async getPerformanceStats() {
    const cacheKey = 'admin:perf';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // We don't have a request-log table — so this surfaces what we *do* have:
    // - process uptime (already on /health)
    // - cache stats from the in-memory manager
    // - per-table row counts to spot tables that have grown unexpectedly
    const uptimeSec = Math.round(process.uptime());
    const memoryMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

    const [users, rooms, swipes, matches, sessions, subscriptions] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.room.count(),
        this.prisma.swipe.count(),
        this.prisma.match.count(),
        this.prisma.session.count(),
        this.prisma.subscription.count(),
      ]);

    const result = {
      process: {
        uptimeSec,
        heapUsedMb: memoryMb,
        nodeVersion: process.version,
      },
      tableSizes: { users, rooms, swipes, matches, sessions, subscriptions },
      // Cache TTL we use for the admin endpoints — exposes the freshness
      // contract so users know data can be up to N seconds stale.
      adminCacheTtlSec: Math.round(ADMIN_CACHE_TTL / 1000),
    };
    await this.cacheManager.set(cacheKey, result, ADMIN_CACHE_TTL);
    return result;
  }
}
