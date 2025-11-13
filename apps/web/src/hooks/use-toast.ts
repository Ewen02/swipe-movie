import { useState, useCallback } from "react"

export type ToastType = "default" | "success" | "error" | "warning"

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: ToastType
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(
    ({
      title,
      description,
      type = "default",
      duration = 5000,
      ...props
    }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)

      setState((prev) => ({
        toasts: [...prev.toasts, { id, title, description, type, duration, ...props }],
      }))

      if (duration > 0) {
        setTimeout(() => {
          setState((prev) => ({
            toasts: prev.toasts.filter((t) => t.id !== id),
          }))
        }, duration)
      }

      return id
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    setState((prev) => ({
      toasts: toastId
        ? prev.toasts.filter((t) => t.id !== toastId)
        : [],
    }))
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss,
  }
}
