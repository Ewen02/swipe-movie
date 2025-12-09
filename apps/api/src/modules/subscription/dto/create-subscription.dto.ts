import { IsString, IsIn, IsOptional } from 'class-validator';

const VALID_PLANS = ['free', 'starter', 'pro', 'team'] as const;

export class CreateSubscriptionDto {
  @IsString()
  userId!: string;

  @IsIn(VALID_PLANS)
  plan!: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;
}
