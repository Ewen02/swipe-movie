"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import {
  getUserLibrary,
  updateLibraryItemStatus,
  deleteLibraryItem,
  getLibraryStats,
  LibraryResponse,
  LibraryQueryParams,
  LibraryStats,
} from "@/lib/api/users"

// SWR key generator for user library
export const getUserLibraryKey = (params: LibraryQueryParams) => {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set("status", params.status)
  if (params.source) searchParams.set("source", params.source)
  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())
  const query = searchParams.toString()
  return `/api/users/me/library${query ? `?${query}` : ""}`
}

// Fetcher function
const fetchLibrary = async (params: LibraryQueryParams): Promise<LibraryResponse> => {
  return getUserLibrary(params)
}

export function useUserLibrary(initialParams: LibraryQueryParams = {}) {
  const [params, setParams] = useState<LibraryQueryParams>({
    page: 1,
    limit: 20,
    ...initialParams,
  })

  const swrKey = getUserLibraryKey(params)

  const { data, error, isLoading, isValidating, mutate } = useSWR<LibraryResponse>(
    swrKey,
    () => fetchLibrary(params),
    {
      dedupingInterval: 30 * 1000, // 30 seconds
      revalidateOnFocus: true,
    }
  )

  const setStatus = useCallback((status: string | undefined) => {
    setParams((prev) => ({ ...prev, status, page: 1 }))
  }, [])

  const setSource = useCallback((source: string | undefined) => {
    setParams((prev) => ({ ...prev, source, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  const updateStatus = useCallback(
    async (itemId: string, status: string) => {
      const updated = await updateLibraryItemStatus(itemId, status)
      // Revalidate the list
      mutate()
      return updated
    },
    [mutate]
  )

  const deleteItem = useCallback(
    async (itemId: string) => {
      await deleteLibraryItem(itemId)
      // Revalidate the list
      mutate()
    },
    [mutate]
  )

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isValidating,
    error: error?.message ?? null,
    // Filters
    filters: params,
    setStatus,
    setSource,
    setPage,
    // Actions
    updateStatus,
    deleteItem,
    refresh: () => mutate(),
  }
}

/**
 * Hook to fetch library statistics (counts by status and source)
 */
export function useLibraryStats() {
  const { data, error, isLoading, mutate } = useSWR<LibraryStats>(
    "/api/users/me/library/stats",
    () => getLibraryStats(),
    {
      dedupingInterval: 60 * 1000, // 1 minute
      revalidateOnFocus: true,
    }
  )

  return {
    stats: data,
    total: data?.total ?? 0,
    byStatus: data?.byStatus ?? {},
    bySource: data?.bySource ?? {},
    isLoading,
    error: error?.message ?? null,
    refresh: () => mutate(),
  }
}
