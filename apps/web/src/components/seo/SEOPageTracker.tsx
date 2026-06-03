"use client"

import { useEffect, useRef } from "react"
import { captureEvent } from "@/components/providers/PostHogProvider"

export type SEOPageType =
  | "film"
  | "serie"
  | "genre"
  | "plateforme"
  | "combo"
  | "contexte"
  | "comparatif"
  | "guide"
  | "hub"

export type SEOPageProps = {
  pageType: SEOPageType
  locale: string
  /** Film/serie: TMDb ID. Genre/plateforme: slug. Combo: provider/genre. */
  slug?: string
  /** Human-readable title shown on the page. */
  title?: string
  /** Genre slug when applicable (genre page, combo page). */
  genre?: string
  /** Provider slug when applicable (plateforme page, combo page). */
  provider?: string
  /** TMDb ID for film/serie pages. */
  tmdbId?: number
}

/**
 * Client component that fires a structured `seo_page_view` event
 * the first time the page renders. Works with PostHog (already initialized
 * in PostHogProvider) and pushes to the GA dataLayer if present.
 *
 * Placed once per SEO page, renders nothing.
 */
export function SEOPageTracker(props: SEOPageProps) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    const payload: Record<string, unknown> = {
      page_type: props.pageType,
      locale: props.locale,
      slug: props.slug,
      title: props.title,
      genre: props.genre,
      provider: props.provider,
      tmdb_id: props.tmdbId,
      referrer: document.referrer || undefined,
      is_organic: isOrganic(document.referrer),
    }

    captureEvent("seo_page_view", payload)

    if (typeof window !== "undefined" && "dataLayer" in window) {
      ;(window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
        event: "seo_page_view",
        ...payload,
      })
    }
  }, [props])

  return null
}

function isOrganic(referrer: string): boolean {
  if (!referrer) return false
  try {
    const host = new URL(referrer).hostname
    return (
      host.includes("google.") ||
      host.includes("bing.") ||
      host.includes("yahoo.") ||
      host.includes("duckduckgo.") ||
      host.includes("yandex.") ||
      host.includes("baidu.")
    )
  } catch {
    return false
  }
}
