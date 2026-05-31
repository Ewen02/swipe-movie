'use client';

import { useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';
import { authClient } from '@/lib/auth-client';
import { ANALYTICS_EVENTS, type AnalyticsEvent } from '@/lib/analytics/events';
import { getTrialData } from '@/lib/trial';

const COOKIE_CONSENT_KEY = 'cookie-consent';
const POSTHOG_IDENTIFIED_KEY = 'posthog-user-identified';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function PostHogProvider() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const initialized = useRef(false);

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  // Check consent
  useEffect(() => {
    if (!posthogKey) return;

    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent) {
        try {
          const preferences: CookiePreferences = JSON.parse(consent);
          setAnalyticsEnabled(preferences.analytics === true);
        } catch {
          setAnalyticsEnabled(false);
        }
      }
    };

    checkConsent();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) checkConsent();
    };
    const handleConsentChange = () => checkConsent();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cookie-consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, [posthogKey]);

  // Init/toggle PostHog
  useEffect(() => {
    if (!posthogKey || !posthogHost) return;

    if (analyticsEnabled) {
      if (!initialized.current) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: true,
          capture_pageleave: true,
          capture_performance: true,
          autocapture: false,
          persistence: 'localStorage+cookie',
          loaded: (ph) => {
            if (process.env.NODE_ENV === 'development') {
              ph.debug();
            }
          },
        });
        initialized.current = true;
      } else {
        posthog.opt_in_capturing();
      }
    } else if (initialized.current) {
      posthog.opt_out_capturing();
    }
  }, [analyticsEnabled, posthogKey, posthogHost]);

  // Identify user
  useEffect(() => {
    if (!analyticsEnabled || !initialized.current) return;

    const identifyUser = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const user = session.data.user;
          const alreadyIdentified = localStorage.getItem(POSTHOG_IDENTIFIED_KEY);

          posthog.identify(user.id, {
            email: user.email,
            name: user.name,
          });

          if (!alreadyIdentified) {
            posthog.capture(ANALYTICS_EVENTS.USER_SIGNED_UP);
            // Distinguish the two acquisition paths: a fresh account created
            // with trial data still in localStorage came through the /try flow;
            // otherwise it's a direct signup from the landing/login. This is the
            // first identify on this device, so it's our best signup proxy.
            posthog.capture(ANALYTICS_EVENTS.SIGNUP_COMPLETED, {
              source: getTrialData() ? 'trial' : 'direct',
            });
            localStorage.setItem(POSTHOG_IDENTIFIED_KEY, 'true');
          }
        }
      } catch {
        // PostHog may fail silently if blocked by CSP or network issues
      }
    };

    identifyUser();
  }, [analyticsEnabled]);

  return null;
}

/**
 * Emit a PostHog event. Prefer an `ANALYTICS_EVENTS.*` value so the name is
 * type-checked and grep-able; a raw string is still accepted to avoid breaking
 * existing call sites, but new code should use the registry.
 */
export function captureEvent(
  event: AnalyticsEvent | (string & {}),
  properties?: Record<string, unknown>,
) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(event, properties);
  }
}

export { ANALYTICS_EVENTS };
