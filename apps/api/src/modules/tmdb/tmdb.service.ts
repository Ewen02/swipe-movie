import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

@Injectable()
export class TmdbService {
  private readonly baseUrl = process.env.TMDB_API_URL;
  private readonly apiKey = process.env.TMDB_API_KEY;
  private readonly logger = new Logger(TmdbService.name);
  private readonly retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 seconde
    maxDelay: 10000, // 10 secondes max
  };

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private calculateBackoff(attempt: number): number {
    // Exponential backoff avec jitter
    const exponentialDelay = Math.min(
      this.retryConfig.baseDelay * Math.pow(2, attempt),
      this.retryConfig.maxDelay,
    );
    // Ajouter un jitter aléatoire de ±20%
    const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);
    return Math.floor(exponentialDelay + jitter);
  }

  private isRetryableError(status: number): boolean {
    // Retry sur les erreurs temporaires
    return (
      status === 429 || // Rate limit
      status === 500 || // Internal server error
      status === 502 || // Bad gateway
      status === 503 || // Service unavailable
      status === 504 // Gateway timeout
    );
  }

  async fetch(path: string, init?: RequestInit): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const headers = {
          Authorization: `Bearer ${this.apiKey}`,
          ...(init?.headers || {}),
        };

        this.logger.debug(
          `TMDb request attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1}: ${path}`,
        );

        const res = await fetch(`${this.baseUrl}${path}`, {
          ...init,
          headers,
        });

        if (!res.ok) {
          // Handle rate limiting with retry-after header
          if (res.status === 429) {
            const retryAfter = res.headers.get('Retry-After');
            const retryDelay = retryAfter
              ? parseInt(retryAfter, 10) * 1000
              : this.calculateBackoff(attempt);

            this.logger.warn(
              `TMDb rate limit hit. Retry in ${retryDelay}ms (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1})`,
            );

            if (attempt < this.retryConfig.maxRetries) {
              await this.sleep(retryDelay);
              continue;
            }
          }

          // Retry sur les erreurs temporaires
          if (
            this.isRetryableError(res.status) &&
            attempt < this.retryConfig.maxRetries
          ) {
            const delay = this.calculateBackoff(attempt);
            this.logger.warn(
              `TMDb error ${res.status}. Retrying in ${delay}ms (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1})`,
            );
            await this.sleep(delay);
            continue;
          }

          throw new HttpException(
            `TMDb API error: status ${res.status} on path ${path}`,
            res.status === 429
              ? HttpStatus.TOO_MANY_REQUESTS
              : HttpStatus.BAD_GATEWAY,
          );
        }

        this.logger.debug(`TMDb request successful: ${path}`);
        return res;
      } catch (error) {
        lastError = error as Error;

        // Si c'est une HttpException, on ne retry pas (sauf rate limit)
        if (error instanceof HttpException) {
          throw error;
        }

        // Network errors - retry
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateBackoff(attempt);
          this.logger.warn(
            `TMDb network error. Retrying in ${delay}ms (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1})`,
            error,
          );
          await this.sleep(delay);
          continue;
        }

        this.logger.error(
          `TMDb request failed after ${attempt + 1} attempts: ${path}`,
          error,
        );
      }
    }

    // Si on arrive ici, tous les retries ont échoué
    throw new HttpException(
      `TMDb API unavailable after ${this.retryConfig.maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  async fetchJson<T>(
    path: string,
    init?: RequestInit,
    cacheTTL = 3600000,
  ): Promise<T> {
    const cacheKey = `tmdb:${path}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${path}`);
      return cached;
    }

    // Fetch from API
    this.logger.debug(`Cache miss for ${path}, fetching from TMDb`);
    try {
      const res = await this.fetch(path, init);
      const data = (await res.json()) as T;

      // Store in cache
      await this.cacheManager.set(cacheKey, data, cacheTTL);

      return data;
    } catch (error) {
      // On rate limit or error, return cached data if available (even if expired)
      if (cached) {
        this.logger.warn(`Using stale cache for ${path} due to error`);
        return cached;
      }
      throw error;
    }
  }
}
