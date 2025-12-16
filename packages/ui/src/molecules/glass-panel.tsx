"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type HTMLMotionProps, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

const glassPanelVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "glass rounded-3xl",
        floating: "glass-intense rounded-3xl shadow-2xl",
        fullscreen: "glass-intense fixed inset-0 z-50",
        modal: "glass-intense rounded-3xl shadow-2xl max-w-lg w-full mx-4",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface GlassPanelProps
  extends Omit<HTMLMotionProps<"div">, "children">,
    VariantProps<typeof glassPanelVariants> {
  children?: React.ReactNode
  showBlobs?: boolean
  blobColors?: [string, string, string]
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      variant,
      padding,
      showBlobs = false,
      blobColors = ["rgba(168, 85, 247, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(59, 130, 246, 0.2)"],
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(glassPanelVariants({ variant, padding }), className)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...props}
      >
        {/* Animated background blobs */}
        {showBlobs && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-64 h-64 rounded-full blur-3xl opacity-60"
              style={{
                background: blobColors[0],
                top: "10%",
                left: "10%",
              }}
              animate={{
                x: [0, 15, -10, 0],
                y: [0, -15, 10, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-48 h-48 rounded-full blur-3xl opacity-60"
              style={{
                background: blobColors[1],
                top: "60%",
                right: "10%",
              }}
              animate={{
                x: [0, -20, 15, 0],
                y: [0, 10, -20, 0],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute w-56 h-56 rounded-full blur-3xl opacity-60"
              style={{
                background: blobColors[2],
                bottom: "20%",
                left: "30%",
              }}
              animate={{
                x: [0, 10, -15, 0],
                y: [0, -10, 15, 0],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    )
  }
)
GlassPanel.displayName = "GlassPanel"

// Modal wrapper with backdrop
export interface GlassModalProps extends GlassPanelProps {
  isOpen: boolean
  onClose?: () => void
}

const GlassModal = React.forwardRef<HTMLDivElement, GlassModalProps>(
  ({ isOpen, onClose, children, ...props }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <GlassPanel ref={ref} variant="modal" {...props}>
                {children}
              </GlassPanel>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }
)
GlassModal.displayName = "GlassModal"

export { GlassPanel, GlassModal, glassPanelVariants }
