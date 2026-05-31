import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dtos';
import {
  CreateRoomDto,
  RoomJoinResponseDto,
  RoomCreateResponseDto,
  RoomMembersResponseDto,
  RoomWithMembersResponseDto,
  MemberRoomsResponseDto,
} from './dtos';
import { RoomCrudService } from './room-crud.service';
import { RoomMembershipService } from './room-membership.service';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private readonly roomCrudService: RoomCrudService,
    private readonly roomMembershipService: RoomMembershipService,
  ) {}

  async create(
    userId: string,
    dto: CreateRoomDto,
  ): Promise<RoomCreateResponseDto> {
    return this.roomCrudService.create(userId, dto);
  }

  async join(userId: string, code: string): Promise<RoomJoinResponseDto> {
    return this.roomMembershipService.join(userId, code);
  }

  async leave(userId: string, roomId: string) {
    return this.roomMembershipService.leave(userId, roomId);
  }

  async members(
    roomId: string,
    userId?: string,
  ): Promise<RoomMembersResponseDto> {
    return this.roomMembershipService.members(roomId, userId);
  }

  async getById(
    roomId: string,
    userId?: string,
  ): Promise<RoomWithMembersResponseDto> {
    return this.roomCrudService.getById(roomId, userId);
  }

  async getByCode(
    code: string,
    userId?: string,
  ): Promise<RoomWithMembersResponseDto> {
    return this.roomCrudService.getByCode(code, userId);
  }

  async getUserRooms(
    userId: string,
    pagination?: PaginationQueryDto,
  ): Promise<
    | PaginatedResponseDto<MemberRoomsResponseDto['rooms'][0]>
    | MemberRoomsResponseDto
  > {
    return this.roomCrudService.getUserRooms(userId, pagination);
  }

  async resetRoom(roomId: string, userId: string) {
    return this.roomCrudService.resetRoom(roomId, userId);
  }

  async expireOldRooms() {
    return this.roomCrudService.expireOldRooms();
  }
}
