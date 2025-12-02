import { Body, Controller, Post, Get, Delete, UseGuards, Query } from '@nestjs/common';
import { SwipesService } from './swipes.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../../common/decorators';
import { ThrottleSwipe } from '../../common/decorators/throttle.decorator';

import {
  CreateSwipeDto,
  ResponseSwipeDto,
  ResponseCreateSwipeDto,
} from './dtos';

@ApiTags('Swipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('swipes')
export class SwipesController {
  constructor(private service: SwipesService) {}

  @ApiOperation({ summary: 'Create a new swipe' })
  @ApiCreatedResponse({
    description: 'Swipe created',
    type: ResponseCreateSwipeDto,
  })
  @ThrottleSwipe() // Allow fast swiping: 50 req/s, 500 req/min
  @Post()
  create(@UserId() userId: string, @Body() dto: CreateSwipeDto) {
    return this.service.create(userId, dto.roomId, dto.movieId, dto.value);
  }

  @ApiOperation({ summary: 'Get my swipes' })
  @ApiOkResponse({ description: 'List of my swipes', type: [ResponseSwipeDto] })
  @ApiQuery({
    name: 'roomId',
    required: false,
    description: 'Filter swipes by room',
  })
  @Get('me')
  getMySwipes(@UserId() userId: string, @Query('roomId') roomId?: string) {
    if (roomId) {
      return this.service.findByUserInRoom(userId, roomId);
    }
    return this.service.findByUser(userId);
  }

  @ApiOperation({ summary: 'Delete a swipe (for undo functionality)' })
  @ApiOkResponse({ description: 'Swipe deleted successfully' })
  @ApiQuery({ name: 'roomId', required: true, description: 'Room ID' })
  @ApiQuery({ name: 'movieId', required: true, description: 'Movie ID' })
  @Delete()
  delete(
    @UserId() userId: string,
    @Query('roomId') roomId: string,
    @Query('movieId') movieId: string,
  ) {
    return this.service.delete(userId, roomId, movieId);
  }

  @ApiOperation({ summary: 'Get user stats (matches, swipes)' })
  @ApiOkResponse({ description: 'User statistics' })
  @Get('stats')
  getUserStats(@UserId() userId: string) {
    return this.service.getUserStats(userId);
  }

  @ApiOperation({ summary: 'Get room analytics and statistics' })
  @ApiOkResponse({ description: 'Room statistics' })
  @ApiQuery({ name: 'roomId', required: true, description: 'Room ID' })
  @Get('analytics')
  getRoomAnalytics(
    @UserId() userId: string,
    @Query('roomId') roomId: string,
  ) {
    return this.service.getRoomAnalytics(roomId, userId);
  }
}
