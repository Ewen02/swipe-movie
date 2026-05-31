import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../infra/prisma.service';
import { NestEmailService } from '../email/email.service';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Weekly re-engagement digest. Once a week, each non-guest user who was active
 * in the last 7 days gets a recap of their swipes, new matches and active
 * rooms — a recurring reason to come back ("votre semaine sur Swipe Movie").
 *
 * Deliberately only emails users who DID something this week: a digest of zeros
 * is noise, and silent inactives are better re-engaged by a dedicated win-back
 * campaign than by a weekly "you did nothing" email.
 */
@Injectable()
export class DigestService {
  private readonly logger = new Logger(DigestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: NestEmailService,
  ) {}

  // Monday 9am — start of the week, when people plan what to watch.
  @Cron(CronExpression.EVERY_WEEK)
  async sendWeeklyDigests(): Promise<void> {
    const since = new Date(Date.now() - WEEK_MS);

    // Users who swiped at least once this week (the activity signal). Grouping
    // keeps this to a single query regardless of user count.
    const activeSwipers = await this.prisma.swipe.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: since } },
      _count: { id: true },
    });

    if (activeSwipers.length === 0) return;

    const userIds = activeSwipers.map((s) => s.userId);
    const swipeCountByUser = new Map(
      activeSwipers.map((s) => [s.userId, s._count.id]),
    );

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds }, isGuest: false },
      select: {
        id: true,
        email: true,
        name: true,
        members: { select: { roomId: true } },
      },
    });

    let sent = 0;
    for (const user of users) {
      if (!user.email || user.email.endsWith('@trial.local')) continue;

      const roomIds = user.members.map((m) => m.roomId);
      const totalSwipes = swipeCountByUser.get(user.id) ?? 0;

      // Matches are room-level (no userId): count new matches in rooms the user
      // belongs to. Active rooms = non-deleted rooms with activity this week.
      const [newMatches, activeRooms] = await Promise.all([
        roomIds.length
          ? this.prisma.match.count({
              where: { roomId: { in: roomIds }, createdAt: { gte: since } },
            })
          : Promise.resolve(0),
        roomIds.length
          ? this.prisma.room.count({
              where: {
                id: { in: roomIds },
                deletedAt: null,
                swipes: { some: { createdAt: { gte: since } } },
              },
            })
          : Promise.resolve(0),
      ]);

      const ok = await this.emailService.sendWeeklyDigest(user.email, {
        userName: user.name || 'cinéphile',
        totalSwipes,
        newMatches,
        roomsActive: activeRooms,
      });
      if (ok) sent++;
    }

    if (sent > 0) {
      this.logger.log(`Sent ${sent}/${users.length} weekly digest email(s)`);
    }
  }
}
