"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@swipe-movie/ui"
import { Cookie, Shield, X } from "lucide-react"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "cookie-consent"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const t = useTranslations("gdpr")
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Listen for manual open requests (from footer link)
  useEffect(() => {
    const handleOpenRequest = () => {
      setShowBanner(true)
      setShowDetails(true) // Show detailed view when manually opened
    }
    window.addEventListener("open-cookie-consent", handleOpenRequest)
    return () => window.removeEventListener("open-cookie-consent", handleOpenRequest)
  }, [])

  const handleAcceptAll = () => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(allPreferences)
  }

  const handleRejectNonEssential = () => {
    const minimalPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    saveConsent(minimalPreferences)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }))
    setShowBanner(false)

    // Dispatch event to notify other components (like ConditionalAnalytics)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cookie-consent-changed"))
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Accent bar */}
              <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />

              <div className="p-5 sm:p-6">
                {!showDetails ? (
                  // Simple view
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Cookie className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {t("banner.message")}{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          {t("banner.learnMore")}
                        </Link>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetails(true)}
                      >
                        {t("banner.customize")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRejectNonEssential}
                      >
                        {t("banner.rejectAll")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAcceptAll}
                      >
                        {t("banner.acceptAll")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Detailed view
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">{t("banner.preferencesTitle")}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowDetails(false)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Necessary cookies */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                        <div>
                          <p className="text-sm font-medium">{t("cookies.necessary.title")}</p>
                          <p className="text-xs text-muted-foreground">{t("cookies.necessary.description")}</p>
                        </div>
                        <div className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-500">
                          {t("cookies.required")}
                        </div>
                      </div>

                      {/* Analytics cookies */}
                      <label className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 cursor-pointer hover:bg-foreground/10 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{t("cookies.analytics.title")}</p>
                          <p className="text-xs text-muted-foreground">{t("cookies.analytics.description")}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                      </label>

                      {/* Marketing cookies */}
                      <label className="flex items-center justify-between p-3 rounded-lg bg-foreground/5 cursor-pointer hover:bg-foreground/10 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{t("cookies.marketing.title")}</p>
                          <p className="text-xs text-muted-foreground">{t("cookies.marketing.description")}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRejectNonEssential}
                      >
                        {t("banner.rejectAll")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSavePreferences}
                      >
                        {t("banner.savePreferences")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
