import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  @IsString()
  @IsOptional()
  name: string | null;

  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  @IsOptional()
  email?: string;
}
