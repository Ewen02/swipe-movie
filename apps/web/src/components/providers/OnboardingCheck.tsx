'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/useUserPreferences';

// Pages that don't require onboarding completion
const EXCLUDED_PATHS = ['/onboarding', '/auth'];

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { preferences, isLoading, isValidating } = useUserPreferences();

  useEffect(() => {
    // Skip if still loading the initial fetch.
    if (isLoading) return;

    // Skip while a revalidation is in flight — without this, a stale SWR
    // cache (e.g. the SSR fallback right after the trial migration flipped
    // onboardingCompleted in DB) would briefly redirect the user to
    // /onboarding before the fresh data arrives.
    if (isValidating) return;

    // Skip for excluded paths
    const isExcluded = EXCLUDED_PATHS.some((path) => pathname?.includes(path));
    if (isExcluded) return;

    // Redirect to onboarding if not completed
    if (preferences && !preferences.onboardingCompleted) {
      router.replace('/onboarding');
    }
  }, [preferences, isLoading, isValidating, pathname, router]);

  return <>{children}</>;
}
