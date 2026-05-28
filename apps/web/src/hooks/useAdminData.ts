'use client';

import useSWR from 'swr';
import {
  getAdminStats,
  getAdminRetention,
  getAdminUsers,
  getAdminActivity,
  getAdminConversions,
  getAdminSubscriptions,
  getAdminTopMatches,
  getAdminTrialStats,
  getAdminEngagement,
  getAdminViral,
  getAdminContent,
  getAdminRevenue,
  getAdminPerformance,
  getHealthCheck,
  type AdminStats,
  type AdminUsersFilter,
  type RetentionData,
  type AdminUsersResponse,
  type DailyActivityData,
  type ConversionStats,
  type SubscriptionStats,
  type TopMatchesData,
  type TrialStats,
  type EngagementStats,
  type ViralStats,
  type ContentStats,
  type RevenueStats,
  type PerformanceStats,
  type HealthCheckData,
} from '@/lib/api/admin';

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR<AdminStats>(
    '/api/admin/stats',
    () => getAdminStats(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { stats: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminRetention() {
  const { data, error, isLoading, mutate } = useSWR<RetentionData>(
    '/api/admin/retention',
    () => getAdminRetention(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { retention: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminUsers(page: number, filter: AdminUsersFilter = 'users') {
  const { data, error, isLoading, mutate } = useSWR<AdminUsersResponse>(
    ['/api/admin/users', page, filter],
    () => getAdminUsers(page, 20, filter),
    { dedupingInterval: 30 * 1000 },
  );
  return { users: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminTrialStats() {
  const { data, error, isLoading, mutate } = useSWR<TrialStats>(
    '/api/admin/trial-stats',
    () => getAdminTrialStats(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { trialStats: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminActivity(days: number) {
  const { data, error, isLoading, mutate } = useSWR<DailyActivityData>(
    ['/api/admin/activity', days],
    () => getAdminActivity(days),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { activity: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminConversions() {
  const { data, error, isLoading, mutate } = useSWR<ConversionStats>(
    '/api/admin/conversions',
    () => getAdminConversions(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { conversions: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminSubscriptions() {
  const { data, error, isLoading, mutate } = useSWR<SubscriptionStats>(
    '/api/admin/subscriptions',
    () => getAdminSubscriptions(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { subscriptions: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminTopMatches() {
  const { data, error, isLoading, mutate } = useSWR<TopMatchesData>(
    '/api/admin/top-matches',
    () => getAdminTopMatches(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { topMatches: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminEngagement() {
  const { data, error, isLoading, mutate } = useSWR<EngagementStats>(
    '/api/admin/engagement',
    () => getAdminEngagement(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { engagement: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminViral() {
  const { data, error, isLoading, mutate } = useSWR<ViralStats>(
    '/api/admin/viral',
    () => getAdminViral(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { viral: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminContent() {
  const { data, error, isLoading, mutate } = useSWR<ContentStats>(
    '/api/admin/content',
    () => getAdminContent(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { content: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminRevenue() {
  const { data, error, isLoading, mutate } = useSWR<RevenueStats>(
    '/api/admin/revenue',
    () => getAdminRevenue(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false },
  );
  return { revenue: data, isLoading, error, refresh: () => mutate() };
}

export function useAdminPerformance() {
  const { data, error, isLoading, mutate } = useSWR<PerformanceStats>(
    '/api/admin/performance',
    () => getAdminPerformance(),
    { dedupingInterval: 30 * 1000, revalidateOnFocus: false },
  );
  return { performance: data, isLoading, error, refresh: () => mutate() };
}

export function useHealthCheck() {
  const { data, error, isLoading, mutate } = useSWR<HealthCheckData>(
    '/api/health',
    () => getHealthCheck(),
    { dedupingInterval: 30 * 1000, refreshInterval: 60 * 1000 },
  );
  return { health: data, isLoading, error, refresh: () => mutate() };
}
