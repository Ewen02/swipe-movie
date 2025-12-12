"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@swipe-movie/ui"
import { Sparkles, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { StepIndicator } from "./StepIndicator"
import { StepTypeAndProviders } from "./StepTypeAndProviders"
import { StepPersonalization } from "./StepPersonalization"
import { StepAdvancedFilters } from "./StepAdvancedFilters"
import { StepConfirmation } from "./StepConfirmation"
import { CreateRoomValues } from "@/schemas/rooms"
import type { MovieGenre, MovieWatchProvider } from "@/schemas/movies"
import { getAllWatchProviders } from "@/lib/api/movies"

const STEPS = [
  { title: "Essentiel", description: "Type et plateformes" },
  { title: "Personnalisation", description: "Nom et preferences" },
  { title: "Filtres", description: "Options avancees" },
  { title: "Confirmation", description: "Verifier et creer" },
]

interface CreateRoomStepperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateRoomValues) => Promise<void>
  genres: MovieGenre[]
  loading: boolean
}

export function CreateRoomStepper({
  open,
  onOpenChange,
  onSubmit,
  genres,
  loading,
}: CreateRoomStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [providers, setProviders] = useState<MovieWatchProvider[]>([])

  // Form data
  const [type, setType] = useState<"movie" | "tv">("movie")
  const [watchProviders, setWatchProviders] = useState<number[]>([])
  const [name, setName] = useState("")
  const [genreId, setGenreId] = useState<number | undefined>()
  const [minRating, setMinRating] = useState(6.0)
  const [releaseYearMin, setReleaseYearMin] = useState<number | undefined>()
  const [releaseYearMax, setReleaseYearMax] = useState<number | undefined>()
  const [runtimeMin, setRuntimeMin] = useState<number | undefined>()
  const [runtimeMax, setRuntimeMax] = useState<number | undefined>()
  const [originalLanguage, setOriginalLanguage] = useState<string | undefined>()

  // Load providers for confirmation step
  useEffect(() => {
    async function loadProviders() {
      try {
        const data = await getAllWatchProviders("FR")
        setProviders(data)
      } catch (error) {
        console.error("Failed to load providers:", error)
      }
    }
    if (open) {
      loadProviders()
    }
  }, [open])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(0)
      setType("movie")
      setWatchProviders([])
      setName("")
      setGenreId(undefined)
      setMinRating(6.0)
      setReleaseYearMin(undefined)
      setReleaseYearMax(undefined)
      setRuntimeMin(undefined)
      setRuntimeMax(undefined)
      setOriginalLanguage(undefined)
    }
  }, [open])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const roomData: CreateRoomValues = {
      type,
      name: name || undefined,
      genreId,
      minRating: minRating > 0 ? minRating : undefined,
      releaseYearMin,
      releaseYearMax,
      runtimeMin,
      runtimeMax,
      watchProviders: watchProviders.length > 0 ? watchProviders : undefined,
      watchRegion: "FR",
      originalLanguage,
    }
    await onSubmit(roomData)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepTypeAndProviders
            type={type}
            watchProviders={watchProviders}
            onTypeChange={setType}
            onProvidersChange={setWatchProviders}
          />
        )
      case 1:
        return (
          <StepPersonalization
            name={name}
            genreId={genreId}
            minRating={minRating}
            genres={genres}
            onNameChange={setName}
            onGenreChange={setGenreId}
            onMinRatingChange={setMinRating}
          />
        )
      case 2:
        return (
          <StepAdvancedFilters
            releaseYearMin={releaseYearMin}
            releaseYearMax={releaseYearMax}
            runtimeMin={runtimeMin}
            runtimeMax={runtimeMax}
            originalLanguage={originalLanguage}
            onReleaseYearChange={(min, max) => {
              setReleaseYearMin(min)
              setReleaseYearMax(max)
            }}
            onRuntimeChange={(min, max) => {
              setRuntimeMin(min)
              setRuntimeMax(max)
            }}
            onLanguageChange={setOriginalLanguage}
          />
        )
      case 3:
        return (
          <StepConfirmation
            type={type}
            name={name}
            genreId={genreId}
            minRating={minRating}
            releaseYearMin={releaseYearMin}
            releaseYearMax={releaseYearMax}
            runtimeMin={runtimeMin}
            runtimeMax={runtimeMax}
            originalLanguage={originalLanguage}
            watchProviders={watchProviders}
            genres={genres}
            providers={providers}
          />
        )
      default:
        return null
    }
  }

  const isLastStep = currentStep === STEPS.length - 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-xl border border-white/10">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Creer une room</DialogTitle>
              <DialogDescription className="text-base">
                {STEPS[currentStep].description}
              </DialogDescription>
            </div>
          </div>

          {/* Step indicator */}
          <div className="pt-2">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={STEPS.length}
              labels={STEPS.map((s) => s.title)}
              onStepClick={(step) => {
                if (step < currentStep) setCurrentStep(step)
              }}
            />
          </div>
        </DialogHeader>

        {/* Step content with animation */}
        <div className="mt-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Precedent
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentStep + 1} / {STEPS.length}
          </div>

          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creation...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Creer la room
                </>
              )}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} className="gap-2">
              Suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Skip option for optional steps */}
        {currentStep > 0 && currentStep < STEPS.length - 1 && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleNext}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Passer cette etape
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
