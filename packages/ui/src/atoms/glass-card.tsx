"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

const glassCardVariants = cva(
  "relative overflow-hidden rounded-2xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "glass glass-shine",
        subtle: "glass-subtle",
        intense: "glass-intense glass-shine",
        colored: "glass glass-glow glass-shine",
        refract: "glass glass-refract glass-shine",
        specular: "glass glass-specular glass-shine",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      edgeGlow: {
        true: "glass-edge-glow",
        false: "",
      },
      hover: {
        true: "hover:scale-[1.02] hover:brightness-110 cursor-pointer transition-transform",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      edgeGlow: false,
      hover: false,
    },
  }
)

export interface GlassCardProps
  extends Omit<HTMLMotionProps<"div">, "children">,
    VariantProps<typeof glassCardVariants> {
  children?: React.ReactNode
  shimmer?: boolean
  breathe?: boolean
  glowColor?: string
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant,
      size,
      edgeGlow,
      hover,
      shimmer = false,
      breathe = false,
      glowColor,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, size, edgeGlow, hover }),
          shimmer && "glass-shimmer",
          breathe && "glass-breathe",
          className
        )}
        style={{
          ...style,
          ...(glowColor && {
            boxShadow: `var(--glass-shadow), 0 0 40px ${glowColor}`,
          }),
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  glassCardVariants,
}
