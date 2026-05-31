import { Injectable, Logger } from '@nestjs/common';
import {
  TraktTokens,
  TraktWatchedItem,
  TraktWatchlistItem,
  TraktRating,
  TraktUser,
  ExternalConnection,
  SyncResult,
} from '@swipe-movie/types';
import { TraktAuthService } from './trakt-auth.service';
import { TraktSyncService } from './trakt-sync.service';

@Injectable()
export class TraktService {
  private readonly logger = new Logger(TraktService.name);

  constructor(
    private readonly traktAuthService: TraktAuthService,
    private readonly traktSyncService: TraktSyncService,
  ) {}

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state?: string): string {
    return this.traktAuthService.generateAuthUrl(state);
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TraktTokens> {
    return this.traktAuthService.exchangeCodeForTokens(code);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TraktTokens> {
    return this.traktAuthService.refreshAccessToken(refreshToken);
  }

  /**
   * Get current user info
   */
  async getCurrentUser(accessToken: string): Promise<TraktUser> {
    return this.traktSyncService.getCurrentUser(accessToken);
  }

  /**
   * Get watched movies
   */
  async getWatchedMovies(accessToken: string): Promise<TraktWatchedItem[]> {
    return this.traktSyncService.getWatchedMovies(accessToken);
  }

  /**
   * Get watched shows
   */
  async getWatchedShows(accessToken: string): Promise<TraktWatchedItem[]> {
    return this.traktSyncService.getWatchedShows(accessToken);
  }

  /**
   * Get watchlist
   */
  async getWatchlist(accessToken: string): Promise<TraktWatchlistItem[]> {
    return this.traktSyncService.getWatchlist(accessToken);
  }

  /**
   * Get ratings
   */
  async getRatings(accessToken: string): Promise<TraktRating[]> {
    return this.traktSyncService.getRatings(accessToken);
  }

  /**
   * Add item to watchlist
   */
  async addToWatchlist(
    accessToken: string,
    tmdbId: number,
    type: 'movie' | 'show',
  ): Promise<void> {
    return this.traktSyncService.addToWatchlist(accessToken, tmdbId, type);
  }

  /**
   * Store tokens for user
   */
  async storeTokens(userId: string, tokens: TraktTokens): Promise<void> {
    return this.traktAuthService.storeTokens(userId, tokens);
  }

  /**
   * Get stored tokens for user
   */
  async getStoredTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string | null } | null> {
    return this.traktAuthService.getStoredTokens(userId);
  }

  /**
   * Get connection status
   */
  async getConnectionStatus(userId: string): Promise<ExternalConnection> {
    return this.traktAuthService.getConnectionStatus(userId);
  }

  /**
   * Sync user's Trakt library to local database
   */
  async syncUserLibrary(userId: string): Promise<SyncResult> {
    return this.traktSyncService.syncUserLibrary(userId);
  }

  /**
   * Disconnect Trakt account
   */
  async disconnect(userId: string): Promise<void> {
    return this.traktAuthService.disconnect(userId);
  }
}
