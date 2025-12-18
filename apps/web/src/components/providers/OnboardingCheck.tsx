"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUserPreferences } from "@/hooks/useUserPreferences"

// Pages that don't require onboarding completion
const EXCLUDED_PATHS = ["/onboarding", "/auth"]

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { preferences, isLoading } = useUserPreferences()

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return

    // Skip for excluded paths
    const isExcluded = EXCLUDED_PATHS.some((path) => pathname?.includes(path))
    if (isExcluded) return

    // Redirect to onboarding if not completed
    if (preferences && !preferences.onboardingCompleted) {
      router.replace("/onboarding")
    }
  }, [preferences, isLoading, pathname, router])

  return <>{children}</>
}
