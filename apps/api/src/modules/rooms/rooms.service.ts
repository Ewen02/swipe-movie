import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import type { Room } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { MatchesGateway } from '../matches/matches.gateway';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
  getPaginationParams,
} from '../../common/dtos';
import {
  CreateRoomDto,
  RoomJoinResponseDto,
  RoomCreateResponseDto,
  RoomMembersResponseDto,
  RoomWithMembersResponseDto,
  MemberRoomsResponseDto,
} from './dtos';

import { RoomType, type RoomTypeValue, CacheTTL } from '@swipe-movie/types';

import { generateRoomCode } from '../../common/utils/code';

const ROOM_EXPIRATION_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(forwardRef(() => MatchesGateway))
    private matchesGateway: MatchesGateway,
  ) {}

  /**
   * Invalidate user rooms cache
   */
  private async invalidateUserRoomsCache(userId: string): Promise<void> {
    await this.cacheManager.del(`rooms:user:${userId}`);
  }

  /**
   * Invalidate room cache by code
   */
  private async invalidateRoomCache(code: string): Promise<void> {
    await this.cacheManager.del(`rooms:code:${code}`);
  }

  /**
   * Maps a room object to a response DTO with optional fields
   */
  private mapToRoomResponse<T extends RoomJoinResponseDto | RoomWithMembersResponseDto>(
    room: Partial<Room> & Pick<Room, 'id' | 'name' | 'code' | 'genreId' | 'type' | 'createdBy' | 'createdAt' | 'watchProviders' | 'watchRegion'>,
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

  async join(userId: string, code: string): Promise<RoomJoinResponseDto> {
    this.logger.log(`User ${userId} joining room ${code}`);
    const room = await this.prisma.room.findUnique({
      where: { code },
      include: { members: true },
    });

    if (!room) throw new NotFoundException('Room not found');
    if (room.deletedAt)
      throw new HttpException('Room is no longer active', HttpStatus.GONE);

    // Check if user is already a member (no need to check limits)
    const isAlreadyMember = room.members.some((m) => m.userId === userId);
    if (!isAlreadyMember) {
      // Check participant limit based on room creator's subscription
      const { allowed, limit } = await this.subscriptionService.checkLimit(
        room.createdBy,
        'maxParticipants',
        room.members.length,
      );

      if (!allowed) {
        this.logger.warn(
          `Room ${room.id} reached participant limit (${limit}). Current: ${room.members.length}`,
        );
        throw new ForbiddenException({
          message: `This room has reached the maximum number of participants (${limit}) allowed by the room creator's plan.`,
          code: 'PARTICIPANT_LIMIT_REACHED',
          limit,
          current: room.members.length,
          upgradeRequired: true,
        });
      }
    }

    await this.prisma.roomMember.upsert({
      where: { roomId_userId: { roomId: room.id, userId } },
      update: {},
      create: { roomId: room.id, userId },
    });

    this.logger.log(`User ${userId} joined room ${room.id}`);

    // Get user info for WebSocket notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    const joinedRoom = await this.prisma.room.findUnique({
      where: { id: room.id },
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

    if (!joinedRoom) throw new NotFoundException('Room not found');

    // Invalidate caches after joining
    await Promise.all([
      this.invalidateUserRoomsCache(userId),
      this.invalidateRoomCache(code),
    ]);

    // Emit WebSocket event to notify other room members (only for new members)
    if (!isAlreadyMember && user) {
      this.matchesGateway.emitUserJoined(room.id, { id: user.id, name: user.name });
    }

    return this.mapToRoomResponse<RoomJoinResponseDto>(joinedRoom);
  }

  async leave(userId: string, roomId: string) {
    this.logger.log(`User ${userId} leaving room ${roomId}`);
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    await this.prisma.roomMember.deleteMany({
      where: { roomId, userId },
    });

    const remaining = await this.prisma.roomMember.count({ where: { roomId } });
    if (remaining === 0) {
      await this.prisma.room.update({
        where: { id: roomId },
        data: { deletedAt: new Date() },
      });
      this.logger.log(`Room ${roomId} deleted after last member left`);
    }

    // Invalidate caches after leaving
    await Promise.all([
      this.invalidateUserRoomsCache(userId),
      this.invalidateRoomCache(room.code),
    ]);

    // Emit WebSocket event to notify other room members
    this.matchesGateway.emitUserLeft(roomId, userId);

    return { ok: true };
  }

  /**
   * Verify that the user is the owner (creator) of the room, throw ForbiddenException if not
   */
  private async verifyOwnership(roomId: string, userId: string): Promise<void> {
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
  private async verifyMembership(roomId: string, userId: string): Promise<void> {
    const membership = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this room');
    }
  }

  async members(roomId: string, userId?: string): Promise<RoomMembersResponseDto> {
    if (userId) {
      await this.verifyMembership(roomId, userId);
    }

    const roomMember = await this.prisma.roomMember.findMany({
      where: { roomId },
      include: { user: true },
    });
    return {
      members: roomMember.map((rm) => ({ id: rm.user.id, name: rm.user.name })),
    } as RoomMembersResponseDto;
  }

  async getById(roomId: string, userId?: string): Promise<RoomWithMembersResponseDto> {
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

    return this.mapToRoomResponse<RoomWithMembersResponseDto>(room, roomMembers);
  }

  async getByCode(code: string, userId?: string): Promise<RoomWithMembersResponseDto> {
    const cacheKey = `rooms:code:${code}`;

    // Try to get from cache (skip cache when membership check is needed)
    if (!userId) {
      const cached = await this.cacheManager.get<RoomWithMembersResponseDto>(cacheKey);
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

    const result = this.mapToRoomResponse<RoomWithMembersResponseDto>(room, room.members);

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CacheTTL.ROOM_BY_CODE);

    return result;
  }

  async getUserRooms(
    userId: string,
    pagination?: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<MemberRoomsResponseDto['rooms'][0]> | MemberRoomsResponseDto> {

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
    const cached = await this.cacheManager.get<MemberRoomsResponseDto>(cacheKey);
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
}
