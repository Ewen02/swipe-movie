import { IsString, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsString()
  userId!: string;

  @IsEnum(SubscriptionPlan)
  plan!: SubscriptionPlan;

  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;
}
