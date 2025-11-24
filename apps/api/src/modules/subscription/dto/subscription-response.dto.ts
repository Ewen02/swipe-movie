import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class SubscriptionResponseDto {
  id!: string;
  userId!: string;
  plan!: SubscriptionPlan;
  status!: SubscriptionStatus;
  stripeCustomerId!: string | null;
  stripeSubscriptionId!: string | null;
  stripePriceId!: string | null;
  stripeCurrentPeriodEnd!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export class FeatureLimitsDto {
  maxRooms!: number;
  maxParticipants!: number;
  maxSwipes!: number;
  roomExpiryDays!: number;
  hasAdvancedFilters!: boolean;
  hasEmailNotifications!: boolean;
  hasApiAccess!: boolean;
}
