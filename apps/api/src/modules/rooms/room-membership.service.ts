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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { MatchesGateway } from '../matches/matches.gateway';
import {
  RoomJoinResponseDto,
  RoomMembersResponseDto,
} from './dtos';
import { RoomCrudService } from './room-crud.service';

@Injectable()
export class RoomMembershipService {
  private readonly logger = new Logger(RoomMembershipService.name);

  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(forwardRef(() => MatchesGateway))
    private matchesGateway: MatchesGateway,
    private roomCrudService: RoomCrudService,
  ) {}

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
      this.roomCrudService.invalidateUserRoomsCache(userId),
      this.roomCrudService.invalidateRoomCache(code),
    ]);

    // Emit WebSocket event to notify other room members (only for new members)
    if (!isAlreadyMember && user) {
      this.matchesGateway.emitUserJoined(room.id, { id: user.id, name: user.name });
    }

    return this.roomCrudService.mapToRoomResponse<RoomJoinResponseDto>(joinedRoom);
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
      this.roomCrudService.invalidateUserRoomsCache(userId),
      this.roomCrudService.invalidateRoomCache(room.code),
    ]);

    // Emit WebSocket event to notify other room members
    this.matchesGateway.emitUserLeft(roomId, userId);

    return { ok: true };
  }

  async members(roomId: string, userId?: string): Promise<RoomMembersResponseDto> {
    if (userId) {
      await this.roomCrudService.verifyMembership(roomId, userId);
    }

    const roomMember = await this.prisma.roomMember.findMany({
      where: { roomId },
      include: { user: true },
    });
    return {
      members: roomMember.map((rm) => ({ id: rm.user.id, name: rm.user.name })),
    } as RoomMembersResponseDto;
  }
}
