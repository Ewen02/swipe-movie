import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../../common/decorators/user.decorator';
import { RecommendationsService, RecommendedMovie } from './recommendations.service';
import { PrismaService } from '../../infra/prisma.service';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * GET /recommendations/room/:roomId
   * Get recommended movies for a room with watched/watchlist indicators
   */
  @Get('room/:roomId')
  async getRecommendationsForRoom(
    @Param('roomId') roomId: string,
    @Query('page') page: string = '1',
  ): Promise<{ movies: RecommendedMovie[] }> {
    // Get room with members
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (!room) {
      return { movies: [] };
    }

    const memberIds = room.members.map((m: { userId: string }) => m.userId);
    const type = room.type === 'TV' ? 'tv' : 'movie';

    // Build filters from room settings
    const filters = {
      minRating: room.minRating ?? undefined,
      releaseYearMin: room.releaseYearMin ?? undefined,
      releaseYearMax: room.releaseYearMax ?? undefined,
      runtimeMin: room.runtimeMin ?? undefined,
      runtimeMax: room.runtimeMax ?? undefined,
      watchProviders:
        room.watchProviders && room.watchProviders.length > 0
          ? room.watchProviders
          : undefined,
      watchRegion: room.watchRegion ?? 'FR',
      originalLanguage: room.originalLanguage ?? undefined,
    };

    const movies = await this.recommendationsService.getRecommendedMoviesForRoom(
      {
        roomId,
        memberIds,
        type,
        genreId: room.genreId ?? 0,
        filters,
      },
      parseInt(page, 10),
    );

    return { movies };
  }

  /**
   * GET /recommendations/user/stats
   * Get user's library statistics
   */
  @Get('user/stats')
  async getUserStats(
    @UserId() userId: string,
  ): Promise<{ watched: number; watchlist: number }> {
    return this.recommendationsService.getUserLibraryStats(userId);
  }

  /**
   * GET /recommendations/user/library
   * Get user's media library
   */
  @Get('user/library')
  async getUserLibrary(@UserId() userId: string) {
    const library = await this.recommendationsService.getUserMediaLibrary(userId);
    return { items: library };
  }

  /**
   * GET /recommendations/movie/:tmdbId/status
   * Check if a movie is in user's library
   */
  @Get('movie/:tmdbId/status')
  async getMovieStatus(
    @UserId() userId: string,
    @Param('tmdbId') tmdbId: string,
    @Query('type') type: string = 'movie',
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const statusMap = await this.recommendationsService.getBatchMovieStatus(
      userId,
      [tmdbId],
      mediaType,
    );

    const status = statusMap.get(tmdbId);
    return {
      tmdbId,
      status: status?.status ?? null,
      source: status?.source ?? null,
    };
  }

  /**
   * GET /recommendations/movies/batch-status
   * Get status for multiple movies
   */
  @Get('movies/batch-status')
  async getBatchMovieStatus(
    @UserId() userId: string,
    @Query('ids') ids: string,
    @Query('type') type: string = 'movie',
  ) {
    const tmdbIds = ids.split(',').filter(Boolean);
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const statusMap = await this.recommendationsService.getBatchMovieStatus(
      userId,
      tmdbIds,
      mediaType,
    );

    // Convert Map to object for JSON response
    const result: Record<string, { status: string; source: string } | null> = {};
    for (const tmdbId of tmdbIds) {
      const entry = statusMap.get(tmdbId);
      result[tmdbId] = entry ? { status: entry.status, source: entry.source } : null;
    }

    return result;
  }
}
