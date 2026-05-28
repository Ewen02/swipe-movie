import { IsString, IsOptional, Matches } from 'class-validator';

// Prisma cuid IDs are 24-32 lowercase alphanumeric characters; we constrain
// the format here so trash input gets rejected at the validation pipe rather
// than reaching the DB. Optional because the canonical source of guestId is
// now the signed X-Trial-Token header — body guestId is a legacy fallback.
export class MigrateTrialDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]{20,40}$/, { message: 'guestId must be a valid cuid' })
  guestId?: string;
}
