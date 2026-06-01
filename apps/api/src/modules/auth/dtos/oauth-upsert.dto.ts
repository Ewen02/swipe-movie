import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const SUPPORTED_LOCALES = ['fr', 'en', 'es', 'de', 'it'] as const;

export class OauthUpsertDto {
  @ApiProperty({ example: 'richard@email.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Richard', description: 'User name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'fr',
    description: 'User locale captured at signup (drives email language)',
    enum: SUPPORTED_LOCALES,
  })
  @IsOptional()
  @IsIn(SUPPORTED_LOCALES)
  locale?: string;
}
