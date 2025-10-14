import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TmdbModule } from '../tmdb/tmdb.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
  imports: [TmdbModule],
})
export class MoviesModule {}
