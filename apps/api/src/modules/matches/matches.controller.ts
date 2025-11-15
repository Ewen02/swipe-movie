import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateMatchDto, ResponseMatchDto } from './dtos';
import { PaginationQueryDto } from '../../common/dtos';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Create a new match' })
  @ApiCreatedResponse({
    description: 'Match created',
    type: ResponseMatchDto,
  })
  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchesService.createIfNeeded(dto.roomId, dto.movieId);
  }

  @ApiOperation({ summary: 'Get matches of a room (optionally paginated)' })
  @ApiOkResponse({
    description: 'List of matches in the room (paginated if query params provided)',
    type: [ResponseMatchDto],
  })
  @Get(':roomId')
  findByRoom(
    @Param('roomId') roomId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // Build pagination object only if params are provided
    const pagination =
      page !== undefined || limit !== undefined ? { page, limit } : undefined;

    return this.matchesService.findByRoom(roomId, pagination);
  }
}
