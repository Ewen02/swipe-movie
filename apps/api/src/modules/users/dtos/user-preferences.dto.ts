import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserPreferencesDto {
  @ApiProperty({ example: [8, 119, 337], description: 'Array of watch provider IDs' })
  @IsArray()
  @IsInt({ each: true })
  watchProviders!: number[];

  @ApiProperty({ example: 'FR', description: 'Watch region ISO code' })
  @IsString()
  watchRegion!: string;

  @ApiProperty({ example: [28, 12, 35], description: 'Array of favorite genre IDs' })
  @IsArray()
  @IsInt({ each: true })
  favoriteGenreIds!: number[];

  @ApiProperty({ example: 4, description: 'Onboarding step (0-4)' })
  @IsInt()
  @Min(0)
  @Max(4)
  onboardingStep!: number;

  @ApiProperty({ example: false, description: 'Whether onboarding is completed' })
  @IsBoolean()
  onboardingCompleted!: boolean;
}

export class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ example: [8, 119, 337], description: 'Array of watch provider IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  watchProviders?: number[];

  @ApiPropertyOptional({ example: 'FR', description: 'Watch region ISO code' })
  @IsOptional()
  @IsString()
  watchRegion?: string;

  @ApiPropertyOptional({ example: [28, 12, 35], description: 'Array of favorite genre IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  favoriteGenreIds?: number[];

  @ApiPropertyOptional({ example: 2, description: 'Onboarding step (0-4)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  @Type(() => Number)
  onboardingStep?: number;

  @ApiPropertyOptional({ example: true, description: 'Whether onboarding is completed' })
  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;
}

export class OnboardingSwipeDto {
  @ApiProperty({ example: '123456', description: 'TMDB movie ID' })
  @IsString()
  tmdbId!: string;

  @ApiProperty({ example: 'movie', description: 'Media type' })
  @IsString()
  mediaType!: string;

  @ApiProperty({ example: true, description: 'Whether the user liked the movie' })
  @IsBoolean()
  liked!: boolean;

  @ApiPropertyOptional({ example: 'onboarding', description: 'Source of the swipe (onboarding, discover, manual)' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class BatchOnboardingSwipeDto {
  @ApiProperty({ type: [OnboardingSwipeDto], description: 'Array of swipes' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingSwipeDto)
  swipes!: OnboardingSwipeDto[];
}
