import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dtos';
import { IsString, IsDate } from 'class-validator';

export class RoomBaseResponseDto {
  @ApiProperty({ example: 'cku8z...' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'My Room' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'X1Y2Z3' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 'MOVIE' })
  @IsString()
  type!: string;

  @ApiProperty({ example: 28 })
  genreId!: number | null;

  @ApiProperty({ example: 'user-123' })
  @IsString()
  createdBy!: string;

  @ApiProperty({ example: '2025-09-04T10:15:30Z' })
  @IsDate()
  createdAt!: Date;

  // Advanced filters
  @ApiProperty({ example: 7.0, required: false })
  minRating?: number | null;

  @ApiProperty({ example: 2020, required: false })
  releaseYearMin?: number | null;

  @ApiProperty({ example: 2024, required: false })
  releaseYearMax?: number | null;

  @ApiProperty({ example: 60, required: false })
  runtimeMin?: number | null;

  @ApiProperty({ example: 180, required: false })
  runtimeMax?: number | null;

  @ApiProperty({ example: [8, 119], required: false })
  watchProviders?: number[];

  @ApiProperty({ example: 'FR', required: false })
  watchRegion?: string | null;

  @ApiProperty({ example: 'en', required: false })
  originalLanguage?: string | null;
}

export class RoomJoinResponseDto extends RoomBaseResponseDto {}
export class RoomCreateResponseDto extends RoomBaseResponseDto {}

export class RoomWithMembersResponseDto extends RoomBaseResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  members!: UserResponseDto[];
}

export class RoomMembersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  members!: UserResponseDto[];
}

export class MemberRoomsResponseDto {
  @ApiProperty({ type: [RoomBaseResponseDto] })
  rooms!: RoomBaseResponseDto[];
}
