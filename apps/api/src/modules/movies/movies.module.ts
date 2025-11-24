import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TmdbModule } from '../tmdb/tmdb.module';
import { TMDBProvider, OMDbProvider } from './providers';
import { IMovieProvider } from './interfaces/movie-provider.interface';

/**
 * Movies module with pluggable movie data providers
 *
 * Supports switching between different movie APIs via environment variable:
 * - MOVIE_API_PROVIDER=tmdb (default) - Uses TMDB API
 * - MOVIE_API_PROVIDER=omdb - Uses OMDb API (Phase 2)
 *
 * This abstraction allows easy migration between providers without code changes.
 * See ROADMAP_SAAS.md for provider comparison and migration strategy.
 */
@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    TMDBProvider,
    OMDbProvider,
    {
      provide: 'MOVIE_PROVIDER',
      useFactory: (
        tmdbProvider: TMDBProvider,
        omdbProvider: OMDbProvider,
        configService: ConfigService,
      ): IMovieProvider => {
        const provider = configService.get<string>('MOVIE_API_PROVIDER', 'tmdb');

        switch (provider.toLowerCase()) {
          case 'omdb':
            return omdbProvider;
          case 'tmdb':
          default:
            return tmdbProvider;
        }
      },
      inject: [TMDBProvider, OMDbProvider, ConfigService],
    },
  ],
  exports: [MoviesService, 'MOVIE_PROVIDER'],
  imports: [TmdbModule, ConfigModule],
})
export class MoviesModule {}
