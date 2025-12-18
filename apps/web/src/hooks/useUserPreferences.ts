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
      // Keep data fresh for 5 minutes
      dedupingInterval: 5 * 60 * 1000,
      // Revalidate when user focuses the window
      revalidateOnFocus: true,
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
