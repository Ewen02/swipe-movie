import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @Get('popular')
  getPopular() {
    return this.moviesService.getPopularMovies();
  }

  @ApiOperation({ summary: 'Get genres of movies' })
  @ApiOkResponse({ type: [MoviesGenresDto] })
  @Get('genres')
  getGenres() {
    return this.moviesService.getGenres();
  }

  @ApiOperation({ summary: 'Get movies by genre' })
  @ApiOkResponse({ type: [MovieBasicDto] })
  @Get('genre/:genreId')
  getByGenre(@Param('genreId', ParseIntPipe) genreId: number) {
    return this.moviesService.getMoviesByGenre(genreId);
  }

  @ApiOperation({ summary: 'Get movie details' })
  @ApiOkResponse({ type: MovieDetailsDto })
  @Get(':movieId')
  getMovieDetails(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.moviesService.getMovieDetails(movieId);
  }
}
