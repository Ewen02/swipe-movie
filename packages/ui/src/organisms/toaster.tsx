"use client"

import { AnimatePresence } from "framer-motion"
import { Toast } from "./toast"
import type { Toast as ToastType } from "../hooks/use-toast"

interface ToasterProps {
  toasts: ToastType[]
  dismiss: (id: string) => void
}

export function Toaster({ toasts, dismiss }: ToasterProps) {
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}
