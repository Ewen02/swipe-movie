import { ApiProperty } from '@nestjs/swagger';

/**
 * 🔹 DTO de base pour les films (liste, résumé)
 */
export class MovieBasicDto {
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
}

/**
 * 🔹 DTO pour les genres (utilisé pour `GET /movies/genres`)
 */
export class MoviesGenresDto {
  @ApiProperty({ example: 18 })
  id!: number;

  @ApiProperty({ example: 'Drama' })
  name!: string;
}

/**
 * 🔹 DTO détaillé (hérite de MovieBasicDto)
 */
export class MovieDetailsDto extends MovieBasicDto {
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
  genres!: MoviesGenresDto[];

  @ApiProperty({
    example: [
      { id: 508, name: 'Regency Enterprises', origin_country: 'US' },
      { id: 25, name: '20th Century Fox', origin_country: 'US' },
    ],
  })
  productionCompanies!: {
    id: number;
    name: string;
    origin_country: string;
  }[];

  @ApiProperty({
    example: [{ iso_3166_1: 'US', name: 'United States of America' }],
  })
  productionCountries!: {
    iso_3166_1: string;
    name: string;
  }[];

  @ApiProperty({
    example: [{ iso_639_1: 'en', english_name: 'English', name: 'English' }],
  })
  spokenLanguages!: {
    iso_639_1: string;
    english_name: string;
    name: string;
  }[];
}
