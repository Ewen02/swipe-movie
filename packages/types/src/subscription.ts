// Subscription Plans
export const SubscriptionPlan = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  TEAM: 'team',
} as const;

export type SubscriptionPlanType = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

// Subscription Statuses
export const SubscriptionStatus = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
  INCOMPLETE: 'incomplete',
} as const;

export type SubscriptionStatusType = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

// Feature Limits per plan
export interface FeatureLimits {
  maxRooms: number; // -1 = unlimited
  maxParticipants: number;
  maxSwipes: number;
  roomExpiryDays: number; // -1 = no expiry
  hasAdvancedFilters: boolean;
  hasEmailNotifications: boolean;
  hasApiAccess: boolean;
}

// Subscription data shape
export interface SubscriptionData {
  id: string;
  plan: SubscriptionPlanType;
  status: SubscriptionStatusType;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}
