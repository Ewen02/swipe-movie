"use client"

import useSWR from "swr"
import {
  getAdminStats,
  getAdminRetention,
  getAdminUsers,
  getAdminActivity,
  getAdminConversions,
  getAdminSubscriptions,
  getAdminTopMatches,
  getHealthCheck,
  type AdminStats,
  type RetentionData,
  type AdminUsersResponse,
  type DailyActivityData,
  type ConversionStats,
  type SubscriptionStats,
  type TopMatchesData,
  type HealthCheckData,
} from "@/lib/api/admin"

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR<AdminStats>(
    "/api/admin/stats",
    () => getAdminStats(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false }
  )
  return { stats: data, isLoading, error, refresh: () => mutate() }
}

export function useAdminRetention() {
  const { data, error, isLoading, mutate } = useSWR<RetentionData>(
    "/api/admin/retention",
    () => getAdminRetention(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false }
  )
  return { retention: data, isLoading, error, refresh: () => mutate() }
}

export function useAdminUsers(page: number) {
  const { data, error, isLoading, mutate } = useSWR<AdminUsersResponse>(
    ["/api/admin/users", page],
    () => getAdminUsers(page),
    { dedupingInterval: 30 * 1000 }
  )
  return { users: data, isLoading, error, refresh: () => mutate() }
}

export function useAdminActivity(days: number) {
  const { data, error, isLoading, mutate } = useSWR<DailyActivityData>(
    ["/api/admin/activity", days],
    () => getAdminActivity(days),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false }
  )
  return { activity: data, isLoading, error, refresh: () => mutate() }
}

export function useAdminConversions() {
  const { data, error, isLoading, mutate } = useSWR<ConversionStats>(
    "/api/admin/conversions",
    () => getAdminConversions(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false }
  )
  return { conversions: data, isLoading, error, refresh: () => mutate() }
}

export function useAdminSubscriptions() {
  const { data, error, isLoading, mutate } = useSWR<SubscriptionStats>(
    "/api/admin/subscriptions",
    () => getAdminSubscriptions(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false }
  )
  return { subscriptions: data, isLoading, error, refresh: () => mutate() }
}

export function useAdminTopMatches() {
  const { data, error, isLoading, mutate } = useSWR<TopMatchesData>(
    "/api/admin/top-matches",
    () => getAdminTopMatches(),
    { dedupingInterval: 60 * 1000, revalidateOnFocus: false }
  )
  return { topMatches: data, isLoading, error, refresh: () => mutate() }
}

export function useHealthCheck() {
  const { data, error, isLoading, mutate } = useSWR<HealthCheckData>(
    "/api/health",
    () => getHealthCheck(),
    { dedupingInterval: 30 * 1000, refreshInterval: 60 * 1000 }
  )
  return { health: data, isLoading, error, refresh: () => mutate() }
}
