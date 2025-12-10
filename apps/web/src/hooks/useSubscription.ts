'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { GET } from '@/lib/api';
import {
  SubscriptionPlan,
  getFeatureLimits,
  type SubscriptionPlanType,
  type FeatureLimits,
} from '@swipe-movie/subscription';

export interface SubscriptionData {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsageStats {
  activeRooms: number;
  maxSwipesInRoom: number;
  maxParticipantsInRoom: number;
}

export interface UseSubscriptionResult {
  /** The subscription data from the API */
  subscription: SubscriptionData | null;
  /** The current plan (defaults to FREE if no subscription) */
  plan: SubscriptionPlanType;
  /** Feature limits based on the current plan */
  limits: FeatureLimits;
  /** Usage statistics */
  usage: UsageStats;
  /** Whether the subscription data is loading */
  loading: boolean;
  /** Any error that occurred while fetching */
  error: Error | null;
  /** Refetch the subscription data */
  refetch: () => Promise<void>;
  /** Check if a specific limit allows the action */
  checkLimit: (
    limitType: 'maxRooms' | 'maxParticipants' | 'maxSwipes',
    currentCount: number,
  ) => { allowed: boolean; limit: number };
  /** Check if user has access to a boolean feature */
  hasFeature: (feature: 'hasAdvancedFilters' | 'hasEmailNotifications' | 'hasApiAccess') => boolean;
  /** Whether user has a paid subscription */
  isPaid: boolean;
}

/**
 * Hook to manage subscription state and feature gating
 *
 * @example
 * ```tsx
 * const { plan, limits, checkLimit, loading } = useSubscription();
 *
 * // Check if user can create more rooms
 * const { allowed, limit } = checkLimit('maxRooms', currentRoomCount);
 * if (!allowed) {
 *   showUpgradeModal({ feature: 'rooms', currentLimit: limit });
 * }
 * ```
 */
const DEFAULT_USAGE: UsageStats = {
  activeRooms: 0,
  maxSwipesInRoom: 0,
  maxParticipantsInRoom: 0,
};

export function useSubscription(): UseSubscriptionResult {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageStats>(DEFAULT_USAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!session?.user) {
      setSubscription(null);
      setUsage(DEFAULT_USAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch subscription and usage in parallel
      const [subscriptionResponse, usageResponse] = await Promise.all([
        GET('/subscriptions/me'),
        GET('/subscriptions/me/usage'),
      ]);

      // Handle subscription response
      if (!subscriptionResponse.ok && subscriptionResponse.status !== 404) {
        throw new Error(`Failed to fetch subscription: ${subscriptionResponse.statusText}`);
      }

      const subscriptionText = await subscriptionResponse.text();
      if (subscriptionText) {
        setSubscription(JSON.parse(subscriptionText) as SubscriptionData);
      } else {
        setSubscription(null);
      }

      // Handle usage response
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsage(usageData as UsageStats);
      } else {
        setUsage(DEFAULT_USAGE);
      }
    } catch (err) {
      console.error('[useSubscription] Error fetching subscription:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setSubscription(null);
      setUsage(DEFAULT_USAGE);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  // Derive plan from subscription or default to FREE
  const plan = (subscription?.plan?.toLowerCase() as SubscriptionPlanType) || SubscriptionPlan.FREE;
  const limits = getFeatureLimits(plan);

  const checkLimit = useCallback(
    (
      limitType: 'maxRooms' | 'maxParticipants' | 'maxSwipes',
      currentCount: number,
    ): { allowed: boolean; limit: number } => {
      const limit = limits[limitType];

      // -1 means unlimited
      if (limit === -1) {
        return { allowed: true, limit: -1 };
      }

      return { allowed: currentCount < limit, limit };
    },
    [limits],
  );

  const hasFeature = useCallback(
    (feature: 'hasAdvancedFilters' | 'hasEmailNotifications' | 'hasApiAccess'): boolean => {
      return limits[feature];
    },
    [limits],
  );

  const isPaid = plan !== SubscriptionPlan.FREE;

  return {
    subscription,
    plan,
    limits,
    usage,
    loading,
    error,
    refetch: fetchSubscription,
    checkLimit,
    hasFeature,
    isPaid,
  };
}
