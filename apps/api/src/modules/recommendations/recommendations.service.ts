import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../infra/prisma.service';
import { MoviesService } from '../movies/movies.service';
import type {
  RoomRecommendationContext,
  UserMediaStatus,
  RecommendedMovie,
  MovieBasic,
} from '@swipe-movie/types';

// Cache TTL for recommendations (2 minutes)
const RECOMMENDATIONS_CACHE_TTL = 2 * 60 * 1000;

// Re-export types for backward compatibility with consumers
export type { RoomRecommendationContext, UserMediaStatus, RecommendedMovie } from '@swipe-movie/types';

/**
 * Scoring weights configuration
 * These weights determine how much each factor contributes to the final score
 */
const SCORING_WEIGHTS = {
  // Watchlist factors (highest priority - social proof from room members)
  WATCHLIST_ALL_MEMBERS: 100,      // All members have it in watchlist = perfect match
  WATCHLIST_PER_MEMBER: 25,        // Points per member with movie in watchlist

  // Quality factors (TMDB data)
  VOTE_AVERAGE_MULTIPLIER: 8,      // voteAverage (0-10) × multiplier = 0-80 points
  VOTE_COUNT_LOG_MULTIPLIER: 3,    // log10(voteCount) × multiplier (more votes = more reliable)
  POPULARITY_LOG_MULTIPLIER: 2,    // log10(popularity) × multiplier

  // Recency factors
  RECENT_RELEASE_BONUS: 15,        // Released in last 2 years
  CLASSIC_BONUS: 10,               // Released 20+ years ago (classics)

  // Penalty factors
  LOW_VOTE_COUNT_PENALTY: -20,     // Less than 100 votes = unreliable
  WATCHED_BY_SOME_PENALTY: -50,    // Some members already watched (but not all)

  // User rating factors (from Trakt/AniList)
  HIGH_USER_RATING_BONUS: 20,      // Average user rating > 8
  USER_RATING_MULTIPLIER: 5,       // Points per rating point above 5
} as const;

/**
 * Extended movie interface with scoring data
 */
