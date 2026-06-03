"use client"

import useSWR from "swr"
import {
  getUserPreferences,
  updateUserPreferences,
  saveOnboardingSwipes,
  completeOnboarding,
  UserPreferences,
  UpdateUserPreferencesDto,
  OnboardingSwipe,
} from "@/lib/api/users"

// SWR key for user preferences
export const USER_PREFERENCES_KEY = "/api/users/me/preferences"

// Fetcher function
const fetchUserPreferences = async (): Promise<UserPreferences | null> => {
  return getUserPreferences()
}

export function useUserPreferences() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<UserPreferences | null>(
    USER_PREFERENCES_KEY,
    fetchUserPreferences,
    {
      // Preferences (onboarding status, watch providers) change rarely and are
      // mutated in-place via update(), so on-focus revalidation just burns Vercel
      // requests on every tab switch across every protected page. Keep it off.
      dedupingInterval: 30 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  const update = async (dto: UpdateUserPreferencesDto): Promise<UserPreferences> => {
    const updated = await updateUserPreferences(dto)
    mutate(updated, false)
    return updated
  }

  const saveSwipes = async (swipes: OnboardingSwipe[]): Promise<{ saved: number }> => {
    return saveOnboardingSwipes(swipes)
  }

  const complete = async (): Promise<UserPreferences> => {
    const updated = await completeOnboarding()
    mutate(updated, false)
    return updated
  }

  return {
    preferences: data ?? null,
    isLoading,
    isValidating,
    error: error?.message ?? null,
    refresh: () => mutate(),
    update,
    saveSwipes,
    complete,
  }
}
