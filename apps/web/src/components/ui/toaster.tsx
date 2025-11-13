"use client"

import { AnimatePresence } from "framer-motion"
import { Toast } from "./toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

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
