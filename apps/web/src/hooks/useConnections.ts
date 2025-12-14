"use client"

import useSWR from "swr"
import { ExternalConnection } from "@swipe-movie/types"
import {
  getTraktStatus,
  getAniListStatus,
  ExternalProvider,
} from "@/lib/api/external-services"

// SWR keys
export const TRAKT_STATUS_KEY = "/api/trakt/status"
export const ANILIST_STATUS_KEY = "/api/anilist/status"

// Individual hooks for each provider
export function useTraktConnection() {
  const { data, error, isLoading, mutate } = useSWR<ExternalConnection>(
    TRAKT_STATUS_KEY,
    getTraktStatus,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60 * 1000,
    }
  )

  return {
    status: data,
    isLoading,
    error: error?.message ?? null,
    refresh: () => mutate(),
  }
}

export function useAniListConnection() {
  const { data, error, isLoading, mutate } = useSWR<ExternalConnection>(
    ANILIST_STATUS_KEY,
    getAniListStatus,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60 * 1000,
    }
  )

  return {
    status: data,
    isLoading,
    error: error?.message ?? null,
    refresh: () => mutate(),
  }
}

// Combined hook for all connections
export function useConnections() {
  const trakt = useTraktConnection()
  const anilist = useAniListConnection()

  return {
    trakt,
    anilist,
    isLoading: trakt.isLoading || anilist.isLoading,
    refreshAll: () => {
      trakt.refresh()
      anilist.refresh()
    },
  }
}

// Helper to get the SWR key for a provider
export function getConnectionKey(provider: ExternalProvider): string {
  switch (provider) {
    case "trakt":
      return TRAKT_STATUS_KEY
    case "anilist":
      return ANILIST_STATUS_KEY
  }
}
