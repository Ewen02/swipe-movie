import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { NestEmailService } from '../email/email.service';
import { PushService } from '../push/push.service';
import { generateRoomCode } from '../../common/utils/code';
import { CreateGroupDto, GroupResponseDto, GroupsResponseDto } from './dtos';
import type { RoomTypeValue } from '@swipe-movie/types';
import { AnalyticsService } from '../analytics/analytics.service';
import { SERVER_ANALYTICS_EVENTS } from '../analytics/analytics.events';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: NestEmailService,
    private readonly pushService: PushService,
    private readonly analytics: AnalyticsService,
  ) {}

  private get baseUrl(): string {
    return (
      process.env.FRONTEND_URL ||
      process.env.WEB_ORIGIN ||
      'https://swipe-movie.com'
    ).replace(/\/$/, '');
  }

  /**
   * Create a persistent group. If `fromRoomId` is given, the group inherits that
   * room's filter preset and members (the usual "save this crew after a session"
   * path). The creator is always a member.
   */
  async create(
    userId: string,
    dto: CreateGroupDto,
  ): Promise<GroupResponseDto> {
    // Seed members: explicit list + (optionally) the source room's members + creator.
    const memberIds = new Set<string>([userId]);
    for (const id of dto.memberUserIds ?? []) memberIds.add(id);

    let preset: Partial<{
      type: RoomTypeValue;
      genreId: number;
      minRating: number | null;
      releaseYearMin: number | null;
      releaseYearMax: number | null;
      runtimeMin: number | null;
      runtimeMax: number | null;
      watchProviders: number[];
      watchRegion: string | null;
      originalLanguage: string | null;
    }> = {};
    let nameFallback = dto.name;

    if (dto.fromRoomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: dto.fromRoomId },
        include: { members: { select: { userId: true } } },
      });
      if (!room) throw new NotFoundException('Source room not found');
      // Only the creator of the room (or a member) can snapshot it into a group.
      const isMember = room.members.some((m) => m.userId === userId);
      if (!isMember) {
        throw new ForbiddenException('You are not a member of this room');
      }
      for (const m of room.members) memberIds.add(m.userId);
      preset = {
        type: room.type,
        genreId: room.genreId,
        minRating: room.minRating,
        releaseYearMin: room.releaseYearMin,
        releaseYearMax: room.releaseYearMax,
        runtimeMin: room.runtimeMin,
        runtimeMax: room.runtimeMax,
        watchProviders: room.watchProviders,
        watchRegion: room.watchRegion,
        originalLanguage: room.originalLanguage,
      };
      nameFallback = nameFallback || room.name;
    }

    // DTO-provided preset overrides room-derived values when present.
    if (dto.type) preset.type = dto.type.toUpperCase() as RoomTypeValue;
    if (dto.genreId !== undefined) preset.genreId = dto.genreId;
    if (dto.minRating !== undefined) preset.minRating = dto.minRating;
    if (dto.releaseYearMin !== undefined)
      preset.releaseYearMin = dto.releaseYearMin;
    if (dto.releaseYearMax !== undefined)
      preset.releaseYearMax = dto.releaseYearMax;
    if (dto.runtimeMin !== undefined) preset.runtimeMin = dto.runtimeMin;
    if (dto.runtimeMax !== undefined) preset.runtimeMax = dto.runtimeMax;
    if (dto.watchProviders !== undefined)
      preset.watchProviders = dto.watchProviders;
    if (dto.watchRegion !== undefined) preset.watchRegion = dto.watchRegion;
    if (dto.originalLanguage !== undefined)
      preset.originalLanguage = dto.originalLanguage;

    const group = await this.prisma.group.create({
      data: {
        name: nameFallback || 'Mon groupe',
        createdBy: userId,
        type: preset.type ?? 'MOVIE',
        genreId: preset.genreId ?? 0,
        minRating: preset.minRating ?? null,
        releaseYearMin: preset.releaseYearMin ?? null,
        releaseYearMax: preset.releaseYearMax ?? null,
        runtimeMin: preset.runtimeMin ?? null,
        runtimeMax: preset.runtimeMax ?? null,
        watchProviders: preset.watchProviders ?? [],
        watchRegion: preset.watchRegion ?? 'FR',
        originalLanguage: preset.originalLanguage ?? null,
        members: {
          create: [...memberIds].map((id) => ({ userId: id })),
        },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    this.logger.log(
      `Group ${group.id} created by ${userId} with ${group.members.length} members`,
    );

    this.analytics.capture(userId, SERVER_ANALYTICS_EVENTS.GROUP_CREATED, {
      group_id: group.id,
      member_count: group.members.length,
      from_room: Boolean(dto.fromRoomId),
    });

    return this.toResponse(group);
  }

  async listForUser(userId: string): Promise<GroupsResponseDto> {
    const groups = await this.prisma.group.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { groups: groups.map((g) => this.toResponse(g)) };
  }

  async getById(userId: string, groupId: string): Promise<GroupResponseDto> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    if (!group.members.some((m) => m.userId === userId)) {
      throw new ForbiddenException('You are not a member of this group');
    }
    return this.toResponse(group);
  }

  async delete(userId: string, groupId: string): Promise<{ ok: true }> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { createdBy: true },
    });
    if (!group) throw new NotFoundException('Group not found');
    if (group.createdBy !== userId) {
      throw new ForbiddenException('Only the group owner can delete it');
    }
    await this.prisma.group.delete({ where: { id: groupId } });
    return { ok: true };
  }

  /**
   * The retention payoff: spawn a fresh room from the group's preset and notify
   * the other members ("movie night?"). One click for the host turns a saved
   * crew back into an active session.
   */
  async startSession(
    userId: string,
    groupId: string,
  ): Promise<{ code: string; roomId: string; notified: number }> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                isGuest: true,
                locale: true,
              },
            },
          },
        },
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    const host = group.members.find((m) => m.userId === userId);
    if (!host) throw new ForbiddenException('You are not a member of this group');

    // Fresh room from the preset, linked back to the group. Only the host joins
    // now; the others arrive via the invite link in their notification.
    const room = await this.prisma.room.create({
      data: {
        code: generateRoomCode(),
        createdBy: userId,
        name: group.name,
        groupId: group.id,
        type: group.type,
        genreId: group.genreId,
        minRating: group.minRating,
        releaseYearMin: group.releaseYearMin,
        releaseYearMax: group.releaseYearMax,
        runtimeMin: group.runtimeMin,
        runtimeMax: group.runtimeMax,
        watchProviders: group.watchProviders,
        watchRegion: group.watchRegion,
        originalLanguage: group.originalLanguage,
        members: { create: [{ userId }] },
      },
    });

    // Bump the group so it sorts to the top of "your groups".
    await this.prisma.group.update({
      where: { id: group.id },
      data: { updatedAt: new Date() },
    });

    const hostName = host.user.name || 'Un ami';
    const joinUrl = `${this.baseUrl}/try/join/${room.code}`;
    const recipients = group.members.filter(
      (m) =>
        m.userId !== userId &&
        !m.user.isGuest &&
        !!m.user.email &&
        !m.user.email.endsWith('@trial.local'),
    );

    // Email invite (reuses the existing room-invite template) + push, both
    // best-effort. This is the re-engagement signal that pulls the crew back.
    const emailResults = await Promise.allSettled(
      recipients.map((m) =>
        this.emailService.sendRoomInvite(m.user.email!, {
          inviteeName: m.user.name || 'cinéphile',
          inviterName: hostName,
          roomName: group.name,
          roomCode: room.code,
          joinUrl,
          locale: m.user.locale,
        }),
      ),
    );
    const emailed = emailResults.filter(
      (r) => r.status === 'fulfilled' && r.value === true,
    ).length;

    const pushed = await this.pushService.sendToUsers(
      recipients.map((m) => m.userId),
      {
        title: `🎬 Soirée film avec ${hostName} ?`,
        body: `${hostName} relance "${group.name}". Viens swiper !`,
        url: `/rooms/${room.code}`,
      },
    );

    this.logger.log(
      `Group ${group.id} session ${room.code}: emailed ${emailed}, pushed ${pushed} of ${recipients.length} member(s)`,
    );

    const notified = Math.max(emailed, pushed);
    this.analytics.capture(
      userId,
      SERVER_ANALYTICS_EVENTS.GROUP_SESSION_STARTED,
      {
        group_id: group.id,
        room_id: room.id,
        room_code: room.code,
        recipients: recipients.length,
        emailed,
        pushed,
        notified,
      },
    );

    // Attribute the re-engagement to each recipient (not the host) so we can
    // measure who actually comes back after being pulled — the retention loop
    // that was previously fire-and-forget with nothing measured downstream.
    for (const m of recipients) {
      this.analytics.capture(
        m.userId,
        SERVER_ANALYTICS_EVENTS.REENGAGEMENT_SENT,
        { group_id: group.id, room_code: room.code, source: 'group_session' },
      );
    }

    return {
      code: room.code,
      roomId: room.id,
      notified,
    };
  }

  private toResponse(group: {
    id: string;
    name: string;
    createdBy: string;
    type: string;
    genreId: number;
    createdAt: Date;
    members: { user: { id: string; name: string | null } }[];
  }): GroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      createdBy: group.createdBy,
      type: group.type,
      genreId: group.genreId,
      members: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
      })),
      memberCount: group.members.length,
      createdAt: group.createdAt,
    };
  }
}
