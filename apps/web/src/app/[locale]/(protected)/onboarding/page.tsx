"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { StepProviders, StepGenres, StepSwipe, StepComplete } from "./components"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import type { OnboardingSwipe } from "@/lib/api/users"
import { OnboardingPageSkeleton } from "./OnboardingPageSkeleton"

const STEPS = [
  { id: "providers", title: "Plateformes" },
  { id: "genres", title: "Genres" },
  { id: "swipe", title: "Validation" },
  { id: "complete", title: "Termine" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { preferences, isLoading, update, saveSwipes, complete } = useUserPreferences()

  // Debug mode: ?debug=true to force restart onboarding
  const isDebugMode = searchParams.get("debug") === "true"

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProviders, setSelectedProviders] = useState<number[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Load saved preferences if available
  useEffect(() => {
    if (preferences && !isDebugMode) {
      if (preferences.watchProviders?.length > 0) {
        setSelectedProviders(preferences.watchProviders)
      }
      if (preferences.favoriteGenreIds?.length > 0) {
        setSelectedGenres(preferences.favoriteGenreIds)
      }
      // Resume from saved step
      if (preferences.onboardingStep > 0 && preferences.onboardingStep < 4) {
        setCurrentStep(preferences.onboardingStep)
      }
      // If already completed, redirect to rooms
      if (preferences.onboardingCompleted) {
        router.replace("/rooms")
      }
    }
  }, [preferences, router, isDebugMode])

  const handleProvidersNext = async () => {
    setIsSaving(true)
    try {
      await update({
        watchProviders: selectedProviders,
        onboardingStep: 1,
      })
      setCurrentStep(1)
    } catch (error) {
      console.error("Failed to save providers:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenresNext = async () => {
    setIsSaving(true)
    try {
      await update({
        favoriteGenreIds: selectedGenres,
        onboardingStep: 2,
      })
      setCurrentStep(2)
    } catch (error) {
      console.error("Failed to save genres:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSwipeComplete = async (swipes: OnboardingSwipe[]) => {
    setIsSaving(true)
    try {
      await saveSwipes(swipes)
      await update({ onboardingStep: 3 })
      setCurrentStep(3)
    } catch (error) {
      console.error("Failed to save swipes:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateRoom = async () => {
    setIsSaving(true)
    try {
      await complete()
      router.push("/rooms?create=true")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscover = async () => {
    setIsSaving(true)
    try {
      await complete()
      router.push("/discover")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImport = async () => {
    setIsSaving(true)
    try {
      await complete()
      router.push("/connections")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <OnboardingPageSkeleton />
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      {/* Step indicator */}
      {currentStep < 3 && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0 mb-2">
            {STEPS.slice(0, 3).map((step, index) => (
              <div
                key={step.id}
                className="flex items-center"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index < currentStep
                        ? "bg-primary text-white"
                        : index === currentStep
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 whitespace-nowrap">
                    {step.title}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-0.5 w-16 sm:w-24 md:w-32 mx-2 rounded-full transition-colors ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Enregistrement...</span>
          </div>
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {currentStep === 0 && (
            <StepProviders
              selectedProviders={selectedProviders}
              onProvidersChange={setSelectedProviders}
              onNext={handleProvidersNext}
            />
          )}
          {currentStep === 1 && (
            <StepGenres
              selectedGenres={selectedGenres}
              onGenresChange={setSelectedGenres}
              onNext={handleGenresNext}
              onBack={() => setCurrentStep(0)}
            />
          )}
          {currentStep === 2 && (
            <StepSwipe
              selectedProviders={selectedProviders}
              selectedGenres={selectedGenres}
              onComplete={handleSwipeComplete}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <StepComplete
              onCreateRoom={handleCreateRoom}
              onDiscover={handleDiscover}
              onImport={handleImport}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
