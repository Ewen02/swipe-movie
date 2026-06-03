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

          // Stable super-properties attached to every subsequent event, so we
          // can break any funnel down by surface (installed PWA vs browser tab)
          // and UI language without re-sending them per event.
          const isStandalone =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(display-mode: standalone)').matches;
          posthog.register({
            platform: 'web',
            is_pwa: Boolean(isStandalone),
            app_locale: document.documentElement.lang || undefined,
          });

          posthog.identify(user.id, {
            email: user.email,
            name: user.name,
            // A guest-promoted account still carries trial data at first
            // identify; lets us segment trial-origin users on the person.
            is_trial_origin: Boolean(getTrialData()),
          });

          if (!alreadyIdentified) {
            // signup_completed is the reliable signup signal — gated to once per
            // account by POSTHOG_IDENTIFIED_KEY, and it captures the acquisition
            // path: a fresh account with trial data still in localStorage came
            // through /try, otherwise it's a direct signup. (We dropped the old
            // user_signed_up, which fired on every new device and only
            // duplicated this without the localStorage guard.)
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

/**
 * Associate the current person with a PostHog group (e.g. a room or a crew),
 * so events can be aggregated and funneled at the group level — "how many
 * rooms reach a match" rather than "how many users". Cheap and idempotent;
 * call it whenever the user enters a group's context.
 */
export function captureGroup(
  groupType: string,
  groupKey: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.group(groupType, groupKey, properties);
  }
}

export { ANALYTICS_EVENTS };
