import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { TMDbWatchProvidersResponse } from '../tmdb/types/tmdb.types';
import { TmdbService } from '../tmdb/tmdb.service';
import { TMDB_IMAGE_BASE, TMDB_DEFAULT_LANG } from '../tmdb/tmdb.constants';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  WATCH_PROVIDERS: 7 * 24 * 60 * 60 * 1000, // 7 days
  GENRES: 7 * 24 * 60 * 60 * 1000, // 7 days (used for all providers list)
} as const;

@Injectable()
export class MovieProviderService {
  private readonly logger = new Logger(MovieProviderService.name);

  constructor(
    private readonly tmdb: TmdbService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getWatchProviders(
    movieId: number,
    type: 'movie' | 'tv' = 'movie',
    region = 'FR',
  ): Promise<{ id: number; name: string; logoPath: string }[]> {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const cacheKey = `tmdb:providers:${mediaType}:${movieId}:${region}`;

    // Try to get from cache
    const cached =
      await this.cacheManager.get<
        { id: number; name: string; logoPath: string }[]
      >(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `/${mediaType}/${movieId}/watch/providers`;

    try {
      const json = await this.tmdb.fetchJson<TMDbWatchProvidersResponse>(url);

      // flatrate = streaming subscription. Falls back to empty array if region unknown.
      const regionProviders = json.results?.[region];
      if (!regionProviders?.flatrate) {
        // Cache empty result too to avoid repeated API calls
        await this.cacheManager.set(cacheKey, [], CACHE_TTL.WATCH_PROVIDERS);
        return [];
      }

      // Deduplicate providers by normalized name to avoid duplicates like
      // "Crunchyroll" and "Crunchyroll Amazon Channel"
      const uniqueProvidersMap = new Map<
        string,
        { id: number; name: string; logoPath: string }
      >();

      // Patterns to normalize provider names (remove channel suffixes)
      const normalizeProviderName = (name: string): string => {
        return name
          .replace(/ Amazon Channel$/i, '')
          .replace(/ Apple TV Channel$/i, '')
          .replace(/ Roku Premium Channel$/i, '')
          .trim();
      };

      regionProviders.flatrate.forEach((p) => {
        const normalizedName = normalizeProviderName(p.provider_name);
        // Keep the first occurrence (usually the main provider, not the channel)
        if (!uniqueProvidersMap.has(normalizedName)) {
          uniqueProvidersMap.set(normalizedName, {
            id: p.provider_id,
            name: normalizedName, // Use normalized name
            logoPath: p.logo_path
              ? `${TMDB_IMAGE_BASE.POSTER}${p.logo_path}`
              : '',
          });
        }
      });

      // Return array of unique provider objects
      const result = Array.from(uniqueProvidersMap.values());

      // Store in cache
      await this.cacheManager.set(cacheKey, result, CACHE_TTL.WATCH_PROVIDERS);

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch watch providers for ${mediaType} ${movieId}:`,
        error,
      );
      return [];
    }
  }

  async getBatchWatchProviders(
    movieIds: number[],
    type: 'movie' | 'tv' = 'movie',
  ): Promise<Record<number, { id: number; name: string; logoPath: string }[]>> {
    // Fetch all watch providers in parallel
    const results = await Promise.allSettled(
      movieIds.map(async (id) => ({
        movieId: id,
        providers: await this.getWatchProviders(id, type),
      })),
    );

    // Build a map of movieId -> providers
    const providersMap: Record<
      number,
      { id: number; name: string; logoPath: string }[]
    > = {};

    results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          movieId: number;
          providers: { id: number; name: string; logoPath: string }[];
        }> => result.status === 'fulfilled',
      )
      .forEach((result) => {
        providersMap[result.value.movieId] = result.value.providers;
      });

    return providersMap;
  }

  async getAllWatchProviders(
    region: string = 'FR',
  ): Promise<{ id: number; name: string; logoPath: string }[]> {
    const cacheKey = `tmdb:providers:${region}`;

    // Try to get from cache
    const cached =
      await this.cacheManager.get<
        { id: number; name: string; logoPath: string }[]
      >(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `/watch/providers/movie?language=${TMDB_DEFAULT_LANG}&watch_region=${region}`;

    try {
      const json = await this.tmdb.fetchJson<{
        results: {
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }[];
      }>(url);

      // Map and sort by display priority
      const providers = json.results
        .map((p) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoPath: p.logo_path
            ? `${TMDB_IMAGE_BASE.POSTER}${p.logo_path}`
            : '',
          displayPriority: p.display_priority,
        }))
        .sort((a, b) => a.displayPriority - b.displayPriority)
        .map(({ id, name, logoPath }) => ({ id, name, logoPath }));

      // Store in cache (7 days)
      await this.cacheManager.set(cacheKey, providers, CACHE_TTL.GENRES);

      return providers;
    } catch (error) {
      this.logger.error(
        `Failed to fetch watch providers for ${region}:`,
        error,
      );
      return [];
    }
  }
}
