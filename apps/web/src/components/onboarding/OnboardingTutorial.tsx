"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useTranslations } from "next-intl"

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
}

interface OnboardingTutorialProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingTutorial({ onComplete, onSkip }: OnboardingTutorialProps) {
  const t = useTranslations('onboarding')
  const [currentStep, setCurrentStep] = useState(0)

  const steps: OnboardingStep[] = [
    {
      title: t('step1.title'),
      description: t('step1.description'),
      icon: (
        <div className="text-6xl mb-4">🎬</div>
      )
    },
    {
      title: t('step2.title'),
      description: t('step2.description'),
      icon: (
        <div className="text-6xl mb-4">👥</div>
      )
    },
    {
      title: t('step3.title'),
      description: t('step3.description'),
      icon: (
        <div className="text-6xl mb-4">❤️</div>
      )
    },
    {
      title: t('step4.title'),
      description: t('step4.description'),
      icon: (
        <div className="text-6xl mb-4">🎉</div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'Escape') onSkip()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 border-2">
        <CardContent className="p-8">
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Skip tutorial"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Step content with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              {steps[currentStep].icon}
              <h2 className="text-3xl font-bold mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('previous')}
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </div>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4" />
                  {t('finish')}
                </>
              ) : (
                <>
                  {t('next')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip button */}
          {currentStep < steps.length - 1 && (
            <div className="text-center mt-4">
              <button
                onClick={onSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('skip')}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
