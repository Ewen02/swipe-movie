import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../infra/prisma.service';
import { AuthService } from '../auth/auth.service';
import { generateRoomCode } from '../../common/utils/code';
import { StartTrialDto } from './dto/start-trial.dto';

@Injectable()
export class TrialService {
  private readonly logger = new Logger(TrialService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async startTrial(
    dto: StartTrialDto,
  ): Promise<{ roomCode: string; token: string; guestId: string }> {
    const guestEmail = `guest_${randomUUID()}@trial.local`;

    const guestUser = await this.prisma.user.create({
      data: {
        email: guestEmail,
        isGuest: true,
        onboardingCompleted: true,
        name: 'Guest',
      },
    });

    const room = await this.prisma.room.create({
      data: {
        code: generateRoomCode(),
        name: 'Trial Room',
        createdBy: guestUser.id,
        type: dto.type === 'tv' ? 'TV' : 'MOVIE',
        genreId: dto.genreId ?? 0,
      },
    });

    await this.prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: guestUser.id,
      },
    });

    // 2h matches TRIAL_CONFIG.durationMs on the client; the cookie and
    // isTrialActive() use the same window so the token can't expire while
    // the UI still thinks the trial is live.
    const token = this.authService.issueToken(
      {
        id: guestUser.id,
        email: guestUser.email,
        roles: [],
      },
      { expiresIn: '2h' },
    );

    this.logger.log(
      `Trial started for guest ${guestUser.id}, room ${room.code}`,
    );

    return { roomCode: room.code, token, guestId: guestUser.id };
  }

  async migrateGuestToUser(
    guestId: string,
    realUserId: string,
  ): Promise<{ alreadyMigrated: boolean }> {
    try {
      return await this.runMigration(guestId, realUserId);
    } catch (err) {
      // Log with full context so failures are debuggable in prod (Sentry/Datadog).
      // Without this, errors get swallowed into a generic 500 with no breadcrumb.
      this.logger.error(
        `Trial migration failed (guestId=${guestId}, realUserId=${realUserId}): ${
          err instanceof Error ? err.message : String(err)
        }`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    }
  }

  private async runMigration(
    guestId: string,
    realUserId: string,
  ): Promise<{ alreadyMigrated: boolean }> {
    const realUser = await this.prisma.user.findUnique({
      where: { id: realUserId },
    });

    if (!realUser) {
      throw new NotFoundException('Real user not found');
    }

    if (realUser.isGuest) {
      throw new ForbiddenException('Target user cannot be a guest account');
    }

    const guestUser = await this.prisma.user.findUnique({
      where: { id: guestId },
    });

    // Idempotency: a previous successful migration deletes the guest row, so a
    // retry hits this path. Treat it as success so the client gets a stable
    // 2xx instead of cryptic 404s on retries (network blip, double-click).
    if (!guestUser) {
      this.logger.log(
        `Migration noop: guest ${guestId} already migrated for realUser ${realUserId}`,
      );
      return { alreadyMigrated: true };
    }

    if (!guestUser.isGuest) {
      throw new ForbiddenException('User is not a guest account');
    }

    // Retry on Postgres serialization_failure (40001). Serializable isolation
    // catches dirty writes by aborting one of the conflicting txs; under
    // concurrent migrations (rare, but possible if the user double-clicks
    // retry) we want to transparently re-run instead of surfacing a 500.
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (true) {
      try {
        await this.prisma.$transaction(
          async (tx) => {
            // Transfer swipes from guest to real user
            await tx.swipe.updateMany({
              where: { userId: guestId },
              data: { userId: realUserId },
            });

            // Get rooms where the guest is a member
            const guestMemberships = await tx.roomMember.findMany({
              where: { userId: guestId },
              select: { roomId: true },
            });

            const guestRoomIds = guestMemberships.map((m) => m.roomId);

            // Delete any existing memberships for the real user in those same rooms
            // to avoid unique constraint violations
            if (guestRoomIds.length > 0) {
              await tx.roomMember.deleteMany({
                where: {
                  userId: realUserId,
                  roomId: { in: guestRoomIds },
                },
              });
            }

            // Transfer room memberships from guest to real user
            await tx.roomMember.updateMany({
              where: { userId: guestId },
              data: { userId: realUserId },
            });

            // Transfer room ownership from guest to real user
            await tx.room.updateMany({
              where: { createdBy: guestId },
              data: { createdBy: realUserId },
            });

            // Mark real user as onboarding completed (they already experienced the product)
            await tx.user.update({
              where: { id: realUserId },
              data: { onboardingCompleted: true, onboardingStep: 4 },
            });

            // Delete the ghost user
            await tx.user.delete({
              where: { id: guestId },
            });
          },
          {
            isolationLevel: 'Serializable',
          },
        );
        break;
      } catch (err) {
        const isSerializationFailure =
          err instanceof Error &&
          'code' in err &&
          (err as { code: string }).code === 'P2034';
        if (isSerializationFailure && attempt < MAX_RETRIES - 1) {
          attempt++;
          this.logger.warn(
            `Migration tx serialization_failure, retrying (${attempt}/${MAX_RETRIES})`,
          );
          continue;
        }
        throw err;
      }
    }

    this.logger.log(`Migrated guest ${guestId} data to user ${realUserId}`);
    return { alreadyMigrated: false };
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredGuests(): Promise<number> {
    const expirationDate = new Date(Date.now() - 86_400_000); // 24 hours

    // Find expired guest user IDs along with how many swipes/rooms they own —
    // a high count suggests the user actually engaged and the migration
    // probably failed silently, which is worth investigating.
    const expiredGuests = await this.prisma.user.findMany({
      where: {
        isGuest: true,
        createdAt: { lt: expirationDate },
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        _count: { select: { swipes: true, members: true } },
      },
    });

    if (expiredGuests.length === 0) {
      return 0;
    }

    // Surface guests that swiped >= 5 times: those are the lost-conversion
    // signal — we deleted real user activity because migration didn't happen.
    const engagedLost = expiredGuests.filter((g) => g._count.swipes >= 5);
    if (engagedLost.length > 0) {
      this.logger.warn(
        `Cleanup deleting ${engagedLost.length} engaged guest(s) with >=5 swipes — possible failed migration:`,
      );
      for (const g of engagedLost) {
        this.logger.warn(
          `  guest=${g.id} swipes=${g._count.swipes} rooms=${g._count.members}`,
        );
      }
    }

    const expiredGuestIds = expiredGuests.map((g) => g.id);

    // Delete rooms created by expired guests (cascades to swipes & memberships)
    await this.prisma.room.deleteMany({
      where: { createdBy: { in: expiredGuestIds } },
    });

    // Delete the expired guest users themselves
    const result = await this.prisma.user.deleteMany({
      where: { id: { in: expiredGuestIds } },
    });

    this.logger.log(
      `Cleaned up ${result.count} expired guest users (engaged lost: ${engagedLost.length})`,
    );

    return result.count;
  }
}
