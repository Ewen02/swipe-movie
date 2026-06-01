import { IsEmail, IsOptional } from 'class-validator';

export class TestEmailDto {
  /** Recipient. Defaults to the calling admin's own email if omitted. */
  @IsOptional()
  @IsEmail()
  to?: string;
}
