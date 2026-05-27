import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Query,
  Request,
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
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Get all matches for the authenticated user across all rooms' })
  @ApiOkResponse({
    description: 'List of all matches for the current user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findByUser(@Request() req: { user: { sub: string } }) {
    return this.matchesService.findByUser(req.user.sub);
  }

  @ApiOperation({ summary: 'Get public match details (no auth required)' })
  @ApiOkResponse({
    description: 'Public match info with movie ID and room code',
  })
  @Get(':id/public')
  async findByIdPublic(@Param('id') id: string) {
    return this.matchesService.findByIdPublic(id);
  }

  @ApiOperation({ summary: 'Create a new match' })
  @ApiCreatedResponse({
    description: 'Match created',
    type: ResponseMatchDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchesService.createIfNeeded(dto.roomId, dto.movieId);
  }

  @ApiOperation({ summary: 'Get matches of a room (optionally paginated)' })
  @ApiOkResponse({
    description: 'List of matches in the room (paginated if query params provided)',
    type: [ResponseMatchDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
