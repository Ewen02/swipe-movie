import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../../common/decorators';
import { GroupsService } from './groups.service';
import {
  CreateGroupDto,
  GroupResponseDto,
  GroupsResponseDto,
  GroupSessionResponseDto,
} from './dtos';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @ApiOperation({ summary: 'Create a persistent group' })
  @ApiCreatedResponse({ type: GroupResponseDto })
  @Post()
  create(@UserId() userId: string, @Body() dto: CreateGroupDto) {
    return this.service.create(userId, dto);
  }

  @ApiOperation({ summary: "List the current user's groups" })
  @ApiOkResponse({ type: GroupsResponseDto })
  @Get('my')
  my(@UserId() userId: string) {
    return this.service.listForUser(userId);
  }

  @ApiOperation({ summary: 'Get a group by id' })
  @ApiOkResponse({ type: GroupResponseDto })
  @Get('id/:id')
  getById(@UserId() userId: string, @Param('id') id: string) {
    return this.service.getById(userId, id);
  }

  @ApiOperation({
    summary: 'Start a fresh session (room) from a group and notify members',
  })
  @ApiCreatedResponse({ type: GroupSessionResponseDto })
  @Post('id/:id/session')
  startSession(@UserId() userId: string, @Param('id') id: string) {
    return this.service.startSession(userId, id);
  }

  @ApiOperation({ summary: 'Delete a group (owner only)' })
  @ApiOkResponse()
  @Delete('id/:id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.service.delete(userId, id);
  }
}
