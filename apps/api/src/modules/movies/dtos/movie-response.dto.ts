import { ApiProperty } from '@nestjs/swagger';
import type {
  MovieBasic,
  MovieDetails,
  MovieGenre,
  MovieWatchProvider,
  MovieVideo,
  MovieCast,
  MovieCrew,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from '@swipe-movie/types';

/**
 * DTO de base pour les films (liste, résumé)
 * Implements MovieBasic from @swipe-movie/types
 */
export class MovieBasicDto implements MovieBasic {
  @ApiProperty({ example: 550 })
  id!: number;

  @ApiProperty({ example: false })
  adult!: boolean;

  @ApiProperty({ example: 'Fight Club' })
  title!: string;

  @ApiProperty({ example: 'https://image.tmdb.org/t/p/w500/abc123.jpg' })
  posterUrl!: string;

  @ApiProperty({ example: 'https://image.tmdb.org/t/p/w780/xyz456.jpg' })
  backdropUrl!: string;

  @ApiProperty({ example: [18, 53, 35] })
  genreIds!: number[];

  @ApiProperty({ example: 'en' })
  originalLanguage!: string;

  @ApiProperty({ example: 'Fight Club' })
  originalTitle!: string;

  @ApiProperty({ example: 61.416 })
  popularity!: number;

  @ApiProperty({ example: '1999-10-15' })
  releaseDate!: string;

  @ApiProperty({ example: 'A ticking-time-bomb insomniac...' })
  overview!: string;

  @ApiProperty({ example: false })
  video!: boolean;

  @ApiProperty({ example: 8.433 })
  voteAverage!: number;

  @ApiProperty({ example: 26280 })
  voteCount!: number;

  @ApiProperty({
    example: [
      {
        id: 8,
        name: 'Netflix',
        logoPath: 'https://image.tmdb.org/t/p/w500/abc123.jpg',
      },
    ],
    required: false,
  })
  watchProviders?: MovieWatchProvider[];

  @ApiProperty({ example: false, required: false })
  isWatched?: boolean;

  @ApiProperty({ example: true, required: false })
  isInWatchlist?: boolean;

  @ApiProperty({ example: 2, required: false })
  watchlistMemberCount?: number;
}

/**
 * DTO pour les genres (utilisé pour `GET /movies/genres`)
 * Implements MovieGenre from @swipe-movie/types
 */
export class MoviesGenresDto implements MovieGenre {
  @ApiProperty({ example: 18 })
  id!: number;

  @ApiProperty({ example: 'Drama' })
  name!: string;
}

/**
 * DTO détaillé (hérite de MovieBasicDto)
 * Implements MovieDetails from @swipe-movie/types
 */
export class MovieDetailsDto extends MovieBasicDto implements MovieDetails {
  @ApiProperty({ example: 63000000 })
  budget!: number;

  @ApiProperty({ example: 100853753 })
  revenue!: number;

  @ApiProperty({ example: 139 })
  runtime!: number;

  @ApiProperty({ example: 'Released' })
  status!: string;

  @ApiProperty({ example: 'Mischief. Mayhem. Soap.' })
  tagline!: string;

  @ApiProperty({ example: 'http://www.foxmovies.com/movies/fight-club' })
  homepage!: string;

  @ApiProperty({ example: 'tt0137523' })
  imdbId!: string;

  @ApiProperty({
    example: [
      { id: 18, name: 'Drama' },
      { id: 53, name: 'Thriller' },
    ],
  })
  genres!: MovieGenre[];

  @ApiProperty({
    example: [
      { id: 508, name: 'Regency Enterprises', origin_country: 'US' },
      { id: 25, name: '20th Century Fox', origin_country: 'US' },
    ],
  })
  productionCompanies!: ProductionCompany[];

  @ApiProperty({
    example: [{ iso_3166_1: 'US', name: 'United States of America' }],
  })
  productionCountries!: ProductionCountry[];

  @ApiProperty({
    example: [{ iso_639_1: 'en', english_name: 'English', name: 'English' }],
  })
  spokenLanguages!: SpokenLanguage[];

  @ApiProperty({
    example: [
      {
        id: '533ec654c3a36854480003eb',
        key: 'SUXWAEX2jlg',
        name: 'Official Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
    ],
    required: false,
  })
  videos?: MovieVideo[];

  @ApiProperty({
    example: [
      {
        id: 819,
        name: 'Edward Norton',
        character: 'The Narrator',
        profilePath: '/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',
      },
    ],
    required: false,
  })
  cast?: MovieCast[];

  @ApiProperty({
    example: [
      {
        id: 7467,
        name: 'David Fincher',
        job: 'Director',
        department: 'Directing',
      },
    ],
    required: false,
  })
  crew?: MovieCrew[];
}
