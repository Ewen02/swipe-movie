"use client"

import { SWRConfig } from "swr"
import { ReactNode } from "react"

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Cache for 5 minutes
        dedupingInterval: 5 * 60 * 1000,
        // Revalidate on focus (user returns to tab)
        revalidateOnFocus: true,
        // Don't revalidate on reconnect to reduce requests
        revalidateOnReconnect: false,
        // Retry on error (3 times with exponential backoff)
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        // Keep previous data while revalidating
        keepPreviousData: true,
        // Suspense mode disabled for progressive loading
        suspense: false,
        // Fast initial load - use cache first
        revalidateIfStale: true,
        // Refresh interval disabled by default (manual refresh)
        refreshInterval: 0,
      }}
    >
      {children}
    </SWRConfig>
  )
}
