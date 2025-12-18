"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@swipe-movie/ui"
import { Loader2, Check, ChevronDown, ChevronUp } from "lucide-react"
import { getAllWatchProviders } from "@/lib/api/movies"
import type { MovieWatchProvider } from "@/schemas/movies"
import Image from "next/image"
import { motion } from "framer-motion"

// IDs des providers principaux en France (services de streaming)
const MAIN_PROVIDER_IDS = [
  8,    // Netflix
  119,  // Amazon Prime Video
  337,  // Disney+
  2,    // Apple TV
  531,  // Paramount+
  1899, // Max (HBO Max)
  381,  // Canal+
  283,  // Crunchyroll
  61,   // Orange VOD
  35,   // Rakuten TV
  192,  // YouTube Premium
  3,    // Google Play Movies
]

// Composant ProviderCard en dehors pour eviter les re-renders
function ProviderCard({
  provider,
  isSelected,
  onToggle,
}: {
  provider: MovieWatchProvider
  isSelected: boolean
  onToggle: (id: number) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(provider.id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/50 hover:bg-accent/5"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        {provider.logoPath && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={provider.logoPath}
              alt={provider.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        )}
        <span className="text-sm font-medium text-center line-clamp-1">
          {provider.name}
        </span>
      </div>
    </motion.button>
  )
}

interface StepProvidersProps {
  selectedProviders: number[]
  onProvidersChange: (providers: number[]) => void
  onNext: () => void
}

export function StepProviders({
  selectedProviders,
  onProvidersChange,
  onNext,
}: StepProvidersProps) {
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

  // Séparer les providers principaux et les autres
  const mainProviders = providers.filter((p) => MAIN_PROVIDER_IDS.includes(p.id))
  const otherProviders = providers.filter((p) => !MAIN_PROVIDER_IDS.includes(p.id))

  // Trier les providers principaux selon l'ordre défini
  const sortedMainProviders = mainProviders.sort(
    (a, b) => MAIN_PROVIDER_IDS.indexOf(a.id) - MAIN_PROVIDER_IDS.indexOf(b.id)
  )

  const toggleProvider = useCallback((providerId: number) => {
    const newProviders = selectedProviders.includes(providerId)
      ? selectedProviders.filter((id) => id !== providerId)
      : [...selectedProviders, providerId]
    onProvidersChange(newProviders)
  }, [selectedProviders, onProvidersChange])

  const clearAll = () => {
    onProvidersChange([])
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-3">
          Quelles plateformes avez-vous ?
        </h1>
        <p className="text-muted-foreground text-lg">
          On ne vous montrera que les films que vous pouvez regarder
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
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
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                {selectedProviders.length} plateforme(s) selectionnee(s)
              </span>
              {selectedProviders.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Effacer
                </Button>
              )}
            </div>

            {/* Providers principaux */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sortedMainProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  isSelected={selectedProviders.includes(provider.id)}
                  onToggle={toggleProvider}
                />
              ))}
            </div>

            {/* Bouton pour voir plus */}
            {otherProviders.length > 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAllProviders(!showAllProviders)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-xl hover:border-primary/50 transition-all"
                >
                  {showAllProviders ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Masquer les autres plateformes
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Voir {otherProviders.length} autres plateformes
                    </>
                  )}
                </button>

                {/* Autres providers */}
                {showAllProviders && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                    {otherProviders.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        isSelected={selectedProviders.includes(provider.id)}
                        onToggle={toggleProvider}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          size="lg"
          onClick={onNext}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          Continuer
          {selectedProviders.length > 0 && ` (${selectedProviders.length} selectionnees)`}
        </Button>
        <button
          type="button"
          onClick={onNext}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Passer cette etape
        </button>
      </div>
    </div>
  )
}
