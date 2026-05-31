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
  Req,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MediaType } from '../../common/constants/media';
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
  async getMyPreferences(
    @Req() req: Express.Request,
  ): Promise<UserPreferencesDto> {
    const preferences = await this.usersService.getUserPreferences(
      (req.user as { sub: string }).sub,
    );
    if (!preferences) {
      throw new NotFoundException('User not found');
    }
    return preferences;
  }

  @ApiOperation({ summary: 'Update current user preferences' })
  @ApiOkResponse({ type: UserPreferencesDto })
  @Put('me/preferences')
  async updateMyPreferences(
    @Req() req: Express.Request,
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesDto> {
    return this.usersService.updateUserPreferences(
      (req.user as { sub: string }).sub,
      dto,
    );
  }

  @ApiOperation({ summary: 'Save batch onboarding swipes' })
  @ApiOkResponse({ schema: { properties: { saved: { type: 'number' } } } })
  @Post('me/onboarding/swipes')
  async saveOnboardingSwipes(
    @Req() req: Express.Request,
    @Body() dto: BatchOnboardingSwipeDto,
  ): Promise<{ saved: number }> {
    return this.usersService.saveBatchOnboardingSwipes(
      (req.user as { sub: string }).sub,
      dto.swipes,
    );
  }

  @ApiOperation({ summary: 'Complete onboarding' })
  @ApiOkResponse({ type: UserPreferencesDto })
  @Post('me/onboarding/complete')
  async completeOnboarding(
    @Req() req: Express.Request,
  ): Promise<UserPreferencesDto> {
    return this.usersService.completeOnboarding(
      (req.user as { sub: string }).sub,
    );
  }

  @ApiOperation({ summary: 'Get user library' })
  @ApiOkResponse({ type: LibraryResponseDto })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['watched', 'watchlist', 'rated', 'liked', 'disliked'],
  })
  @ApiQuery({
    name: 'source',
    required: false,
    enum: ['trakt', 'anilist', 'manual', 'onboarding', 'discover'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('me/library')
  async getMyLibrary(
    @Req() req: Express.Request,
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<LibraryResponseDto> {
    return this.usersService.getUserLibrary((req.user as { sub: string }).sub, {
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
    @Req() req: Express.Request,
    @Param('id') itemId: string,
    @Body() dto: UpdateLibraryItemDto,
  ): Promise<LibraryItemDto> {
    return this.usersService.updateLibraryItemStatus(
      (req.user as { sub: string }).sub,
      itemId,
      dto.status,
    );
  }

  @ApiOperation({ summary: 'Delete library item' })
  @ApiOkResponse({ schema: { properties: { success: { type: 'boolean' } } } })
  @Delete('me/library/:id')
  async deleteLibraryItem(
    @Req() req: Express.Request,
    @Param('id') itemId: string,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteLibraryItem(
      (req.user as { sub: string }).sub,
      itemId,
    );
    return { success: true };
  }

  @ApiOperation({ summary: 'Get library statistics' })
  @ApiOkResponse({ type: LibraryStatsDto })
  @Get('me/library/stats')
  async getLibraryStats(@Req() req: Express.Request): Promise<LibraryStatsDto> {
    return this.usersService.getLibraryStats((req.user as { sub: string }).sub);
  }

  @ApiOperation({ summary: 'Delete library item by TMDB ID' })
  @ApiOkResponse({ schema: { properties: { success: { type: 'boolean' } } } })
  @ApiQuery({ name: 'mediaType', required: false, enum: ['movie', 'tv'] })
  @Delete('me/library/by-tmdb/:tmdbId')
  async deleteLibraryItemByTmdbId(
    @Req() req: Express.Request,
    @Param('tmdbId') tmdbId: string,
    @Query('mediaType') mediaType?: string,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteLibraryItemByTmdbId(
      (req.user as { sub: string }).sub,
      tmdbId,
      (mediaType || 'movie') as MediaType,
    );
    return { success: true };
  }

  @ApiOperation({ summary: 'Export all user data (GDPR)' })
  @ApiOkResponse({ description: 'User data export' })
  @Get('me/export')
  async exportUserData(@Req() req: Express.Request) {
    return this.usersService.exportUserData((req.user as { sub: string }).sub);
  }

  @ApiOperation({ summary: 'Delete user account and all data (GDPR)' })
  @ApiOkResponse({ schema: { properties: { success: { type: 'boolean' } } } })
  @Delete('me')
  async deleteUserAccount(
    @Req() req: Express.Request,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteUserAccount(
      (req.user as { sub: string }).sub,
    );
    return { success: true };
  }
}
