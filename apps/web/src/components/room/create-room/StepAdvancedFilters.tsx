"use client"

import { Badge } from "@swipe-movie/ui"

const CURRENT_YEAR = new Date().getFullYear()

const DECADES = [
  { label: "2020s", min: 2020, max: CURRENT_YEAR },
  { label: "2010s", min: 2010, max: 2019 },
  { label: "2000s", min: 2000, max: 2009 },
  { label: "1990s", min: 1990, max: 1999 },
  { label: "1980s", min: 1980, max: 1989 },
]

const DURATIONS = [
  { label: "Court", subtitle: "< 90 min", min: 0, max: 90 },
  { label: "Standard", subtitle: "90-130 min", min: 90, max: 130 },
  { label: "Long", subtitle: "> 130 min", min: 130, max: 999 },
]

const LANGUAGES = [
  { code: "fr", label: "Francais", flag: "FR" },
  { code: "en", label: "English", flag: "US" },
  { code: "es", label: "Espanol", flag: "ES" },
  { code: "ja", label: "Japonais", flag: "JP" },
  { code: "ko", label: "Coreen", flag: "KR" },
]

interface StepAdvancedFiltersProps {
  releaseYearMin?: number
  releaseYearMax?: number
  runtimeMin?: number
  runtimeMax?: number
  originalLanguage?: string
  onReleaseYearChange: (min?: number, max?: number) => void
  onRuntimeChange: (min?: number, max?: number) => void
  onLanguageChange: (lang?: string) => void
}

export function StepAdvancedFilters({
  releaseYearMin,
  releaseYearMax,
  runtimeMin,
  runtimeMax,
  originalLanguage,
  onReleaseYearChange,
  onRuntimeChange,
  onLanguageChange,
}: StepAdvancedFiltersProps) {
  const isDecadeSelected = (decade: (typeof DECADES)[0]) =>
    releaseYearMin === decade.min && releaseYearMax === decade.max

  const isDurationSelected = (duration: (typeof DURATIONS)[0]) =>
    runtimeMin === duration.min && runtimeMax === duration.max

  return (
    <div className="space-y-8">
      {/* Periode de sortie */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold mb-1">Periode de sortie</h3>
          <p className="text-sm text-muted-foreground">
            Filtrer par decennie (optionnel)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!releaseYearMin ? "default" : "outline"}
            className="cursor-pointer hover:opacity-80 transition-all px-4 py-2"
            onClick={() => onReleaseYearChange(undefined, undefined)}
          >
            Toutes
          </Badge>
          {DECADES.map((decade) => (
            <Badge
              key={decade.label}
              variant={isDecadeSelected(decade) ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-all px-4 py-2"
              onClick={() => onReleaseYearChange(decade.min, decade.max)}
            >
              {decade.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Duree */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold mb-1">Duree</h3>
          <p className="text-sm text-muted-foreground">
            Filtrer par duree du contenu (optionnel)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!runtimeMin ? "default" : "outline"}
            className="cursor-pointer hover:opacity-80 transition-all px-4 py-2"
            onClick={() => onRuntimeChange(undefined, undefined)}
          >
            Toutes
          </Badge>
          {DURATIONS.map((duration) => (
            <Badge
              key={duration.label}
              variant={isDurationSelected(duration) ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-all px-4 py-2"
              onClick={() => onRuntimeChange(duration.min, duration.max)}
            >
              <span>{duration.label}</span>
              <span className="ml-1 text-xs opacity-70">{duration.subtitle}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Langue originale */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold mb-1">Langue originale</h3>
          <p className="text-sm text-muted-foreground">
            Filtrer par langue de production (optionnel)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!originalLanguage ? "default" : "outline"}
            className="cursor-pointer hover:opacity-80 transition-all px-4 py-2"
            onClick={() => onLanguageChange(undefined)}
          >
            Toutes
          </Badge>
          {LANGUAGES.map((lang) => (
            <Badge
              key={lang.code}
              variant={originalLanguage === lang.code ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-all px-4 py-2"
              onClick={() => onLanguageChange(lang.code)}
            >
              {lang.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
