import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';
import { MoviesService, MovieFilters } from './movies.service';
import { ApiOkResponse, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  MovieBasicDto,
  MoviesGenresDto,
  MovieDetailsDto,
} from './dtos/movie-response.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get popular movies' })
  @ApiOkResponse({ type: [MovieBasicDto] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (defaults to 1)' })
  @Get('popular')
  getPopular(@Query('page', new ParseIntPipe({ optional: true })) page?: number) {
    return this.moviesService.getPopularMovies(page);
  }

  @ApiOperation({ summary: 'Get genres of movies' })
  @ApiOkResponse({ type: [MoviesGenresDto] })
  @Get('genres')
  getGenres() {
    return this.moviesService.getGenres();
  }

  @ApiOperation({ summary: 'Get movies by genre' })
  @ApiOkResponse({ type: [MovieBasicDto] })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['movie', 'tv'],
    description: 'Type of content (defaults to movie)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (defaults to 1)',
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    description: 'Minimum rating (0-10)',
  })
  @ApiQuery({
    name: 'releaseYearMin',
    required: false,
    description: 'Minimum release year',
  })
  @ApiQuery({
    name: 'releaseYearMax',
    required: false,
    description: 'Maximum release year',
  })
  @ApiQuery({
    name: 'runtimeMin',
    required: false,
    description: 'Minimum runtime in minutes',
  })
  @ApiQuery({
    name: 'runtimeMax',
    required: false,
    description: 'Maximum runtime in minutes',
  })
  @ApiQuery({
    name: 'watchProviders',
    required: false,
    description: 'Watch provider IDs (comma-separated)',
  })
  @ApiQuery({
    name: 'watchRegion',
    required: false,
    description: 'Watch region (ISO country code)',
  })
  @ApiQuery({
    name: 'originalLanguage',
    required: false,
    description: 'Original language (ISO 639-1 code)',
  })
  @Get('genre/:genreId')
  getByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query('type') type?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('minRating', new ParseFloatPipe({ optional: true }))
    minRating?: number,
    @Query('releaseYearMin', new ParseIntPipe({ optional: true }))
    releaseYearMin?: number,
    @Query('releaseYearMax', new ParseIntPipe({ optional: true }))
    releaseYearMax?: number,
    @Query('runtimeMin', new ParseIntPipe({ optional: true }))
    runtimeMin?: number,
    @Query('runtimeMax', new ParseIntPipe({ optional: true }))
    runtimeMax?: number,
    @Query('watchProviders') watchProviders?: string,
    @Query('watchRegion') watchRegion?: string,
    @Query('originalLanguage') originalLanguage?: string,
  ) {
    const filters: MovieFilters = {
      minRating,
      releaseYearMin,
      releaseYearMax,
      runtimeMin,
      runtimeMax,
      watchProviders: watchProviders
        ? watchProviders.split(',').map((id) => parseInt(id, 10))
        : undefined,
      watchRegion,
      originalLanguage,
    };

    return this.moviesService.getMoviesByGenre(
      genreId,
      type as 'movie' | 'tv',
      page,
      filters,
    );
  }

  @ApiOperation({ summary: 'Get multiple movie details in batch' })
  @ApiOkResponse({ type: [MovieDetailsDto] })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: 'Comma-separated list of movie IDs',
  })
  @Get('batch/details')
  getBatchMovieDetails(@Query('ids') ids: string) {
    const movieIds = ids.split(',').map((id) => parseInt(id.trim(), 10));
    return this.moviesService.getBatchMovieDetails(movieIds);
  }

  @ApiOperation({ summary: 'Get watch providers for multiple movies in batch' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            logoPath: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: 'Comma-separated list of movie IDs',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['movie', 'tv'],
    description: 'Type of content (defaults to movie)',
  })
  @Get('batch/providers')
  async getBatchWatchProviders(
    @Query('ids') ids: string,
    @Query('type') type?: string,
  ) {
    const movieIds = ids.split(',').map((id) => parseInt(id.trim(), 10));
    return this.moviesService.getBatchWatchProviders(
      movieIds,
      type as 'movie' | 'tv',
    );
  }

  @ApiOperation({ summary: 'Get all available watch providers for a region' })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          logoPath: { type: 'string' },
        },
      },
    },
  })
  @ApiQuery({
    name: 'region',
    required: false,
    description: 'Region code (defaults to FR)',
  })
  @Get('providers/all')
  getAllWatchProviders(@Query('region') region?: string) {
    return this.moviesService.getAllWatchProviders(region);
  }

  @ApiOperation({ summary: 'Get movie or TV show details' })
  @ApiOkResponse({ type: MovieDetailsDto })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['movie', 'tv'],
    description: 'Type of content (defaults to movie)',
  })
  @Get(':movieId')
  getMovieDetails(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('type') type?: string,
  ) {
    return this.moviesService.getMovieDetails(movieId, type as 'movie' | 'tv');
  }

  @ApiOperation({ summary: 'Get watch providers for a movie' })
  @ApiOkResponse({ type: [Number], description: 'Array of provider IDs' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['movie', 'tv'],
    description: 'Type of content (defaults to movie)',
  })
  @Get(':movieId/providers')
  getWatchProviders(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('type') type?: string,
  ) {
    return this.moviesService.getWatchProviders(movieId, type as 'movie' | 'tv');
  }
}
