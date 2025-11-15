import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
  Max,
  MaxLength as ValidatorMaxLength,
} from 'class-validator';
import { Sanitize } from '../../../common/decorators/sanitize.decorator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'movie',
    description: 'Type of the room (movie or tv)',
    enum: ['movie', 'tv'],
  })
  @IsString()
  @IsIn(['movie', 'tv'])
  type!: string;

  @ApiProperty({
    example: 28,
    description: 'Genre ID for TMDb movies or TV shows',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  genreId?: number;

  @ApiProperty({
    example: 'My Room',
    description:
      'Name of the room (optional, defaults to "Untitled Room" if not provided)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidatorMaxLength(100, { message: 'Room name must not exceed 100 characters' })
  @Sanitize() // Remove HTML tags and dangerous characters
  name?: string;

  // Advanced filters
  @ApiProperty({
    example: 7.0,
    description: 'Minimum rating (0-10)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiProperty({
    example: 2020,
    description: 'Minimum release year',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  releaseYearMin?: number;

  @ApiProperty({
    example: 2024,
    description: 'Maximum release year',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  releaseYearMax?: number;

  @ApiProperty({
    example: 60,
    description: 'Minimum runtime in minutes',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  runtimeMin?: number;

  @ApiProperty({
    example: 180,
    description: 'Maximum runtime in minutes',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  runtimeMax?: number;

  @ApiProperty({
    example: [8, 119, 337],
    description: 'Watch provider IDs (Netflix=8, Prime=119, Disney+=337)',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  watchProviders?: number[];

  @ApiProperty({
    example: 'FR',
    description: 'Watch region (ISO country code)',
    required: false,
  })
  @IsOptional()
  @IsString()
  watchRegion?: string;

  @ApiProperty({
    example: 'en',
    description: 'Original language (ISO 639-1 code)',
    required: false,
  })
  @IsOptional()
  @IsString()
  originalLanguage?: string;
}
