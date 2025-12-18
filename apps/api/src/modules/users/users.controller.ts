import {
  Controller,
  Get,
  Put,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UserPreferencesDto,
  UpdateUserPreferencesDto,
  BatchOnboardingSwipeDto,
} from './dtos/user-preferences.dto';
import {
  LibraryResponseDto,
  LibraryItemDto,
  UpdateLibraryItemDto,
  LibraryStatsDto,
} from './dtos/library.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiOkResponse({ type: UserPreferencesDto })
  @Get('me/preferences')
  async getMyPreferences(@Request() req: any): Promise<UserPreferencesDto> {
    const preferences = await this.usersService.getUserPreferences(req.user.sub);
    if (!preferences) {
      throw new NotFoundException('User not found');
    }
    return preferences;
  }

  @ApiOperation({ summary: 'Update current user preferences' })
  @ApiOkResponse({ type: UserPreferencesDto })
  @Put('me/preferences')
  async updateMyPreferences(
    @Request() req: any,
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesDto> {
    return this.usersService.updateUserPreferences(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Save batch onboarding swipes' })
  @ApiOkResponse({ schema: { properties: { saved: { type: 'number' } } } })
  @Post('me/onboarding/swipes')
  async saveOnboardingSwipes(
    @Request() req: any,
    @Body() dto: BatchOnboardingSwipeDto,
  ): Promise<{ saved: number }> {
    return this.usersService.saveBatchOnboardingSwipes(req.user.sub, dto.swipes);
  }

  @ApiOperation({ summary: 'Complete onboarding' })
  @ApiOkResponse({ type: UserPreferencesDto })
  @Post('me/onboarding/complete')
  async completeOnboarding(@Request() req: any): Promise<UserPreferencesDto> {
    return this.usersService.completeOnboarding(req.user.sub);
  }

  @ApiOperation({ summary: 'Get user library' })
  @ApiOkResponse({ type: LibraryResponseDto })
  @ApiQuery({ name: 'status', required: false, enum: ['watched', 'watchlist', 'rated', 'liked', 'disliked'] })
  @ApiQuery({ name: 'source', required: false, enum: ['trakt', 'anilist', 'manual', 'onboarding', 'discover'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('me/library')
  async getMyLibrary(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<LibraryResponseDto> {
    return this.usersService.getUserLibrary(req.user.sub, {
      status,
      source,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Update library item status' })
  @ApiOkResponse({ type: LibraryItemDto })
  @Patch('me/library/:id')
  async updateLibraryItem(
    @Request() req: any,
    @Param('id') itemId: string,
    @Body() dto: UpdateLibraryItemDto,
  ): Promise<LibraryItemDto> {
    return this.usersService.updateLibraryItemStatus(req.user.sub, itemId, dto.status);
  }

  @ApiOperation({ summary: 'Delete library item' })
  @ApiOkResponse({ schema: { properties: { success: { type: 'boolean' } } } })
  @Delete('me/library/:id')
  async deleteLibraryItem(
    @Request() req: any,
    @Param('id') itemId: string,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteLibraryItem(req.user.sub, itemId);
    return { success: true };
  }

  @ApiOperation({ summary: 'Get library statistics' })
  @ApiOkResponse({ type: LibraryStatsDto })
  @Get('me/library/stats')
  async getLibraryStats(@Request() req: any): Promise<LibraryStatsDto> {
    return this.usersService.getLibraryStats(req.user.sub);
  }

  @ApiOperation({ summary: 'Delete library item by TMDB ID' })
  @ApiOkResponse({ schema: { properties: { success: { type: 'boolean' } } } })
  @ApiQuery({ name: 'mediaType', required: false, enum: ['movie', 'tv'] })
  @Delete('me/library/by-tmdb/:tmdbId')
  async deleteLibraryItemByTmdbId(
    @Request() req: any,
    @Param('tmdbId') tmdbId: string,
    @Query('mediaType') mediaType?: string,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteLibraryItemByTmdbId(
      req.user.sub,
      tmdbId,
      mediaType || 'movie',
    );
    return { success: true };
  }

  @ApiOperation({ summary: 'Export all user data (GDPR)' })
  @ApiOkResponse({ description: 'User data export' })
  @Get('me/export')
  async exportUserData(@Request() req: any) {
    return this.usersService.exportUserData(req.user.sub);
  }

  @ApiOperation({ summary: 'Delete user account and all data (GDPR)' })
  @ApiOkResponse({ schema: { properties: { success: { type: 'boolean' } } } })
  @Delete('me')
  async deleteUserAccount(@Request() req: any): Promise<{ success: boolean }> {
    await this.usersService.deleteUserAccount(req.user.sub);
    return { success: true };
  }
}
