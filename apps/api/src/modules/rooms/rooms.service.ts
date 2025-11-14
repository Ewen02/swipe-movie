/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import {
  CreateRoomDto,
  RoomJoinResponseDto,
  RoomCreateResponseDto,
  RoomMembersResponseDto,
  RoomWithMembersResponseDto,
  MemberRoomsResponseDto,
} from './dtos';

import { RoomType } from '../../types/room-type';

import { generateRoomCode } from '../../common/utils/code';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Maps a room object to a response DTO with optional fields
   */
  private mapToRoomResponse<T extends RoomJoinResponseDto | RoomWithMembersResponseDto>(
    room: any,
    members?: Array<{ user: { id: string; name: string | null } }>,
  ): T {
    const response: any = {
      id: room.id,
      name: room.name,
      code: room.code,
      genreId: room.genreId,
      type: room.type as RoomType,
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
          type: dto.type.toUpperCase() as RoomType,
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
    if (room.members.length >= room.capacity)
      throw new ForbiddenException('Room is full');

    await this.prisma.roomMember.upsert({
      where: { roomId_userId: { roomId: room.id, userId } },
      update: {},
      create: { roomId: room.id, userId },
    });

    this.logger.log(`User ${userId} joined room ${room.id}`);

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

    return { ok: true };
  }

  async members(roomId: string): Promise<RoomMembersResponseDto> {
    const roomMember = await this.prisma.roomMember.findMany({
      where: { roomId },
      include: { user: true },
    });
    return {
      members: roomMember.map((rm) => ({ id: rm.user.id, name: rm.user.name })),
    } as RoomMembersResponseDto;
  }

  async getById(roomId: string): Promise<RoomWithMembersResponseDto> {
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

  async getByCode(code: string): Promise<RoomWithMembersResponseDto> {
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

    return this.mapToRoomResponse<RoomWithMembersResponseDto>(room, room.members);
  }

  async getUserRooms(userId: string): Promise<MemberRoomsResponseDto> {
    await this.expireOldRooms();

    const rooms = await this.prisma.room.findMany({
      where: { members: { some: { userId } } },
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
      },
    });

    return { rooms };
  }

  private async expireOldRooms() {
    const expirationDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await this.prisma.room.updateMany({
      where: { deletedAt: null, createdAt: { lt: expirationDate } },
      data: { deletedAt: new Date() },
    });
    if (result.count > 0) {
      this.logger.log(`Expired ${result.count} old rooms`);
    }
  }
}
