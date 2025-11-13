"use client"

import { createContext, useContext, ReactNode } from "react"
import { useToast as useToastHook } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

type ToastContextType = ReturnType<typeof useToastHook>

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToastHook()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
