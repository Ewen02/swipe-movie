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

    const token = this.authService.issueToken({
      id: guestUser.id,
      email: guestUser.email,
      roles: [],
    });

    this.logger.log(
      `Trial started for guest ${guestUser.id}, room ${room.code}`,
    );

    return { roomCode: room.code, token, guestId: guestUser.id };
  }

  async migrateGuestToUser(
    guestId: string,
    realUserId: string,
  ): Promise<void> {
    const guestUser = await this.prisma.user.findUnique({
      where: { id: guestId },
    });

    if (!guestUser) {
      throw new NotFoundException('Guest user not found');
    }

    if (!guestUser.isGuest) {
      throw new ForbiddenException('User is not a guest account');
    }

    const realUser = await this.prisma.user.findUnique({
      where: { id: realUserId },
    });

    if (!realUser) {
      throw new NotFoundException('Real user not found');
    }

    if (realUser.isGuest) {
      throw new ForbiddenException('Target user cannot be a guest account');
    }

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

        // Delete the ghost user
        await tx.user.delete({
          where: { id: guestId },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );

    this.logger.log(
      `Migrated guest ${guestId} data to user ${realUserId}`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredGuests(): Promise<number> {
    const expirationDate = new Date(Date.now() - 86_400_000); // 24 hours

    // Find expired guest user IDs
    const expiredGuests = await this.prisma.user.findMany({
      where: {
        isGuest: true,
        createdAt: { lt: expirationDate },
      },
      select: { id: true },
    });

    if (expiredGuests.length === 0) {
      return 0;
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

    this.logger.log(`Cleaned up ${result.count} expired guest users`);

    return result.count;
  }
}
