import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class LeaveRoomDto {
  @ApiProperty({
    description: 'The unique identifier of the room to leave',
    example: '123456789',
  })
  @IsString()
  @MaxLength(50)
  roomId!: string;
}
