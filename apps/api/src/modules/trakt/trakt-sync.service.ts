import {
  Injectable,
  Logger,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MediaType,
  MediaStatus,
  MediaSource,
} from '../../common/constants/media';
import { PrismaService } from '../../infra/prisma.service';
import {
  TraktConfig,
  TraktWatchedItem,
  TraktWatchlistItem,
  TraktRating,
  TraktUser,
  SyncResult,
  ExternalProviders,
} from '@swipe-movie/types';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { TraktAuthService } from './trakt-auth.service';

@Injectable()
export class TraktSyncService {
  private readonly logger = new Logger(TraktSyncService.name);
  private readonly clientId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RecommendationsService))
    private readonly recommendationsService: RecommendationsService,
    private readonly traktAuthService: TraktAuthService,
  ) {
    this.clientId = this.configService.get<string>('TRAKT_CLIENT_ID') || '';
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
   * Sync user's Trakt library to local database
   */
  async syncUserLibrary(userId: string): Promise<SyncResult> {
    const tokens = await this.traktAuthService.getStoredTokens(userId);
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
              MediaType.movie,
              MediaStatus.watched,
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
              MediaType.tv,
              MediaStatus.watched,
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
              item.type === 'movie' ? MediaType.movie : MediaType.tv,
              MediaStatus.watchlist,
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
              item.type === 'movie' ? MediaType.movie : MediaType.tv,
              MediaStatus.rated,
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
  private async invalidateUserRoomsRecommendationsCache(
    userId: string,
  ): Promise<void> {
    const userRooms = await this.prisma.roomMember.findMany({
      where: { userId },
      select: { roomId: true },
    });

    for (const { roomId } of userRooms) {
      await this.recommendationsService.invalidateRoomRecommendationsCache(
        roomId,
      );
    }

    this.logger.debug(
      `Invalidated recommendations cache for ${userRooms.length} rooms after Trakt sync`,
    );
  }

  /**
   * Upsert media library entry
   */
  private async upsertMediaLibrary(
    userId: string,
    tmdbId: string,
    mediaType: MediaType,
    status: MediaStatus,
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
        source: MediaSource.trakt,
      },
      create: {
        userId,
        tmdbId,
        mediaType,
        status,
        rating,
        watchedAt: watchedAt ? new Date(watchedAt) : undefined,
        source: MediaSource.trakt,
      },
    });
  }
}
