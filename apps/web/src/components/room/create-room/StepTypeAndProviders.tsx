"use client"

import { useState, useEffect } from "react"
import { Badge } from "@swipe-movie/ui"
import { Film, Tv, Loader2, X } from "lucide-react"
import { getAllWatchProviders } from "@/lib/api/movies"
import type { MovieWatchProvider } from "@/schemas/movies"
import Image from "next/image"

interface StepTypeAndProvidersProps {
  type: "movie" | "tv"
  watchProviders: number[]
  onTypeChange: (type: "movie" | "tv") => void
  onProvidersChange: (providers: number[]) => void
}

export function StepTypeAndProviders({
  type,
  watchProviders,
  onTypeChange,
  onProvidersChange,
}: StepTypeAndProvidersProps) {
  const [providers, setProviders] = useState<MovieWatchProvider[]>([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [providersError, setProvidersError] = useState<string | null>(null)
  const [showAllProviders, setShowAllProviders] = useState(false)

  useEffect(() => {
    async function loadProviders() {
      try {
        setLoadingProviders(true)
        setProvidersError(null)
        const data = await getAllWatchProviders("FR")
        setProviders(data)
      } catch (error) {
        console.error("Failed to load watch providers:", error)
        setProvidersError("Impossible de charger les plateformes")
        setProviders([])
      } finally {
        setLoadingProviders(false)
      }
    }
    loadProviders()
  }, [])

  const displayedProviders = showAllProviders ? providers : providers.slice(0, 12)

  const toggleProvider = (providerId: number) => {
    const newProviders = watchProviders.includes(providerId)
      ? watchProviders.filter((id) => id !== providerId)
      : [...watchProviders, providerId]
    onProvidersChange(newProviders)
  }

  return (
    <div className="space-y-8">
      {/* Type de contenu */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Quel type de contenu ?</h3>
          <p className="text-sm text-muted-foreground">
            Choisissez entre films ou series TV
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onTypeChange("movie")}
            className={`group p-5 rounded-xl border-2 transition-all ${
              type === "movie"
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/50 hover:bg-accent/5"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  type === "movie"
                    ? "bg-primary text-white"
                    : "bg-muted group-hover:bg-primary/10"
                }`}
              >
                <Film className="w-6 h-6" />
              </div>
              <div className="font-semibold">Films</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange("tv")}
            className={`group p-5 rounded-xl border-2 transition-all ${
              type === "tv"
                ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                : "border-border hover:border-accent/50 hover:bg-accent/5"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  type === "tv"
                    ? "bg-accent text-white"
                    : "bg-muted group-hover:bg-accent/10"
                }`}
              >
                <Tv className="w-6 h-6" />
              </div>
              <div className="font-semibold">Series</div>
            </div>
          </button>
        </div>
      </div>

      {/* Plateformes de streaming */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Ou regardez-vous ?</h3>
          <p className="text-sm text-muted-foreground">
            Selectionnez vos plateformes de streaming (optionnel)
          </p>
        </div>

        {loadingProviders ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Chargement des plateformes...
          </div>
        ) : providersError ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm text-red-500 mb-2">{providersError}</p>
            <p className="text-xs">Vous pouvez continuer sans filtrer par plateforme</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {displayedProviders.map((provider) => {
                const isSelected = watchProviders.includes(provider.id)
                return (
                  <Badge
                    key={provider.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer hover:opacity-80 transition-all pl-1.5 pr-2.5 py-2 flex items-center gap-2 ${
                      isSelected ? "ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => toggleProvider(provider.id)}
                  >
                    {provider.logoPath && (
                      <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={provider.logoPath}
                          alt={provider.name}
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm">{provider.name}</span>
                    {isSelected && (
                      <X
                        className="ml-0.5 h-3.5 w-3.5 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleProvider(provider.id)
                        }}
                      />
                    )}
                  </Badge>
                )
              })}
            </div>

            {providers.length > 12 && (
              <button
                type="button"
                onClick={() => setShowAllProviders(!showAllProviders)}
                className="text-sm text-primary hover:underline"
              >
                {showAllProviders
                  ? "Afficher moins"
                  : `+ ${providers.length - 12} autres plateformes`}
              </button>
            )}

            {watchProviders.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {watchProviders.length} plateforme(s) selectionnee(s)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
