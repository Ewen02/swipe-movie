import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { SwipesService } from './swipes.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../../common/decorators';

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
  @Post()
  create(@UserId() userId: string, @Body() dto: CreateSwipeDto) {
    return this.service.create(userId, dto.roomId, dto.movieId, dto.value);
  }

  @ApiOperation({ summary: 'Get my swipes' })
  @ApiOkResponse({ description: 'List of my swipes', type: [ResponseSwipeDto] })
  @Get('me')
  getMySwipes(@UserId() userId: string) {
    return this.service.findByUser(userId);
  }
}
