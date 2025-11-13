import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateSwipeDto {
  @ApiProperty({
    example: true,
    description: 'Like or dislike movie',
  })
  @IsBoolean()
  value!: boolean;

  @ApiProperty({
    example: 'tt1234567',
    description: 'ID of the movie title',
  })
  @IsString()
  movieId!: string;

  @ApiProperty({
    example: 'room-123',
    description: 'ID of the room',
  })
  @IsString()
  roomId!: string;
}
