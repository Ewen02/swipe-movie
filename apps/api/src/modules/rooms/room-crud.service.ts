import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import type { Room } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
  getPaginationParams,
} from '../../common/dtos';
import {
  CreateRoomDto,
  RoomJoinResponseDto,
  RoomCreateResponseDto,
  RoomWithMembersResponseDto,
  MemberRoomsResponseDto,
} from './dtos';

import { RoomType, type RoomTypeValue, CacheTTL } from '@swipe-movie/types';

import { generateRoomCode } from '../../common/utils/code';
import { NestEmailService } from '../email/email.service';

const ROOM_EXPIRATION_MS = 24 * 60 * 60 * 1000;
// Send the "about to expire" reminder once a room has lived this long — i.e.
// ~4h before the 24h cutoff. Short window because rooms are short-lived.
const ROOM_REMINDER_AFTER_MS = 20 * 60 * 60 * 1000;

@Injectable()
export class RoomCrudService {
  private readonly logger = new Logger(RoomCrudService.name);

  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly emailService: NestEmailService,
  ) {}

  /**
   * Invalidate user rooms cache
   */
  async invalidateUserRoomsCache(userId: string): Promise<void> {
    await this.cacheManager.del(`rooms:user:${userId}`);
  }

  /**
   * Invalidate room cache by code
   */
  async invalidateRoomCache(code: string): Promise<void> {
    await this.cacheManager.del(`rooms:code:${code}`);
  }

  /**
   * Maps a room object to a response DTO with optional fields
   */
  mapToRoomResponse<T extends RoomJoinResponseDto | RoomWithMembersResponseDto>(
    room: Partial<Room> &
      Pick<
        Room,
        | 'id'
        | 'name'
        | 'code'
        | 'genreId'
        | 'type'
        | 'createdBy'
        | 'createdAt'
        | 'watchProviders'
        | 'watchRegion'
      >,
    members?: Array<{ user: { id: string; name: string | null } }>,
  ): T {
    const response: Record<string, unknown> = {
      id: room.id,
      name: room.name,
      code: room.code,
      genreId: room.genreId,
      type: room.type as RoomTypeValue,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
      watchProviders: room.watchProviders,
    };

    if (members) {
      response.members = members.map((rm) => ({
        id: rm.user.id,
        name: rm.user.name,
      }));
    }

    if (room.minRating !== null) {
      response.minRating = room.minRating;
    }
    if (room.releaseYearMin !== null) {
      response.releaseYearMin = room.releaseYearMin;
    }
    if (room.releaseYearMax !== null) {
      response.releaseYearMax = room.releaseYearMax;
    }
    if (room.runtimeMin !== null) {
      response.runtimeMin = room.runtimeMin;
    }
    if (room.runtimeMax !== null) {
      response.runtimeMax = room.runtimeMax;
    }
    if (room.watchRegion !== null) {
      response.watchRegion = room.watchRegion;
    }
    if (room.originalLanguage !== null) {
      response.originalLanguage = room.originalLanguage;
    }

    return response as T;
  }

  async create(
    userId: string,
    dto: CreateRoomDto,
  ): Promise<RoomCreateResponseDto> {
    this.logger.log(`Creating room for user ${userId}`);

    // Check room creation limit based on subscription
    const roomsCount = await this.prisma.room.count({
      where: { createdBy: userId, deletedAt: null },
    });

    const { allowed, limit } = await this.subscriptionService.checkLimit(
      userId,
      'maxRooms',
      roomsCount,
    );

    if (!allowed) {
      this.logger.warn(
        `User ${userId} reached room limit (${limit}). Current: ${roomsCount}`,
      );
      throw new ForbiddenException({
        message: `Room limit reached. You can create up to ${limit} rooms on your current plan.`,
        code: 'ROOM_LIMIT_REACHED',
        limit,
        current: roomsCount,
        upgradeRequired: true,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      // Verify user exists, if not throw an error
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found when creating room`);
        throw new NotFoundException('User not found');
      }

      const room = await tx.room.create({
        data: {
          code: generateRoomCode(),
          createdBy: userId,
          name: dto.name,
          genreId: dto.genreId,
          type: dto.type.toUpperCase() as RoomTypeValue,
          minRating: dto.minRating,
          releaseYearMin: dto.releaseYearMin,
          releaseYearMax: dto.releaseYearMax,
          runtimeMin: dto.runtimeMin,
          runtimeMax: dto.runtimeMax,
          watchProviders: dto.watchProviders || [],
          watchRegion: dto.watchRegion,
          originalLanguage: dto.originalLanguage,
          isRecurring: dto.isRecurring ?? false,
          recurringInterval: dto.isRecurring
            ? (dto.recurringInterval ?? 'monthly')
            : null,
        },
        select: {
          id: true,
          name: true,
          code: true,
          genreId: true,
          type: true,
          createdBy: true,
          createdAt: true,
          minRating: true,
          releaseYearMin: true,
          releaseYearMax: true,
          runtimeMin: true,
          runtimeMax: true,
          watchProviders: true,
          watchRegion: true,
          originalLanguage: true,
        },
      });
      await tx.roomMember.create({
        data: {
          roomId: room.id,
          userId,
        },
      });

      // Invalidate user rooms cache after creation
      await this.invalidateUserRoomsCache(userId);

      return room as RoomCreateResponseDto;
    });
  }

  async getById(
    roomId: string,
    userId?: string,
  ): Promise<RoomWithMembersResponseDto> {
    if (userId) {
      await this.verifyMembership(roomId, userId);
    }

    const [room, roomMembers] = await this.prisma.$transaction([
      this.prisma.room.findUnique({
        where: { id: roomId },
        select: {
          id: true,
          name: true,
          code: true,
          genreId: true,
          type: true,
          createdBy: true,
          createdAt: true,
          minRating: true,
          releaseYearMin: true,
          releaseYearMax: true,
          runtimeMin: true,
          runtimeMax: true,
          watchProviders: true,
          watchRegion: true,
          originalLanguage: true,
        },
      }),
      this.prisma.roomMember.findMany({
        where: { roomId },
        include: { user: true },
      }),
    ]);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.mapToRoomResponse<RoomWithMembersResponseDto>(
      room,
      roomMembers,
    );
  }

  async getByCode(
    code: string,
    userId?: string,
  ): Promise<RoomWithMembersResponseDto> {
    const cacheKey = `rooms:code:${code}`;

    // Try to get from cache (skip cache when membership check is needed)
    if (!userId) {
      const cached =
        await this.cacheManager.get<RoomWithMembersResponseDto>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const room = await this.prisma.room.findUnique({
      where: { code },
      select: {
        id: true,
        name: true,
        code: true,
        genreId: true,
        type: true,
        createdBy: true,
        createdAt: true,
        minRating: true,
        releaseYearMin: true,
        releaseYearMax: true,
        runtimeMin: true,
        runtimeMax: true,
        watchProviders: true,
        watchRegion: true,
        originalLanguage: true,
        members: { include: { user: true } },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Verify membership if userId is provided
    if (userId) {
      const isMember = room.members.some((m) => m.userId === userId);
      if (!isMember) {
        throw new ForbiddenException('You are not a member of this room');
      }
    }

    const result = this.mapToRoomResponse<RoomWithMembersResponseDto>(
      room,
      room.members,
    );

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CacheTTL.ROOM_BY_CODE);

    return result;
  }

  async getUserRooms(
    userId: string,
    pagination?: PaginationQueryDto,
  ): Promise<
    | PaginatedResponseDto<MemberRoomsResponseDto['rooms'][0]>
    | MemberRoomsResponseDto
  > {
    const where = { members: { some: { userId } } };

    // If pagination is provided, return paginated response
    if (pagination) {
      const { skip, take } = getPaginationParams(
        pagination.page ?? 1,
        pagination.limit ?? 20,
      );

      const [rooms, total] = await Promise.all([
        this.prisma.room.findMany({
          where,
          select: {
            id: true,
            name: true,
            code: true,
            genreId: true,
            type: true,
            createdAt: true,
            createdBy: true,
            minRating: true,
            releaseYearMin: true,
            releaseYearMax: true,
            runtimeMin: true,
            runtimeMax: true,
            watchProviders: true,
            watchRegion: true,
            originalLanguage: true,
            _count: {
              select: {
                matches: true,
                members: true,
              },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.room.count({ where }),
      ]);

      return new PaginatedResponseDto(
        rooms.map((room) => ({
          id: room.id,
          name: room.name,
          code: room.code,
          genreId: room.genreId,
          type: room.type,
          createdAt: room.createdAt,
          createdBy: room.createdBy,
          minRating: room.minRating,
          releaseYearMin: room.releaseYearMin,
          releaseYearMax: room.releaseYearMax,
          runtimeMin: room.runtimeMin,
          runtimeMax: room.runtimeMax,
          watchProviders: room.watchProviders,
          watchRegion: room.watchRegion,
          originalLanguage: room.originalLanguage,
          matchCount: room._count.matches,
          memberCount: room._count.members,
        })),
        pagination.page ?? 1,
        pagination.limit ?? 20,
        total,
      );
    }

    // Otherwise, return all rooms (backward compatibility)
    const cacheKey = `rooms:user:${userId}`;

    // Try to get from cache (only for non-paginated requests)
    const cached =
      await this.cacheManager.get<MemberRoomsResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const rooms = await this.prisma.room.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        genreId: true,
        type: true,
        createdAt: true,
        createdBy: true,
        minRating: true,
        releaseYearMin: true,
        releaseYearMax: true,
        runtimeMin: true,
        runtimeMax: true,
        watchProviders: true,
        watchRegion: true,
        originalLanguage: true,
        _count: {
          select: {
            matches: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result: MemberRoomsResponseDto = {
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        code: room.code,
        genreId: room.genreId,
        type: room.type,
        createdAt: room.createdAt,
        createdBy: room.createdBy,
        minRating: room.minRating,
        releaseYearMin: room.releaseYearMin,
        releaseYearMax: room.releaseYearMax,
        runtimeMin: room.runtimeMin,
        runtimeMax: room.runtimeMax,
        watchProviders: room.watchProviders,
        watchRegion: room.watchRegion,
        originalLanguage: room.originalLanguage,
        matchCount: room._count.matches,
        memberCount: room._count.members,
      })),
    };

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CacheTTL.USER_ROOMS);

    return result;
  }

  /**
   * Verify that the user is the owner (creator) of the room, throw ForbiddenException if not
   */
  async verifyOwnership(roomId: string, userId: string): Promise<void> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { createdBy: true },
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (room.createdBy !== userId) {
      throw new ForbiddenException('You are not the owner of this room');
    }
  }

  /**
   * Verify that a user is a member of a room, throw ForbiddenException if not
   */
  async verifyMembership(roomId: string, userId: string): Promise<void> {
    const membership = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this room');
    }
  }

  /**
   * Reset a recurring room: delete all swipes and matches, set lastResetAt.
   * Only the room owner can trigger a manual reset.
   */
  async resetRoom(roomId: string, userId: string): Promise<Room> {
    await this.verifyOwnership(roomId, userId);

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { code: true },
    });

    await this.prisma.$transaction(async (tx: any) => {
      await tx.swipe.deleteMany({ where: { roomId } });
      await tx.match.deleteMany({ where: { roomId } });
      await tx.room.update({
        where: { id: roomId },
        data: { lastResetAt: new Date() },
      });
    });

    // Invalidate caches
    if (room) {
      await this.invalidateRoomCache(room.code);
    }
    await this.invalidateUserRoomsCache(userId);

    const updated = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    this.logger.log(`Room ${roomId} reset by user ${userId}`);
    return updated!;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetRecurringRooms() {
    const now = new Date();

    const recurringRooms = await this.prisma.room.findMany({
      where: {
        isRecurring: true,
        deletedAt: null,
      },
      select: {
        id: true,
        recurringInterval: true,
        lastResetAt: true,
        createdAt: true,
      },
    });

    let resetCount = 0;
    for (const room of recurringRooms) {
      const lastReset = room.lastResetAt || room.createdAt;
      const intervalMs =
        room.recurringInterval === 'weekly'
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000; // monthly default

      if (now.getTime() - lastReset.getTime() >= intervalMs) {
        await this.prisma.$transaction(async (tx: any) => {
          await tx.swipe.deleteMany({ where: { roomId: room.id } });
          await tx.match.deleteMany({ where: { roomId: room.id } });
          await tx.room.update({
            where: { id: room.id },
            data: { lastResetAt: now },
          });
        });
        resetCount++;
      }
    }

    if (resetCount > 0) {
      this.logger.log(`Auto-reset ${resetCount} recurring rooms`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expireOldRooms() {
    const expirationDate = new Date(Date.now() - ROOM_EXPIRATION_MS);
    const result = await this.prisma.room.updateMany({
      where: { deletedAt: null, createdAt: { lt: expirationDate } },
      data: { deletedAt: new Date() },
    });
    if (result.count > 0) {
      this.logger.log(`Expired ${result.count} old rooms`);
    }
  }

  /**
   * Email members ~4h before their room is auto-expired, so an active group has
   * a reason to come back and finish (or just so the matches aren't silently
   * lost). Runs hourly; `expiryReminderSentAt` guarantees one reminder per room.
   * Guests (synthetic @trial.local addresses) are skipped.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async sendExpiryReminders() {
    const now = Date.now();
    const reminderThreshold = new Date(now - ROOM_REMINDER_AFTER_MS);
    const expirationThreshold = new Date(now - ROOM_EXPIRATION_MS);

    // Rooms old enough to warn about but not yet expired, not already reminded.
    const rooms = await this.prisma.room.findMany({
      where: {
        deletedAt: null,
        expiryReminderSentAt: null,
        createdAt: { lt: reminderThreshold, gt: expirationThreshold },
      },
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
        _count: { select: { matches: true } },
        members: {
          select: {
            user: {
              select: { email: true, name: true, isGuest: true },
            },
          },
        },
      },
    });

    if (rooms.length === 0) return;

    const baseUrl = (
      process.env.FRONTEND_URL ||
      process.env.WEB_ORIGIN ||
      'https://swipe-movie.com'
    ).replace(/\/$/, '');

    let notifiedRooms = 0;
    for (const room of rooms) {
      const recipients = room.members
        .map((m) => m.user)
        .filter(
          (u) => !u.isGuest && !!u.email && !u.email.endsWith('@trial.local'),
        );

      if (recipients.length > 0) {
        // Hours left before the 24h cutoff, floored, min 1 so copy reads sanely.
        const msLeft = ROOM_EXPIRATION_MS - (now - room.createdAt.getTime());
        const hoursLeft = Math.max(1, Math.floor(msLeft / (60 * 60 * 1000)));
        const timeLeft = `${hoursLeft} heure${hoursLeft > 1 ? 's' : ''}`;
        const roomUrl = `${baseUrl}/rooms/${room.code}`;

        await Promise.allSettled(
          recipients.map((u) =>
            this.emailService.sendRoomExpiryReminder(u.email, {
              userName: u.name || 'cinéphile',
              roomName: room.name,
              roomUrl,
              matchCount: room._count.matches,
              timeLeft,
            }),
          ),
        );
        notifiedRooms++;
      }

      // Mark as reminded regardless of recipient count so we never re-scan a
      // guest-only room every hour until it expires.
      await this.prisma.room.update({
        where: { id: room.id },
        data: { expiryReminderSentAt: new Date() },
      });
    }

    if (notifiedRooms > 0) {
      this.logger.log(
        `Sent expiry reminders for ${notifiedRooms}/${rooms.length} room(s)`,
      );
    }
  }
}
