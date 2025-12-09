"use client"

import { createContext, useContext, ReactNode } from "react"
import { useToast as useToastHook, Toaster } from "@swipe-movie/ui"

type ToastContextType = ReturnType<typeof useToastHook>

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastState = useToastHook()

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <Toaster toasts={toastState.toasts} dismiss={toastState.dismiss} />
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
