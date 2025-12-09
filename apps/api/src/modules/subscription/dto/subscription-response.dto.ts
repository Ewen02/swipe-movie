export class SubscriptionResponseDto {
  id!: string;
  userId!: string;
  plan!: string;
  status!: string;
  stripeCustomerId!: string | null;
  stripeSubscriptionId!: string | null;
  periodStart!: Date | null;
  periodEnd!: Date | null;
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
