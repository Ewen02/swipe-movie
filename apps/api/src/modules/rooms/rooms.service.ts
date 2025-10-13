import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import {
  RoomJoinResponseDto,
  RoomCreateResponseDto,
  RoomMembersResponseDto,
  RoomWithMembersResponseDto,
  MemberRoomsResponseDto,
} from './dtos';

function code6() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name?: string): Promise<RoomCreateResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          code: code6(),
          createdBy: userId,
          name,
        },
        select: {
          id: true,
          name: true,
          code: true,
          createdBy: true,
          createdAt: true,
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

    const joinedRoom = await this.prisma.room.findUnique({
      where: { id: room.id },
      select: {
        id: true,
        name: true,
        code: true,
        createdBy: true,
        createdAt: true,
      },
    });
    return joinedRoom as RoomJoinResponseDto;
  }

  async leave(userId: string, roomId: string) {
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
          createdBy: true,
          createdAt: true,
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

    return {
      id: room.id,
      name: room.name!,
      code: room.code,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
      members: roomMembers.map((rm) => ({
        id: rm.user.id,
        name: rm.user.name,
      })),
    };
  }

  async getByCode(code: string): Promise<RoomWithMembersResponseDto> {
    const room = await this.prisma.room.findUnique({
      where: { code },
      select: {
        id: true,
        name: true,
        code: true,
        createdBy: true,
        createdAt: true,
        members: { include: { user: true } },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return {
      id: room.id,
      name: room.name!,
      code: room.code,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
      members: room.members.map((rm) => ({
        name: rm.user.name,
      })),
    };
  }

  async getUserRooms(userId: string): Promise<MemberRoomsResponseDto> {
    const rooms = await this.prisma.roomMember.findMany({
      where: { userId },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            code: true,
            createdAt: true,
          },
        },
      },
    });
    return {
      rooms: rooms.map((r) => r.room) as MemberRoomsResponseDto['rooms'],
    };
  }
}
