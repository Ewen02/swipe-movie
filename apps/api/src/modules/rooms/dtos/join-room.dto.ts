import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'Code of the room to join',
  })
  @IsString()
  @MaxLength(10)
  code!: string;

  /**
   * How the user arrived at the join — only the client knows this (direct vs an
   * invite link). Forwarded to the server-side room_joined event so we keep the
   * acquisition-channel dimension the client used to track.
   */
  @ApiPropertyOptional({
    example: 'invite_link',
    description: 'Acquisition source for analytics',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  source?: string;
}
