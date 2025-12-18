import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class LibraryItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tmdbId!: string;

  @ApiProperty({ enum: ['movie', 'tv'] })
  mediaType!: 'movie' | 'tv';

  @ApiProperty({ enum: ['watched', 'watchlist', 'rated', 'liked', 'disliked'] })
  status!: string;

  @ApiProperty({ enum: ['trakt', 'anilist', 'manual', 'onboarding', 'discover'] })
  source!: string;

  @ApiPropertyOptional()
  rating?: number;

  @ApiProperty()
  importedAt!: Date;
}

export class LibraryResponseDto {
  @ApiProperty({ type: [LibraryItemDto] })
  items!: LibraryItemDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  totalPages!: number;
}

export class UpdateLibraryItemDto {
  @ApiProperty({ enum: ['watched', 'watchlist', 'liked', 'disliked'] })
  @IsEnum(['watched', 'watchlist', 'liked', 'disliked'])
  status!: 'watched' | 'watchlist' | 'liked' | 'disliked';
}

export class LibraryQueryDto {
  @ApiPropertyOptional({ enum: ['watched', 'watchlist', 'rated', 'liked', 'disliked'] })
  @IsOptional()
  @IsEnum(['watched', 'watchlist', 'rated', 'liked', 'disliked'])
  status?: string;

  @ApiPropertyOptional({ enum: ['trakt', 'anilist', 'manual', 'onboarding', 'discover'] })
  @IsOptional()
  @IsEnum(['trakt', 'anilist', 'manual', 'onboarding', 'discover'])
  source?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number;
}

export class LibraryStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty({ example: { watched: 10, watchlist: 5, liked: 20, disliked: 3, rated: 2 } })
  byStatus!: Record<string, number>;

  @ApiProperty({ example: { trakt: 15, anilist: 5, manual: 3, onboarding: 10, discover: 7 } })
  bySource!: Record<string, number>;
}
