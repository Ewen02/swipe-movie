"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

const glassButtonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "rounded-xl font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          "border border-[var(--glass-border-highlight)]",
          "shadow-[var(--glass-shadow)]",
          "hover:bg-[var(--glass-bg-intense)] hover:shadow-lg",
          "active:scale-[0.98]",
        ].join(" "),
        primary: [
          "bg-gradient-to-br from-primary/80 to-primary/60 backdrop-blur-xl",
          "border border-primary/30",
          "shadow-[0_8px_32px_rgba(168,85,247,0.3)]",
          "text-primary-foreground",
          "hover:from-primary/90 hover:to-primary/70 hover:shadow-[0_8px_40px_rgba(168,85,247,0.4)]",
          "active:scale-[0.98]",
        ].join(" "),
        accent: [
          "bg-gradient-to-br from-accent/80 to-accent/60 backdrop-blur-xl",
          "border border-accent/30",
          "shadow-[0_8px_32px_rgba(236,72,153,0.3)]",
          "text-accent-foreground",
          "hover:from-accent/90 hover:to-accent/70 hover:shadow-[0_8px_40px_rgba(236,72,153,0.4)]",
          "active:scale-[0.98]",
        ].join(" "),
        ghost: [
          "bg-transparent backdrop-blur-sm",
          "border border-transparent",
          "hover:bg-[var(--glass-bg-subtle)] hover:border-[var(--glass-border)]",
          "active:scale-[0.98]",
        ].join(" "),
        outline: [
          "bg-transparent backdrop-blur-sm",
          "border-2 border-[var(--glass-border-highlight)]",
          "hover:bg-[var(--glass-bg-subtle)]",
          "active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof glassButtonVariants> {
  children?: React.ReactNode
  asChild?: boolean
  shine?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    { className, variant, size, asChild = false, shine = true, children, ...props },
    ref
  ) => {
    // Note: asChild doesn't work well with motion components, so we handle it differently
    if (asChild) {
      return (
        <Slot
          className={cn(glassButtonVariants({ variant, size, className }))}
          ref={ref as React.Ref<HTMLElement>}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.button
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {/* Shine overlay */}
        {shine && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, var(--glass-shine-start), var(--glass-shine-end) 50%)",
              borderRadius: "inherit",
            }}
          />
        )}
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
