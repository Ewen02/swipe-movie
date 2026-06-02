import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  IsNumber,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Create a persistent group, typically saved from an existing room so the group
 * inherits that room's members and filter preset. memberUserIds are the people
 * to seed the group with (the creator is always added automatically).
 */
export class CreateGroupDto {
  @ApiPropertyOptional({ example: 'Les coloc', description: 'Group name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'User ids to seed the group with (besides the creator)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  memberUserIds?: string[];

  @ApiPropertyOptional({
    description: 'Room id to copy the filter preset + members from',
  })
  @IsOptional()
  @IsString()
  fromRoomId?: string;

  // --- Filter preset (mirrors the room filters). All optional. ---
  @ApiPropertyOptional({ example: 'movie', enum: ['movie', 'tv'] })
  @IsOptional()
  @IsIn(['movie', 'tv'])
  type?: 'movie' | 'tv';

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsInt()
  genreId?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  releaseYearMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  releaseYearMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  runtimeMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  runtimeMax?: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  watchProviders?: number[];

  @ApiPropertyOptional({ example: 'FR' })
  @IsOptional()
  @IsString()
  watchRegion?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  originalLanguage?: string;
}
