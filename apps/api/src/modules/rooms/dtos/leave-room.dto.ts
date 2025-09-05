import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LeaveRoomDto {
  @ApiProperty({
    description: 'The unique identifier of the room to leave',
    example: '123456789',
  })
  @IsString()
  roomId: string;
}
