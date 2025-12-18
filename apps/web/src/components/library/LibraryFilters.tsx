"use client"

import { cn } from "@/lib/utils"
import { useLibraryStats } from "@/hooks/useUserLibrary"

const STATUS_OPTIONS = [
  { value: undefined, label: "Tous", key: "total" },
  { value: "watched", label: "Vus", key: "watched" },
  { value: "watchlist", label: "A voir", key: "watchlist" },
  { value: "liked", label: "Likes", key: "liked" },
  { value: "disliked", label: "Pas aime", key: "disliked" },
  { value: "rated", label: "Notes", key: "rated" },
] as const

const SOURCE_OPTIONS = [
  { value: undefined, label: "Toutes", key: "total" },
  { value: "trakt", label: "Trakt", key: "trakt" },
  { value: "anilist", label: "AniList", key: "anilist" },
  { value: "onboarding", label: "Onboarding", key: "onboarding" },
  { value: "manual", label: "Manuel", key: "manual" },
  { value: "discover", label: "Discover", key: "discover" },
] as const

interface LibraryFiltersProps {
  status?: string
  source?: string
  onStatusChange: (status: string | undefined) => void
  onSourceChange: (source: string | undefined) => void
}

export function LibraryFilters({
  status,
  source,
  onStatusChange,
  onSourceChange,
}: LibraryFiltersProps) {
  const { total, byStatus, bySource } = useLibraryStats()

  const getStatusCount = (key: string) => {
    if (key === "total") return total
    return byStatus[key] || 0
  }

  const getSourceCount = (key: string) => {
    if (key === "total") return total
    return bySource[key] || 0
  }

  return (
    <div className="space-y-4">
      {/* Status filters */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Statut</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const count = getStatusCount(option.key)
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onStatusChange(option.value)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-all",
                  status === option.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 border-border hover:border-primary/50 hover:bg-accent/10"
                )}
              >
                {option.label}
                {count > 0 && (
                  <span className={cn(
                    "ml-1.5 text-xs",
                    status === option.value
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Source filters */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Source</p>
        <div className="flex flex-wrap gap-2">
          {SOURCE_OPTIONS.map((option) => {
            const count = getSourceCount(option.key)
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onSourceChange(option.value)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-all",
                  source === option.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 border-border hover:border-primary/50 hover:bg-accent/10"
                )}
              >
                {option.label}
                {count > 0 && (
                  <span className={cn(
                    "ml-1.5 text-xs",
                    source === option.value
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
