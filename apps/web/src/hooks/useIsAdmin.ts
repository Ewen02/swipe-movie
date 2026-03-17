"use client"

import useSWR from "swr"
import { GET } from "@/lib/api"

async function checkAdmin(): Promise<boolean> {
  try {
    const res = await GET("/admin/stats")
    return res.ok
  } catch {
    return false
  }
}

export function useIsAdmin() {
  const { data, isLoading } = useSWR("admin-check", checkAdmin, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  })

  return {
    isAdmin: data === true,
    isLoading,
  }
}
