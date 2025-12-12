"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  onStepClick?: (step: number) => void
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isPending = index > currentStep

        return (
          <button
            key={index}
            type="button"
            onClick={() => onStepClick?.(index)}
            disabled={!onStepClick || isPending}
            className={cn(
              "relative flex items-center justify-center transition-all duration-300",
              onStepClick && !isPending ? "cursor-pointer" : "cursor-default"
            )}
            aria-label={labels?.[index] || `Step ${index + 1}`}
          >
            {/* Step dot/circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                isCompleted && "bg-primary text-white",
                isCurrent && "bg-primary text-white ring-4 ring-primary/20",
                isPending && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "absolute left-full w-8 h-0.5 -translate-y-1/2 top-1/2",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
