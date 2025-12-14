import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../../common/decorators/user.decorator';
import { AniListService } from './anilist.service';
import { AniListCallbackDto } from './dto/anilist-callback.dto';
import { ExternalConnection, SyncResult } from '@swipe-movie/types';

@Controller('anilist')
@UseGuards(JwtAuthGuard)
export class AniListController {
  constructor(private readonly anilistService: AniListService) {}

  /**
   * GET /anilist/auth-url
   * Generate OAuth authorization URL for AniList
   */
  @Get('auth-url')
  getAuthUrl(@UserId() userId: string): { url: string } {
    const url = this.anilistService.generateAuthUrl(userId);
    return { url };
  }

  /**
   * POST /anilist/callback
   * Exchange authorization code for tokens
   */
  @Post('callback')
  async handleCallback(
    @UserId() userId: string,
    @Body() dto: AniListCallbackDto,
  ): Promise<{ success: boolean }> {
    const tokens = await this.anilistService.exchangeCodeForTokens(dto.code);
    await this.anilistService.storeTokens(userId, tokens);

    // Get user info to store username
    const user = await this.anilistService.getCurrentUser(tokens.access_token);

    return { success: true };
  }

  /**
   * POST /anilist/sync
   * Sync user's AniList library to local database
   */
  @Post('sync')
  async syncLibrary(@UserId() userId: string): Promise<SyncResult> {
    return this.anilistService.syncUserLibrary(userId);
  }

  /**
   * GET /anilist/status
   * Get connection status
   */
  @Get('status')
  async getStatus(@UserId() userId: string): Promise<ExternalConnection> {
    return this.anilistService.getConnectionStatus(userId);
  }

  /**
   * DELETE /anilist/disconnect
   * Disconnect AniList account
   */
  @Delete('disconnect')
  async disconnect(@UserId() userId: string): Promise<{ success: boolean }> {
    await this.anilistService.disconnect(userId);
    return { success: true };
  }
}
