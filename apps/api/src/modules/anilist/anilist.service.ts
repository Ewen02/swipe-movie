import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infra/prisma.service';
import {
  AniListConfig,
  AniListTokens,
  AniListUser,
  AniListMediaListCollection,
  ExternalConnection,
  SyncResult,
  ExternalProviders,
  MediaLibraryStatus,
} from '@swipe-movie/types';
import {
  GET_CURRENT_USER,
  GET_USER_ANIME_LIST,
  ANILIST_STATUS_MAP,
} from './anilist.queries';

@Injectable()
export class AniListService {
  private readonly logger = new Logger(AniListService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.clientId = this.configService.get<string>('ANILIST_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('ANILIST_CLIENT_SECRET') || '';
    this.redirectUri =
      this.configService.get<string>('ANILIST_REDIRECT_URI') ||
      'http://localhost:3000/auth/anilist/callback';
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });

    if (state) {
      params.append('state', state);
    }

    return `${AniListConfig.AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<AniListTokens> {
    const response = await fetch(AniListConfig.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`AniList token exchange failed: ${error}`);
      throw new UnauthorizedException(
        'Failed to exchange AniList code for tokens',
      );
    }

    return response.json();
  }

  /**
   * Make GraphQL request to AniList API
   */
  private async graphqlRequest<T>(
    query: string,
    variables: Record<string, unknown> = {},
    accessToken?: string,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(AniListConfig.GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`AniList GraphQL error: ${error}`);
      throw new Error(`AniList GraphQL request failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      this.logger.error(`AniList GraphQL errors: ${JSON.stringify(result.errors)}`);
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result.data;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(accessToken: string): Promise<AniListUser> {
    const data = await this.graphqlRequest<{ Viewer: AniListUser }>(
      GET_CURRENT_USER,
      {},
      accessToken,
    );
    return data.Viewer;
  }

  /**
   * Get user's anime list
   */
  async getUserAnimeList(
    accessToken: string,
    userId: number,
  ): Promise<AniListMediaListCollection> {
    const data = await this.graphqlRequest<{
      MediaListCollection: AniListMediaListCollection;
    }>(GET_USER_ANIME_LIST, { userId }, accessToken);
    return data.MediaListCollection;
  }

  /**
   * Store tokens for user
   */
  async storeTokens(userId: string, tokens: AniListTokens): Promise<void> {
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await this.prisma.account.upsert({
      where: {
        userId_providerId: {
          userId,
          providerId: ExternalProviders.ANILIST,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        accessTokenExpiresAt: expiresAt,
      },
      create: {
        userId,
        providerId: ExternalProviders.ANILIST,
        accountId: 'anilist', // Will be updated with username
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        accessTokenExpiresAt: expiresAt,
      },
    });
  }

  /**
   * Get stored tokens for user
   */
  async getStoredTokens(userId: string): Promise<string | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: ExternalProviders.ANILIST,
      },
    });

    if (!account || !account.accessToken) {
      return null;
    }

    // AniList tokens don't expire for a long time, but check anyway
    if (
      account.accessTokenExpiresAt &&
      account.accessTokenExpiresAt < new Date()
    ) {
      this.logger.warn(`AniList token expired for user ${userId}`);
      return null;
    }

    return account.accessToken;
  }

  /**
   * Get connection status
   */
  async getConnectionStatus(userId: string): Promise<ExternalConnection> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: ExternalProviders.ANILIST,
      },
    });

    if (!account || !account.accessToken) {
      return {
        provider: ExternalProviders.ANILIST,
        connected: false,
      };
    }

    return {
      provider: ExternalProviders.ANILIST,
      connected: true,
      username:
        account.accountId !== 'anilist' ? account.accountId : undefined,
      expiresAt: account.accessTokenExpiresAt?.toISOString(),
    };
  }

  /**
   * Search TMDB for anime by title
   * This is needed because AniList uses its own IDs, not TMDB IDs
   */
  private async searchTmdbForAnime(
    title: string,
  ): Promise<string | null> {
    const tmdbApiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!tmdbApiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&language=fr-FR`,
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].id.toString();
      }
    } catch (error) {
      this.logger.error(`TMDB search failed for "${title}"`, error);
    }

    return null;
  }

  /**
   * Sync user's AniList library to local database
   */
  async syncUserLibrary(userId: string): Promise<SyncResult> {
    const accessToken = await this.getStoredTokens(userId);
    if (!accessToken) {
      throw new UnauthorizedException('AniList not connected');
    }

    const result: SyncResult = {
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    try {
      // Get user info and update account
      const user = await this.getCurrentUser(accessToken);
      await this.prisma.account.updateMany({
        where: {
          userId,
          providerId: ExternalProviders.ANILIST,
        },
        data: {
          accountId: user.name,
        },
      });

      // Get anime list
      const animeList = await this.getUserAnimeList(accessToken, user.id);

      // Process each list (Completed, Watching, Planning, etc.)
      for (const list of animeList.lists) {
        for (const entry of list.entries) {
          const media = entry.media;
          const status = ANILIST_STATUS_MAP[entry.status] || 'watchlist';

          // Try to find TMDB ID
          // First, try using MyAnimeList ID if available (more reliable)
          let tmdbId: string | null = null;

          // Search by title as fallback
          const title =
            media.title.english || media.title.romaji || media.title.native;
          if (title) {
            tmdbId = await this.searchTmdbForAnime(title);
          }

          if (!tmdbId) {
            this.logger.debug(
              `Could not find TMDB ID for "${title}" (AniList ID: ${media.id})`,
            );
            result.skipped++;
            continue;
          }

          try {
            // Convert score from 0-10 to our format
            const rating = entry.score > 0 ? entry.score : undefined;

            // Build watched date
            let watchedAt: Date | undefined;
            if (entry.completedAt?.year) {
              watchedAt = new Date(
                entry.completedAt.year,
                (entry.completedAt.month || 1) - 1,
                entry.completedAt.day || 1,
              );
            }

            await this.upsertMediaLibrary(
              userId,
              tmdbId,
              'tv', // Anime is typically TV in TMDB
              status,
              rating,
              watchedAt?.toISOString(),
              media.id.toString(),
            );
            result.imported++;
          } catch {
            result.errors++;
          }
        }
      }

      this.logger.log(
        `AniList sync completed for user ${userId}: ${result.imported} items, ${result.skipped} skipped`,
      );
    } catch (error) {
      this.logger.error(`AniList sync failed for user ${userId}`, error);
      throw error;
    }

    return result;
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
    externalId?: string,
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
        source: ExternalProviders.ANILIST,
        externalId,
      },
      create: {
        userId,
        tmdbId,
        mediaType,
        status,
        rating,
        watchedAt: watchedAt ? new Date(watchedAt) : undefined,
        source: ExternalProviders.ANILIST,
        externalId,
      },
    });
  }

  /**
   * Disconnect AniList account
   */
  async disconnect(userId: string): Promise<void> {
    // Delete account connection
    await this.prisma.account.deleteMany({
      where: {
        userId,
        providerId: ExternalProviders.ANILIST,
      },
    });

    // Optionally delete imported media library entries
    await this.prisma.userMediaLibrary.deleteMany({
      where: {
        userId,
        source: ExternalProviders.ANILIST,
      },
    });
  }
}
