import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalStats() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    const [
      totalUsers,
      totalRooms,
      totalSwipes,
      totalMatches,
      activeTodayResult,
      activeWeekResult,
      activeMonthResult,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.room.count({ where: { deletedAt: null } }),
      this.prisma.swipe.count(),
      this.prisma.match.count(),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: todayStart } },
      }),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: weekAgo } },
      }),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: monthAgo } },
      }),
    ]);

    return {
      totalUsers,
      totalRooms,
      totalSwipes,
      totalMatches,
      activeToday: activeTodayResult.length,
      activeWeek: activeWeekResult.length,
      activeMonth: activeMonthResult.length,
    };
  }

  async getRetention() {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

    const [users, lastSwipes] = await Promise.all([
      this.prisma.user.findMany({
        where: { createdAt: { gte: ninetyDaysAgo } },
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
    const cohorts = new Map<
      string,
      { users: string[]; createdAt: Date }
    >();

    for (const user of users) {
      const weekStart = new Date(user.createdAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().split('T')[0];

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
        if (diff >= 30 * 86400000) { retainedJ30++; retainedJ7++; retainedJ1++; }
        else if (diff >= 7 * 86400000) { retainedJ7++; retainedJ1++; }
        else if (diff >= 1 * 86400000) { retainedJ1++; }
      }

      return {
        week,
        users: total,
        j1: total > 0 ? Math.round((retainedJ1 / total) * 100) : 0,
        j7: total > 0 ? Math.round((retainedJ7 / total) * 100) : 0,
        j30: total > 0 ? Math.round((retainedJ30 / total) * 100) : 0,
      };
    });

    return { cohorts: result };
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total, lastSwipes] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          roles: true,
          createdAt: true,
          _count: {
            select: {
              swipes: true,
              members: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
      this.prisma.swipe.groupBy({
        by: ['userId'],
        _max: { createdAt: true },
      }),
    ]);

    const lastSwipeMap = new Map(
      lastSwipes.map((s) => [s.userId, s._max.createdAt]),
    );

    const data = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      createdAt: user.createdAt,
      swipesCount: user._count.swipes,
      roomsCount: user._count.members,
      lastActive: lastSwipeMap.get(user.id) ?? null,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDailyActivity(days = 30) {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 86400000);
    startDate.setHours(0, 0, 0, 0);

    const [swipes, matches, newUsers, newRooms] = await Promise.all([
      this.prisma.swipe.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      this.prisma.match.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
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
        const key = item.createdAt.toISOString().split('T')[0];
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      return map;
    };

    const swipeBuckets = bucketByDate(swipes);
    const matchBuckets = bucketByDate(matches);
    const userBuckets = bucketByDate(newUsers);
    const roomBuckets = bucketByDate(newRooms);

    const result = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - 1 - i));
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split('T')[0];

      return {
        date: key,
        swipes: swipeBuckets.get(key) ?? 0,
        matches: matchBuckets.get(key) ?? 0,
        newUsers: userBuckets.get(key) ?? 0,
        newRooms: roomBuckets.get(key) ?? 0,
      };
    });

    return { days: result };
  }

  async getConversionStats() {
    const [
      totalUsers,
      onboardedUsers,
      usersWithRoom,
      usersWithSwipe,
      usersWithMatch,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { onboardingCompleted: true } }),
      this.prisma.roomMember.groupBy({ by: ['userId'] }).then((r) => r.length),
      this.prisma.swipe.groupBy({ by: ['userId'] }).then((r) => r.length),
      this.prisma.match.findMany({ select: { roomId: true } }).then((matches) => {
        // Get unique users who are members of rooms that have matches
        return matches.length; // simplified: count total matches
      }),
    ]);

    const calc = (n: number) =>
      totalUsers > 0 ? Math.round((n / totalUsers) * 100) : 0;

    return {
      totalUsers,
      onboarded: { count: onboardedUsers, rate: calc(onboardedUsers) },
      withRoom: { count: usersWithRoom, rate: calc(usersWithRoom) },
      withSwipe: { count: usersWithSwipe, rate: calc(usersWithSwipe) },
      totalMatches: usersWithMatch,
    };
  }

  async getSubscriptionStats() {
    const subscriptions = await this.prisma.subscription.groupBy({
      by: ['plan', 'status'],
      _count: { id: true },
    });

    const plans: Record<string, { active: number; total: number }> = {};
    for (const sub of subscriptions) {
      if (!plans[sub.plan]) {
        plans[sub.plan] = { active: 0, total: 0 };
      }
      plans[sub.plan].total += sub._count.id;
      if (sub.status === 'active' || sub.status === 'trialing') {
        plans[sub.plan].active += sub._count.id;
      }
    }

    const totalPaid = Object.entries(plans)
      .filter(([plan]) => plan !== 'free')
      .reduce((sum, [, v]) => sum + v.active, 0);

    const totalUsers = await this.prisma.user.count();

    return {
      plans,
      totalPaid,
      totalUsers,
      paidRate: totalUsers > 0 ? Math.round((totalPaid / totalUsers) * 100) : 0,
    };
  }

  async getTopMatches(limit = 10) {
    const matches = await this.prisma.match.groupBy({
      by: ['movieId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    return {
      movies: matches.map((m) => ({
        movieId: m.movieId,
        matchCount: m._count.id,
      })),
    };
  }
}
