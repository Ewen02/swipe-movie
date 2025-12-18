"use client"

import { Button } from "@swipe-movie/ui"
import { Check, Loader2 } from "lucide-react"
import { useGenres } from "@/hooks/useGenres"
import { motion } from "framer-motion"

// Genre icons mapping
const GENRE_ICONS: Record<number, string> = {
  28: "💥", // Action
  12: "🏔️", // Adventure
  16: "🎨", // Animation
  35: "😂", // Comedy
  80: "🔪", // Crime
  99: "📹", // Documentary
  18: "🎭", // Drama
  10751: "👨‍👩‍👧‍👦", // Family
  14: "🧙", // Fantasy
  36: "📜", // History
  27: "👻", // Horror
  10402: "🎵", // Music
  9648: "🔍", // Mystery
  10749: "💕", // Romance
  878: "🚀", // Science Fiction
  10770: "📺", // TV Movie
  53: "😱", // Thriller
  10752: "⚔️", // War
  37: "🤠", // Western
}

interface StepGenresProps {
  selectedGenres: number[]
  onGenresChange: (genres: number[]) => void
  onNext: () => void
  onBack: () => void
}

export function StepGenres({
  selectedGenres,
  onGenresChange,
  onNext,
  onBack,
}: StepGenresProps) {
  const { genres, isLoading, error } = useGenres()

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      onGenresChange(selectedGenres.filter((id) => id !== genreId))
    } else if (selectedGenres.length < 5) {
      onGenresChange([...selectedGenres, genreId])
    }
  }

  const isValid = selectedGenres.length >= 3 && selectedGenres.length <= 5

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-3">
          Quels genres de films aimez-vous ?
        </h1>
        <p className="text-muted-foreground text-lg">
          Selectionnez 3 a 5 genres pour personnaliser vos recommandations
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Chargement des genres...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm text-red-500 mb-2">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm ${isValid ? "text-green-500" : "text-muted-foreground"}`}>
                {selectedGenres.length}/5 genres selectionnes
                {selectedGenres.length < 3 && " (minimum 3)"}
              </span>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.03 },
                },
              }}
            >
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id)
                const isDisabled = !isSelected && selectedGenres.length >= 5
                return (
                  <motion.button
                    key={genre.id}
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    disabled={isDisabled}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : isDisabled
                        ? "border-border opacity-50 cursor-not-allowed"
                        : "border-border hover:border-primary/50 hover:bg-accent/5"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">
                        {GENRE_ICONS[genre.id] || "🎬"}
                      </span>
                      <span className="text-sm font-medium text-center">
                        {genre.name}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Retour
          </Button>
          <Button
            size="lg"
            onClick={onNext}
            disabled={!isValid}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  )
}