interface ScoredMovie extends RecommendedMovie {
  recommendationScore: number;
  scoreBreakdown?: {
    watchlistScore: number;
    qualityScore: number;
    recencyScore: number;
    userRatingScore: number;
    penalties: number;
  };
}

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Invalidate recommendations cache for a room
   * Called when a swipe is created/deleted
   */
  async invalidateRoomRecommendationsCache(roomId: string): Promise<void> {
    // Invalidate all pages for this room (we cache pages 1-20 typically)
    for (let page = 1; page <= 20; page++) {
      await this.cacheManager.del(`recommendations:room:${roomId}:page:${page}`);
    }
    this.logger.debug(`Invalidated recommendations cache for room ${roomId}`);
  }

  /**
   * Get user's media library entries
   */
  async getUserMediaLibrary(userId: string): Promise<UserMediaStatus[]> {
    const entries = await this.prisma.userMediaLibrary.findMany({
      where: { userId },
      select: {
        tmdbId: true,
        status: true,
        source: true,
      },
    });

    return entries;
  }

  /**
   * Get watched movies for a set of users
   */
  async getWatchedByUsers(
    userIds: string[],
    mediaType: 'movie' | 'tv' = 'movie',
  ): Promise<Set<string>> {
    const entries = await this.prisma.userMediaLibrary.findMany({
      where: {
        userId: { in: userIds },
        mediaType,
        status: 'watched',
      },
      select: { tmdbId: true },
    });

    return new Set(entries.map((e) => e.tmdbId));
  }

  /**
   * Get watchlist movies for a set of users with count
   */
  async getWatchlistByUsers(
    userIds: string[],
    mediaType: 'movie' | 'tv' = 'movie',
  ): Promise<Map<string, number>> {
    const entries = await this.prisma.userMediaLibrary.findMany({
      where: {
        userId: { in: userIds },
        mediaType,
        status: 'watchlist',
      },
      select: { tmdbId: true },
    });

    // Count how many users have each movie in their watchlist
    const watchlistCount = new Map<string, number>();
    for (const entry of entries) {
      const count = watchlistCount.get(entry.tmdbId) || 0;
      watchlistCount.set(entry.tmdbId, count + 1);
    }

    return watchlistCount;
  }

  /**
   * Get movies that are in the watchlist of ALL members
   */
  async getCommonWatchlist(
    userIds: string[],
    mediaType: 'movie' | 'tv' = 'movie',
  ): Promise<Set<string>> {
    if (userIds.length === 0) return new Set();

    const watchlistCount = await this.getWatchlistByUsers(userIds, mediaType);
    const commonMovies = new Set<string>();

    // Only include movies that are in ALL members' watchlists
    for (const [tmdbId, count] of watchlistCount) {
      if (count === userIds.length) {
        commonMovies.add(tmdbId);
      }
    }

    return commonMovies;
  }

  /**
   * Calculate recommendation score for a movie
   * Higher score = better recommendation
   */
  private calculateRecommendationScore(
    movie: MovieBasic,
    memberCount: number,
    watchlistMemberCount: number,
    watchedByCount: number,
    userRatings: Map<string, number>,
  ): { score: number; breakdown: ScoredMovie['scoreBreakdown'] } {
    const tmdbId = movie.id.toString();
    let watchlistScore = 0;
    let qualityScore = 0;
    let recencyScore = 0;
    let userRatingScore = 0;
    let penalties = 0;

    // === WATCHLIST SCORE ===
    if (watchlistMemberCount > 0) {
      if (watchlistMemberCount === memberCount) {
        // All members have it in their watchlist = highest priority
        watchlistScore = SCORING_WEIGHTS.WATCHLIST_ALL_MEMBERS;
      } else {
        // Partial watchlist match - score based on percentage of members
        watchlistScore = watchlistMemberCount * SCORING_WEIGHTS.WATCHLIST_PER_MEMBER;
      }
    }

    // === QUALITY SCORE (TMDB data) ===
    // Vote average contribution (0-10 scale → 0-80 points)
    qualityScore += movie.voteAverage * SCORING_WEIGHTS.VOTE_AVERAGE_MULTIPLIER;

    // Vote count reliability bonus (log scale to prevent huge movies dominating)
    if (movie.voteCount > 0) {
      qualityScore += Math.log10(movie.voteCount) * SCORING_WEIGHTS.VOTE_COUNT_LOG_MULTIPLIER;
    }

    // Popularity bonus (log scale)
    if (movie.popularity > 0) {
      qualityScore += Math.log10(movie.popularity) * SCORING_WEIGHTS.POPULARITY_LOG_MULTIPLIER;
    }

    // === RECENCY SCORE ===
    if (movie.releaseDate) {
      const releaseYear = new Date(movie.releaseDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - releaseYear;

      if (age <= 2) {
        // Recent release bonus
        recencyScore = SCORING_WEIGHTS.RECENT_RELEASE_BONUS;
      } else if (age >= 20) {
        // Classic movie bonus (stood the test of time)
        recencyScore = SCORING_WEIGHTS.CLASSIC_BONUS;
      }
    }

    // === USER RATING SCORE (from Trakt/AniList) ===
    const avgUserRating = userRatings.get(tmdbId);
    if (avgUserRating !== undefined) {
      if (avgUserRating > 8) {
        userRatingScore = SCORING_WEIGHTS.HIGH_USER_RATING_BONUS;
      }
      // Additional points for ratings above 5
      if (avgUserRating > 5) {
        userRatingScore += (avgUserRating - 5) * SCORING_WEIGHTS.USER_RATING_MULTIPLIER;
      }
    }

    // === PENALTIES ===
    // Low vote count = unreliable score
    if (movie.voteCount < 100) {
      penalties += SCORING_WEIGHTS.LOW_VOTE_COUNT_PENALTY;
    }

    // Some members already watched (creates imbalance in group)
    if (watchedByCount > 0 && watchedByCount < memberCount) {
      penalties += SCORING_WEIGHTS.WATCHED_BY_SOME_PENALTY;
    }

    const totalScore = watchlistScore + qualityScore + recencyScore + userRatingScore + penalties;

    return {
      score: Math.max(0, totalScore), // Never negative
      breakdown: {
        watchlistScore,
        qualityScore: Math.round(qualityScore * 10) / 10,
        recencyScore,
        userRatingScore,
        penalties,
      },
    };
  }

  /**
   * Get user ratings for movies (from Trakt/AniList sync)
   */
  private async getUserRatingsForMovies(
    userIds: string[],
    tmdbIds: string[],
    mediaType: 'movie' | 'tv',
  ): Promise<Map<string, number>> {
    const ratings = await this.prisma.userMediaLibrary.findMany({
      where: {
        userId: { in: userIds },
        tmdbId: { in: tmdbIds },
        mediaType,
        rating: { not: null },
      },
      select: {
        tmdbId: true,
        rating: true,
      },
    });

    // Calculate average rating per movie
    const ratingMap = new Map<string, { sum: number; count: number }>();
    for (const entry of ratings) {
      if (entry.rating === null) continue;
      const existing = ratingMap.get(entry.tmdbId) || { sum: 0, count: 0 };
      existing.sum += entry.rating;
      existing.count += 1;
      ratingMap.set(entry.tmdbId, existing);
    }

    // Convert to average
    const avgRatings = new Map<string, number>();
    for (const [tmdbId, data] of ratingMap) {
      avgRatings.set(tmdbId, data.sum / data.count);
    }

    return avgRatings;
  }

  /**
   * Get watched count per movie (how many members have watched each)
   */
  private async getWatchedCountByMovie(
    userIds: string[],
    tmdbIds: string[],
    mediaType: 'movie' | 'tv',
  ): Promise<Map<string, number>> {
    const entries = await this.prisma.userMediaLibrary.findMany({
      where: {
        userId: { in: userIds },
        tmdbId: { in: tmdbIds },
        mediaType,
        status: 'watched',
      },
      select: { tmdbId: true },
    });

    const watchedCount = new Map<string, number>();
    for (const entry of entries) {
      const count = watchedCount.get(entry.tmdbId) || 0;
      watchedCount.set(entry.tmdbId, count + 1);
    }

    return watchedCount;
  }

  /**
   * Get recommended movies for a room with advanced scoring algorithm
   * Results are cached for 2 minutes to improve performance
   */
  async getRecommendedMoviesForRoom(
    context: RoomRecommendationContext,
    page: number = 1,
  ): Promise<RecommendedMovie[]> {
    const { memberIds, type, genreId, filters } = context;
    const memberCount = memberIds.length;

    // Check cache first
    const cacheKey = `recommendations:room:${context.roomId}:page:${page}`;
    const cached = await this.cacheManager.get<RecommendedMovie[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for room ${context.roomId} page ${page}`);
      return cached;
    }

    // Get watchlist data
    const watchlistCount = await this.getWatchlistByUsers(memberIds, type);

    this.logger.debug(
      `Room ${context.roomId}: ${memberCount} members, ${watchlistCount.size} movies in watchlists`,
    );

    // Fetch movies from TMDB
    const movies = await this.moviesService.getMoviesByGenre(
      genreId,
      type,
      page,
      filters,
    );

    if (movies.length === 0) {
      return [];
    }

    // Get movie IDs for batch queries
    const tmdbIds = movies.map((m) => m.id.toString());

    // Fetch additional data in parallel for scoring
    const [userRatings, watchedCountMap] = await Promise.all([
      this.getUserRatingsForMovies(memberIds, tmdbIds, type),
      this.getWatchedCountByMovie(memberIds, tmdbIds, type),
    ]);

    // Score and enhance each movie
    const scoredMovies: ScoredMovie[] = movies.map((movie) => {
      const tmdbId = movie.id.toString();
      const watchlistMemberCount = watchlistCount.get(tmdbId) || 0;
      const watchedByCount = watchedCountMap.get(tmdbId) || 0;
      const isWatched = watchedByCount === memberCount;
      const isInWatchlist = watchlistMemberCount > 0;

      const { score, breakdown } = this.calculateRecommendationScore(
        movie,
        memberCount,
        watchlistMemberCount,
        watchedByCount,
        userRatings,
      );

      return {
        ...movie,
        isWatched,
        isInWatchlist,
        watchlistMemberCount,
        recommendationScore: Math.round(score * 10) / 10,
        scoreBreakdown: breakdown,
      };
    });

    // Sort by recommendation score (descending)
    scoredMovies.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Log top recommendations for debugging
    if (scoredMovies.length > 0) {
      const top3 = scoredMovies.slice(0, 3).map((m) => ({
        title: m.title,
        score: m.recommendationScore,
        breakdown: m.scoreBreakdown,
      }));
      this.logger.debug(`Top recommendations: ${JSON.stringify(top3)}`);
    }

    // Cache the results
    await this.cacheManager.set(cacheKey, scoredMovies, RECOMMENDATIONS_CACHE_TTL);

    return scoredMovies;
  }

  /**
   * Check if a specific movie is watched by a user
   */
  async isMovieWatchedByUser(
    userId: string,
    tmdbId: string,
    mediaType: 'movie' | 'tv' = 'movie',
  ): Promise<boolean> {
    const entry = await this.prisma.userMediaLibrary.findFirst({
      where: {
        userId,
        tmdbId,
        mediaType,
        status: 'watched',
      },
    });

    return !!entry;
  }

  /**
   * Get user's media library statistics
   */
  async getUserLibraryStats(
    userId: string,
  ): Promise<{ watched: number; watchlist: number }> {
    const [watchedCount, watchlistCount] = await Promise.all([
      this.prisma.userMediaLibrary.count({
        where: { userId, status: 'watched' },
      }),
      this.prisma.userMediaLibrary.count({
        where: { userId, status: 'watchlist' },
      }),
    ]);

    return {
      watched: watchedCount,
      watchlist: watchlistCount,
    };
  }

  /**
   * Get batch status for multiple movies for a user
   */
  async getBatchMovieStatus(
    userId: string,
    tmdbIds: string[],
    mediaType: 'movie' | 'tv' = 'movie',
  ): Promise<Map<string, UserMediaStatus>> {
    const entries = await this.prisma.userMediaLibrary.findMany({
      where: {
        userId,
        tmdbId: { in: tmdbIds },
        mediaType,
      },
      select: {
        tmdbId: true,
        status: true,
        source: true,
      },
    });

    const statusMap = new Map<string, UserMediaStatus>();
    for (const entry of entries) {
      statusMap.set(entry.tmdbId, entry);
    }

    return statusMap;
  }
}
