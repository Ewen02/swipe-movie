"use client"

import { Badge } from "@swipe-movie/ui"
import { Film, Tv, Monitor, Star, Calendar, Clock, Languages, Info } from "lucide-react"
import type { MovieGenre, MovieWatchProvider } from "@/schemas/movies"
import Image from "next/image"

interface StepConfirmationProps {
  type: "movie" | "tv"
  name?: string
  genreId?: number
  minRating: number
  releaseYearMin?: number
  releaseYearMax?: number
  runtimeMin?: number
  runtimeMax?: number
  originalLanguage?: string
  watchProviders: number[]
  genres: MovieGenre[]
  providers: MovieWatchProvider[]
}

const LANGUAGES: Record<string, string> = {
  fr: "Francais",
  en: "English",
  es: "Espanol",
  ja: "Japonais",
  ko: "Coreen",
}

export function StepConfirmation({
  type,
  name,
  genreId,
  minRating,
  releaseYearMin,
  releaseYearMax,
  runtimeMin,
  runtimeMax,
  originalLanguage,
  watchProviders,
  genres,
  providers,
}: StepConfirmationProps) {
  const genreName = genres.find((g) => g.id === genreId)?.name
  const selectedProviders = providers.filter((p) => watchProviders.includes(p.id))

  const formatRuntime = () => {
    if (!runtimeMin && !runtimeMax) return null
    if (runtimeMax && runtimeMax < 100) return "Court (< 90 min)"
    if (runtimeMin && runtimeMin >= 130) return "Long (> 130 min)"
    return "Standard (90-130 min)"
  }

  const formatPeriod = () => {
    if (!releaseYearMin || !releaseYearMax) return null
    if (releaseYearMin >= 2020) return "Annees 2020"
    if (releaseYearMin >= 2010) return "Annees 2010"
    if (releaseYearMin >= 2000) return "Annees 2000"
    if (releaseYearMin >= 1990) return "Annees 1990"
    return "Annees 1980"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
            type === "movie"
              ? "bg-gradient-to-br from-primary to-blue-500"
              : "bg-gradient-to-br from-accent to-purple-500"
          }`}
        >
          {type === "movie" ? (
            <Film className="w-8 h-8 text-white" />
          ) : (
            <Tv className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold">
          Room de {type === "movie" ? "Films" : "Series"}
        </h3>
        {name && <p className="text-muted-foreground">"{name}"</p>}
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-background/80 to-background/60 border rounded-xl p-5 space-y-4">
        {/* Providers */}
        {selectedProviders.length > 0 && (
          <div className="flex items-start gap-3">
            <Monitor className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Plateformes</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProviders.map((provider) => (
                  <Badge key={provider.id} variant="secondary" className="pl-1 pr-2 py-1">
                    {provider.logoPath && (
                      <div className="relative w-4 h-4 rounded overflow-hidden mr-1">
                        <Image
                          src={provider.logoPath}
                          alt={provider.name}
                          fill
                          sizes="16px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs">{provider.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Genre */}
        {genreName && (
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Genre</p>
              <p className="text-sm text-muted-foreground">{genreName}</p>
            </div>
          </div>
        )}

        {/* Rating */}
        {minRating > 0 && (
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Note minimum</p>
              <p className="text-sm text-muted-foreground">{minRating.toFixed(1)}+</p>
            </div>
          </div>
        )}

        {/* Period */}
        {formatPeriod() && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Periode</p>
              <p className="text-sm text-muted-foreground">{formatPeriod()}</p>
            </div>
          </div>
        )}

        {/* Runtime */}
        {formatRuntime() && (
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Duree</p>
              <p className="text-sm text-muted-foreground">{formatRuntime()}</p>
            </div>
          </div>
        )}

        {/* Language */}
        {originalLanguage && (
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Langue originale</p>
              <p className="text-sm text-muted-foreground">
                {LANGUAGES[originalLanguage] || originalLanguage}
              </p>
            </div>
          </div>
        )}

        {/* Default message if no filters */}
        {!genreName &&
          minRating === 0 &&
          !formatPeriod() &&
          !formatRuntime() &&
          !originalLanguage &&
          selectedProviders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun filtre specifique - tous les contenus seront proposes
            </p>
          )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>Vous pourrez modifier ces filtres a tout moment depuis la room.</p>
      </div>
    </div>
  )
}
