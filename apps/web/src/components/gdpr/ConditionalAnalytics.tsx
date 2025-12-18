"use client"

import { useEffect, useState } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

const COOKIE_CONSENT_KEY = "cookie-consent"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    // Check localStorage for consent
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

    // Initial check
    checkConsent()

    // Listen for storage changes (in case consent is given in another tab or updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) {
        checkConsent()
      }
    }

    // Listen for custom event when consent is given in same tab
    const handleConsentChange = () => {
      checkConsent()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cookie-consent-changed", handleConsentChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cookie-consent-changed", handleConsentChange)
    }
  }, [])

  // Only render GoogleAnalytics if user has given consent
  if (!analyticsEnabled) {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}
