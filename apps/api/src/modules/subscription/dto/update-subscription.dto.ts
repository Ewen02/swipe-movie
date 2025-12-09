import { IsIn, IsOptional, IsString } from 'class-validator';

const VALID_PLANS = ['free', 'starter', 'pro', 'team'] as const;
const VALID_STATUSES = ['active', 'canceled', 'past_due', 'trialing', 'incomplete'] as const;

export class UpdateSubscriptionDto {
  @IsIn(VALID_PLANS)
  @IsOptional()
  plan?: string;

  @IsIn(VALID_STATUSES)
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;
}
