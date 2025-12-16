"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const glassInputVariants = cva(
  [
    "flex w-full rounded-xl transition-all duration-200",
    "placeholder:text-white/50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-white/10 backdrop-blur-md",
          "border border-white/20",
          "text-white",
          "hover:bg-white/15 hover:border-white/30",
          "focus:bg-white/15 focus:border-white/40",
        ].join(" "),
        intense: [
          "bg-white/15 backdrop-blur-lg",
          "border border-white/30",
          "text-white",
          "shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]",
          "hover:bg-white/20",
          "focus:bg-white/20 focus:border-white/50",
        ].join(" "),
        subtle: [
          "bg-white/5 backdrop-blur-sm",
          "border border-white/10",
          "text-white",
          "hover:bg-white/10",
          "focus:bg-white/10 focus:border-white/20",
        ].join(" "),
      },
      inputSize: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-14 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
)

export interface GlassInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof glassInputVariants> {
  icon?: React.ReactNode
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant, inputSize, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </span>
          <input
            ref={ref}
            className={cn(
              glassInputVariants({ variant, inputSize }),
              "pl-10",
              className
            )}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        ref={ref}
        className={cn(glassInputVariants({ variant, inputSize }), className)}
        {...props}
      />
    )
  }
)
GlassInput.displayName = "GlassInput"

// Glass Textarea
const glassTextareaVariants = cva(
  [
    "flex w-full rounded-xl transition-all duration-200",
    "placeholder:text-white/50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-white/10 backdrop-blur-md",
          "border border-white/20",
          "text-white",
          "hover:bg-white/15 hover:border-white/30",
          "focus:bg-white/15 focus:border-white/40",
        ].join(" "),
        intense: [
          "bg-white/15 backdrop-blur-lg",
          "border border-white/30",
          "text-white",
          "shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]",
          "hover:bg-white/20",
          "focus:bg-white/20 focus:border-white/50",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof glassTextareaVariants> {}

const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          glassTextareaVariants({ variant }),
          "min-h-[100px] px-4 py-3",
          className
        )}
        {...props}
      />
    )
  }
)
GlassTextarea.displayName = "GlassTextarea"

export { GlassInput, GlassTextarea, glassInputVariants, glassTextareaVariants }
