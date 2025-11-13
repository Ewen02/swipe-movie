"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Toast as ToastType } from "@/hooks/use-toast"

interface ToastProps extends ToastType {
  onClose: () => void
}

export function Toast({ id, title, description, type = "default", onClose }: ToastProps) {
  const icons = {
    default: <Info className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  }

  const styles = {
    default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  }

  const iconStyles = {
    default: "text-gray-600 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
  }

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg",
        styles[type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex-shrink-0", iconStyles[type])}>
          {icons[type]}
        </div>
        <div className="flex-1">
          {title && (
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </p>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
