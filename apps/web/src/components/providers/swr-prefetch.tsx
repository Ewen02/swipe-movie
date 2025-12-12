"use client"

import { SWRConfig } from "swr"
import { ReactNode } from "react"

interface SWRPrefetchProps {
  children: ReactNode
  fallback: Record<string, unknown>
}

/**
 * Provider that hydrates SWR cache with server-side prefetched data
 * This eliminates the loading state on initial page load for prefetched routes
 */
export function SWRPrefetch({ children, fallback }: SWRPrefetchProps) {
  return (
    <SWRConfig value={{ fallback }}>
      {children}
    </SWRConfig>
  )
}
