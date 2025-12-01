"use client"

import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/providers/toast-provider"
import { ErrorBoundary } from "@/components/error"
import type { Session } from "next-auth"

interface ProvidersProps {
  children: ReactNode
  session?: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider
        session={session}
        refetchInterval={5 * 60} // Refetch session every 5 minutes to prevent expiration
        refetchOnWindowFocus={true} // Refetch when user returns to tab for fresh session
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
