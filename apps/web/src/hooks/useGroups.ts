"use client"

import useSWR from "swr"
import { getMyGroups } from "@/lib/api/groups"
import { GroupsResponseDto } from "@/schemas/groups"

export const GROUPS_KEY = "/api/groups/my"

const fetchGroups = async (): Promise<GroupsResponseDto> => {
  return getMyGroups()
}

export function useGroups() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<GroupsResponseDto>(GROUPS_KEY, fetchGroups, {
      dedupingInterval: 2 * 60 * 1000,
      revalidateOnFocus: true,
    })

  return {
    groups: data?.groups ?? [],
    isLoading,
    isValidating,
    error: error?.message ?? null,
    refresh: () => mutate(),
  }
}
