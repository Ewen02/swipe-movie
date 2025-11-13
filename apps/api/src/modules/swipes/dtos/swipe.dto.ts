import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsBoolean } from 'class-validator';

export class SwipeBaseDto {
  @ApiProperty({ example: 'swipe-123' })
  @IsString()
  id!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  value!: boolean;

  @ApiProperty({ example: 'movie-1234567' })
  @IsString()
  movieId!: string;

  @ApiProperty({ example: 'room-123' })
  @IsString()
  roomId!: string;

  @ApiProperty({ example: 'user-123' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: '2025-09-04T10:15:30Z' })
  @IsDate()
  createdAt!: Date;
}
