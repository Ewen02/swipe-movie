import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { SwipesService } from '../swipes/swipes.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UserId,
  ApiJoinRoomErrors,
  ApiLeaveRoomErrors,
} from '../../common/decorators';

import {
  CreateRoomDto,
  JoinRoomDto,
  LeaveRoomDto,
  RoomJoinResponseDto,
  RoomCreateResponseDto,
  RoomMembersResponseDto,
  RoomWithMembersResponseDto,
  MemberRoomsResponseDto,
} from './dtos';

import { ResponseSwipeDto } from '../swipes/dtos/response-swipe.dto';

@ApiTags('Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(
    private service: RoomsService,
    private swipesService: SwipesService,
  ) {}

  @ApiOperation({ summary: 'Create a new room' })
  @ApiCreatedResponse({
    description: 'Room created',
    type: RoomCreateResponseDto,
  })
  @Post()
  create(@UserId() userId: string, @Body() dto: CreateRoomDto) {
    return this.service.create(userId, dto);
  }

  @ApiOperation({ summary: 'Join a room' })
  @ApiOkResponse({
    description: 'Successfully joined',
    type: RoomJoinResponseDto,
  })
  @ApiJoinRoomErrors()
  @Post('join')
  join(@UserId() userId: string, @Body() dto: JoinRoomDto) {
    return this.service.join(userId, dto.code);
  }

  @ApiOperation({ summary: 'Leave a room' })
  @ApiOkResponse({ description: 'Successfully left' })
  @ApiLeaveRoomErrors()
  @Post('leave')
  leave(@UserId() userId: string, @Body() dto: LeaveRoomDto) {
    return this.service.leave(userId, dto.roomId);
  }

  @ApiOperation({ summary: 'Get all rooms for user' })
  @ApiOkResponse({
    description: 'List of user rooms',
    type: [MemberRoomsResponseDto],
  })
  @Get('my')
  userRooms(@UserId() userId: string) {
    return this.service.getUserRooms(userId);
  }

  @ApiOperation({ summary: 'Get room details by code' })
  @ApiOkResponse({
    description: 'Room details',
    type: RoomWithMembersResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Room not found' })
  @Get('code/:code')
  getByCode(@Param('code') roomCode: string) {
    return this.service.getByCode(roomCode);
  }

  @ApiOperation({ summary: 'Get room details by id' })
  @ApiOkResponse({
    description: 'Room details',
    type: RoomWithMembersResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Room not found' })
  @Get('id/:id')
  getById(@Param('id') roomId: string) {
    return this.service.getById(roomId);
  }

  @ApiOperation({ summary: 'Get room members' })
  @ApiOkResponse({
    description: 'List of room members',
    type: RoomMembersResponseDto,
  })
  @Get('id/:id/members')
  members(@Param('id') roomId: string) {
    return this.service.members(roomId);
  }

  @ApiOperation({ summary: 'Get all swipes in a room' })
  @ApiOkResponse({ description: 'List of swipes', type: [ResponseSwipeDto] })
  @Get('id/:id/swipes')
  swipes(@Param('id') roomId: string) {
    return this.swipesService.findByRoom(roomId);
  }
}
