import { Injectable, Logger, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infra/prisma.service';
import {
  TraktConfig,
  TraktTokens,
  TraktWatchedItem,
  TraktWatchlistItem,
  TraktRating,
  TraktUser,
  ExternalConnection,
  SyncResult,
  ExternalProviders,
  MediaLibraryStatus,
} from '@swipe-movie/types';
import { RecommendationsService } from '../recommendations/recommendations.service';

@Injectable()
export class TraktService {
  private readonly logger = new Logger(TraktService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RecommendationsService))
    private readonly recommendationsService: RecommendationsService,
  ) {
    this.clientId = this.configService.get<string>('TRAKT_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('TRAKT_CLIENT_SECRET') || '';
    this.redirectUri =
      this.configService.get<string>('TRAKT_REDIRECT_URI') ||
      'http://localhost:3000/auth/trakt/callback';
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    });

    if (state) {
      params.append('state', state);
    }

    return `${TraktConfig.AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TraktTokens> {
    this.logger.debug(`Exchanging code for tokens with redirect_uri: ${this.redirectUri}`);

    const response = await fetch(TraktConfig.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Trakt token exchange failed (${response.status}): ${error}`);
      this.logger.error(`Request details - redirect_uri: ${this.redirectUri}, client_id: ${this.clientId.substring(0, 8)}...`);
      throw new UnauthorizedException(`Failed to exchange Trakt code for tokens: ${error}`);
    }

    return response.json();
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TraktTokens> {
    const response = await fetch(TraktConfig.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to refresh Trakt token');
    }

    return response.json();
  }

  /**
   * Make authenticated API request to Trakt
   */
  private async apiRequest<T>(
    endpoint: string,
    accessToken: string,
    method: 'GET' | 'POST' = 'GET',
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(`${TraktConfig.API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'trakt-api-version': TraktConfig.API_VERSION,
        'trakt-api-key': this.clientId,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Trakt API error: ${error}`);
      throw new Error(`Trakt API request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get current user info
   */
  async getCurrentUser(accessToken: string): Promise<TraktUser> {
    return this.apiRequest<TraktUser>('/users/me', accessToken);
  }

  /**
   * Get watched movies
   */
  async getWatchedMovies(accessToken: string): Promise<TraktWatchedItem[]> {
    return this.apiRequest<TraktWatchedItem[]>(
      '/users/me/watched/movies',
      accessToken,
    );
  }

  /**
   * Get watched shows
   */
  async getWatchedShows(accessToken: string): Promise<TraktWatchedItem[]> {
    return this.apiRequest<TraktWatchedItem[]>(
      '/users/me/watched/shows',
      accessToken,
    );
  }

  /**
   * Get watchlist
   */
  async getWatchlist(accessToken: string): Promise<TraktWatchlistItem[]> {
    return this.apiRequest<TraktWatchlistItem[]>(
      '/users/me/watchlist',
      accessToken,
    );
  }

  /**
   * Get ratings
   */
  async getRatings(accessToken: string): Promise<TraktRating[]> {
    return this.apiRequest<TraktRating[]>('/users/me/ratings', accessToken);
  }

  /**
   * Add item to watchlist
   */
  async addToWatchlist(
    accessToken: string,
    tmdbId: number,
    type: 'movie' | 'show',
  ): Promise<void> {
    const body =
      type === 'movie'
        ? { movies: [{ ids: { tmdb: tmdbId } }] }
        : { shows: [{ ids: { tmdb: tmdbId } }] };

    await this.apiRequest('/sync/watchlist', accessToken, 'POST', body);
  }

  /**
   * Store tokens for user
   */
  async storeTokens(userId: string, tokens: TraktTokens): Promise<void> {
    const expiresAt = new Date(
      (tokens.created_at + tokens.expires_in) * 1000,
    );

    await this.prisma.account.upsert({
      where: {
        userId_providerId: {
          userId,
          providerId: ExternalProviders.TRAKT,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: expiresAt,
      },
      create: {
        userId,
        providerId: ExternalProviders.TRAKT,
        accountId: 'trakt', // Will be updated with username
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: expiresAt,
      },
    });
  }

  /**
   * Get stored tokens for user
   */
  async getStoredTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string | null } | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: ExternalProviders.TRAKT,
      },
    });

    if (!account || !account.accessToken) {
      return null;
    }

    // Check if token is expired and refresh if needed
    if (
      account.accessTokenExpiresAt &&
      account.accessTokenExpiresAt < new Date() &&
      account.refreshToken
    ) {
      try {
        const newTokens = await this.refreshAccessToken(account.refreshToken);
        await this.storeTokens(userId, newTokens);
        return {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        };
      } catch (error) {
        this.logger.error(`Failed to refresh Trakt token for user ${userId}`);
        return null;
      }
    }

    return {
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    };
  }

  /**
   * Get connection status
   */
  async getConnectionStatus(userId: string): Promise<ExternalConnection> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: ExternalProviders.TRAKT,
      },
    });

    if (!account || !account.accessToken) {
      return {
        provider: ExternalProviders.TRAKT,
        connected: false,
      };
    }

    return {
      provider: ExternalProviders.TRAKT,
      connected: true,
      username: account.accountId !== 'trakt' ? account.accountId : undefined,
      expiresAt: account.accessTokenExpiresAt?.toISOString(),
      lastSync: account.lastSyncAt?.toISOString(),
    };
  }

  /**
   * Sync user's Trakt library to local database
   */
  async syncUserLibrary(userId: string): Promise<SyncResult> {
    const tokens = await this.getStoredTokens(userId);
    if (!tokens) {
      throw new UnauthorizedException('Trakt not connected');
    }

    const result: SyncResult = {
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    try {
      // Get user info and update account with lastSyncAt
      const user = await this.getCurrentUser(tokens.accessToken);
      await this.prisma.account.updateMany({
        where: {
          userId,
          providerId: ExternalProviders.TRAKT,
        },
        data: {
          accountId: user.username,
          lastSyncAt: new Date(),
        },
      });

      // Sync watched movies
      const watchedMovies = await this.getWatchedMovies(tokens.accessToken);
      for (const item of watchedMovies) {
        if (item.movie?.ids.tmdb) {
          try {
            await this.upsertMediaLibrary(
              userId,
              item.movie.ids.tmdb.toString(),
              'movie',
              MediaLibraryStatus.WATCHED,
              undefined,
              item.last_watched_at,
            );
            result.imported++;
          } catch {
            result.errors++;
          }
        }
      }

      // Sync watched shows
      const watchedShows = await this.getWatchedShows(tokens.accessToken);
      for (const item of watchedShows) {
        if (item.show?.ids.tmdb) {
          try {
            await this.upsertMediaLibrary(
              userId,
              item.show.ids.tmdb.toString(),
              'tv',
              MediaLibraryStatus.WATCHED,
              undefined,
              item.last_watched_at,
            );
            result.imported++;
          } catch {
            result.errors++;
          }
        }
      }

      // Sync watchlist
      const watchlist = await this.getWatchlist(tokens.accessToken);
      for (const item of watchlist) {
        const media = item.movie || item.show;
        const tmdbId = media?.ids.tmdb;
        if (tmdbId) {
          try {
            await this.upsertMediaLibrary(
              userId,
              tmdbId.toString(),
              item.type === 'movie' ? 'movie' : 'tv',
              MediaLibraryStatus.WATCHLIST,
            );
            result.imported++;
          } catch {
            result.errors++;
          }
        }
      }

      // Sync ratings
      const ratings = await this.getRatings(tokens.accessToken);
      for (const item of ratings) {
        const media = item.movie || item.show;
        const tmdbId = media?.ids.tmdb;
        if (tmdbId) {
          try {
            await this.upsertMediaLibrary(
              userId,
              tmdbId.toString(),
              item.type === 'movie' ? 'movie' : 'tv',
              MediaLibraryStatus.RATED,
              item.rating,
              item.rated_at,
            );
            result.imported++;
          } catch {
            result.errors++;
          }
        }
      }

      this.logger.log(
        `Trakt sync completed for user ${userId}: ${result.imported} items`,
      );

      // Invalidate recommendations cache for all rooms where user is a member
      await this.invalidateUserRoomsRecommendationsCache(userId);
    } catch (error) {
      this.logger.error(`Trakt sync failed for user ${userId}`, error);
      throw error;
    }

    return result;
  }

  /**
   * Invalidate recommendations cache for all rooms where user is a member
   */
  private async invalidateUserRoomsRecommendationsCache(userId: string): Promise<void> {
    const userRooms = await this.prisma.roomMember.findMany({
      where: { userId },
      select: { roomId: true },
    });

    for (const { roomId } of userRooms) {
      await this.recommendationsService.invalidateRoomRecommendationsCache(roomId);
    }

    this.logger.debug(`Invalidated recommendations cache for ${userRooms.length} rooms after Trakt sync`);
  }

  /**
   * Upsert media library entry
   */
  private async upsertMediaLibrary(
    userId: string,
    tmdbId: string,
    mediaType: 'movie' | 'tv',
    status: string,
    rating?: number,
    watchedAt?: string,
  ): Promise<void> {
    await this.prisma.userMediaLibrary.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId,
          tmdbId,
          mediaType,
        },
      },
      update: {
        status,
        rating,
        watchedAt: watchedAt ? new Date(watchedAt) : undefined,
        source: ExternalProviders.TRAKT,
      },
      create: {
        userId,
        tmdbId,
        mediaType,
        status,
        rating,
        watchedAt: watchedAt ? new Date(watchedAt) : undefined,
        source: ExternalProviders.TRAKT,
      },
    });
  }

  /**
   * Disconnect Trakt account
   */
  async disconnect(userId: string): Promise<void> {
    // Delete account connection
    await this.prisma.account.deleteMany({
      where: {
        userId,
        providerId: ExternalProviders.TRAKT,
      },
    });

    // Optionally delete imported media library entries
    await this.prisma.userMediaLibrary.deleteMany({
      where: {
        userId,
        source: ExternalProviders.TRAKT,
      },
    });
  }
}
