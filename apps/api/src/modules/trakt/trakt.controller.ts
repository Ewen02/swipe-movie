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
import { TraktService } from './trakt.service';
import { TraktCallbackDto } from './dto/trakt-callback.dto';
import { ExternalConnection, SyncResult } from '@swipe-movie/types';

@Controller('trakt')
@UseGuards(JwtAuthGuard)
export class TraktController {
  constructor(private readonly traktService: TraktService) {}

  /**
   * GET /trakt/auth-url
   * Generate OAuth authorization URL for Trakt
   */
  @Get('auth-url')
  getAuthUrl(@UserId() userId: string): { url: string } {
    const url = this.traktService.generateAuthUrl(userId);
    return { url };
  }

  /**
   * POST /trakt/callback
   * Exchange authorization code for tokens
   */
  @Post('callback')
  async handleCallback(
    @UserId() userId: string,
    @Body() dto: TraktCallbackDto,
  ): Promise<{ success: boolean }> {
    const tokens = await this.traktService.exchangeCodeForTokens(dto.code);
    await this.traktService.storeTokens(userId, tokens);

    // Get user info to store username
    const user = await this.traktService.getCurrentUser(tokens.access_token);

    return { success: true };
  }

  /**
   * POST /trakt/sync
   * Sync user's Trakt library to local database
   */
  @Post('sync')
  async syncLibrary(@UserId() userId: string): Promise<SyncResult> {
    return this.traktService.syncUserLibrary(userId);
  }

  /**
   * GET /trakt/status
   * Get connection status
   */
  @Get('status')
  async getStatus(@UserId() userId: string): Promise<ExternalConnection> {
    return this.traktService.getConnectionStatus(userId);
  }

  /**
   * DELETE /trakt/disconnect
   * Disconnect Trakt account
   */
  @Delete('disconnect')
  async disconnect(@UserId() userId: string): Promise<{ success: boolean }> {
    await this.traktService.disconnect(userId);
    return { success: true };
  }
}
