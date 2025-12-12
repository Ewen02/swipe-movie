"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/providers/toast-provider"
import { ErrorBoundary } from "@/components/error"
import { SWRProvider } from "@/lib/swr-config"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SWRProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </SWRProvider>
    </ErrorBoundary>
  )
}
