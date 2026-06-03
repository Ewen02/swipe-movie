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
import { RoomJoinResponseDto, RoomMembersResponseDto } from './dtos';
import { RoomCrudService } from './room-crud.service';
import { PushService } from '../push/push.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { SERVER_ANALYTICS_EVENTS } from '../analytics/analytics.events';

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
    private readonly pushService: PushService,
    private readonly analytics: AnalyticsService,
  ) {}

  async join(
    userId: string,
    code: string,
    source?: string,
  ): Promise<RoomJoinResponseDto> {
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

    // Only track a genuinely new membership. The endpoint is idempotent
    // (upsert), so without this guard a member re-opening the room would
    // re-fire room_joined — the over-counting the client used to produce.
    if (!isAlreadyMember) {
      this.analytics.capture(userId, SERVER_ANALYTICS_EVENTS.ROOM_JOINED, {
        room_id: room.id,
        room_code: room.code,
        source: source ?? 'direct',
      });
    }

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
      this.matchesGateway.emitUserJoined(room.id, {
        id: user.id,
        name: user.name,
      });

      // Push the existing members who aren't live in the room so they come back
      // and swipe with the newcomer. Excludes the joiner and anyone currently
      // connected (they already see the WebSocket arrival).
      const onlineUserIds = this.matchesGateway.getOnlineUserIdsInRoom(room.id);
      const recipientIds = room.members
        .map((m) => m.userId)
        .filter((id) => id !== userId && !onlineUserIds.has(id));
      if (recipientIds.length > 0) {
        void this.pushService
          .sendToUsers(recipientIds, {
            title: 'Quelqu’un a rejoint votre room',
            body: `${user.name || 'Un ami'} vient de rejoindre "${room.name}" — à vous de swiper !`,
            url: `/rooms/${room.code}`,
          })
          .catch((err) => {
            this.logger.error(
              `Join push failed for room ${room.code}`,
              err instanceof Error ? err.stack : String(err),
            );
          });
      }
    }

    return this.roomCrudService.mapToRoomResponse<RoomJoinResponseDto>(
      joinedRoom,
    );
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

  async members(
    roomId: string,
    userId?: string,
  ): Promise<RoomMembersResponseDto> {
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
