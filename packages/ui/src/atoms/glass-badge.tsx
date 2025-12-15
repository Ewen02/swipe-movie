"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const glassBadgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-full font-medium transition-all duration-200",
    "backdrop-blur-md",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--glass-bg)] border border-[var(--glass-border)]",
          "text-foreground",
        ].join(" "),
        primary: [
          "bg-primary/20 border border-primary/30",
          "text-primary",
        ].join(" "),
        accent: [
          "bg-accent/20 border border-accent/30",
          "text-accent",
        ].join(" "),
        success: [
          "bg-success/20 border border-success/30",
          "text-success",
        ].join(" "),
        warning: [
          "bg-warning/20 border border-warning/30",
          "text-warning-foreground",
        ].join(" "),
        destructive: [
          "bg-destructive/20 border border-destructive/30",
          "text-destructive",
        ].join(" "),
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface GlassBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof glassBadgeVariants> {
  icon?: React.ReactNode
}

const GlassBadge = React.forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(glassBadgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    )
  }
)
GlassBadge.displayName = "GlassBadge"

export { GlassBadge, glassBadgeVariants }
