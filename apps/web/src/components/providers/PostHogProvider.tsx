"use client"

import { useEffect, useRef, useState } from "react"
import posthog from "posthog-js"
import { authClient } from "@/lib/auth-client"

const COOKIE_CONSENT_KEY = "cookie-consent"
const POSTHOG_IDENTIFIED_KEY = "posthog-user-identified"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function PostHogProvider() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const initialized = useRef(false)

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

  // Check consent
  useEffect(() => {
    if (!posthogKey) return

    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (consent) {
        try {
          const preferences: CookiePreferences = JSON.parse(consent)
          setAnalyticsEnabled(preferences.analytics === true)
        } catch {
          setAnalyticsEnabled(false)
        }
      }
    }

    checkConsent()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) checkConsent()
    }
    const handleConsentChange = () => checkConsent()

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cookie-consent-changed", handleConsentChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cookie-consent-changed", handleConsentChange)
    }
  }, [posthogKey])

  // Init/toggle PostHog
  useEffect(() => {
    if (!posthogKey || !posthogHost) return

    if (analyticsEnabled) {
      if (!initialized.current) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: true,
          capture_pageleave: true,
          capture_performance: true,
          autocapture: false,
          persistence: "localStorage+cookie",
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") {
              ph.debug()
            }
          },
        })
        initialized.current = true
      } else {
        posthog.opt_in_capturing()
      }
    } else if (initialized.current) {
      posthog.opt_out_capturing()
    }
  }, [analyticsEnabled, posthogKey, posthogHost])

  // Identify user
  useEffect(() => {
    if (!analyticsEnabled || !initialized.current) return

    const identifyUser = async () => {
      try {
        const session = await authClient.getSession()
        if (session?.data?.user) {
          const user = session.data.user
          const alreadyIdentified = localStorage.getItem(POSTHOG_IDENTIFIED_KEY)

          posthog.identify(user.id, {
            email: user.email,
            name: user.name,
          })

          if (!alreadyIdentified) {
            posthog.capture("user_signed_up")
            localStorage.setItem(POSTHOG_IDENTIFIED_KEY, "true")
          }
        }
      } catch {
        // PostHog may fail silently if blocked by CSP or network issues
      }
    }

    identifyUser()
  }, [analyticsEnabled])

  return null
}

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(event, properties)
  }
}
