import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dtos';
import { IsString, IsDate } from 'class-validator';

export class RoomBaseResponseDto {
  @ApiProperty({ example: 'cku8z...' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'My Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'X1Y2Z3' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'user-123' })
  @IsString()
  createdBy: string;

  @ApiProperty({ example: '2025-09-04T10:15:30Z' })
  @IsDate()
  createdAt: Date;
}

export class RoomJoinResponseDto extends RoomBaseResponseDto {}
export class RoomCreateResponseDto extends RoomBaseResponseDto {}

export class RoomWithMembersResponseDto extends RoomBaseResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  members: UserResponseDto[];
}

export class RoomMembersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  members: UserResponseDto[];
}

export class MemberRoomsResponseDto {
  @ApiProperty({ type: [RoomBaseResponseDto] })
  rooms: RoomBaseResponseDto[];
}
