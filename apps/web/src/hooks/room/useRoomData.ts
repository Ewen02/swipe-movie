import { useState, useEffect, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { getRoomByCode } from '@/lib/api/rooms';
import { getMySwipesByRoom } from '@/lib/api/swipes';
import type { RoomWithMembersResponseDto } from '@/schemas/rooms';
import type { Swipe } from '@/schemas/swipes';

interface UseRoomDataProps {
  code: string;
}

/**
 * Discriminates each phase of the room+swipes load sequence:
 * - 'loading'  -> room is still being fetched (skeleton)
 * - 'partial'  -> room is in but swipes still loading (can show room shell)
 * - 'ready'    -> both room and swipes loaded
 * - 'error'    -> either request failed
 */
export type RoomDataStatus = 'loading' | 'partial' | 'ready' | 'error';

interface UseRoomDataReturn {
  room: RoomWithMembersResponseDto | null;
  status: RoomDataStatus;
  // Legacy booleans kept so callers don't all have to migrate at once. New
  // callsites should read `status` directly.
  loading: boolean;
  error: string | null;
  swipedMovieIds: Set<string>;
  swipesLoaded: boolean;
  setSwipedMovieIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  reloadSwipes: () => Promise<void>;
  reloadRoom: () => Promise<void>;
}

// SWR fetcher for room data
const roomFetcher = (code: string) => getRoomByCode(code);

// SWR fetcher for swipes data
const swipesFetcher = (roomId: string) => getMySwipesByRoom(roomId);

export function useRoomData({ code }: UseRoomDataProps): UseRoomDataReturn {
  // Local state for optimistic updates on swipes
  const [localSwipedIds, setLocalSwipedIds] = useState<Set<string> | null>(null);

  // SWR for room data with 2 min cache
  const {
    data: room,
    error: roomError,
    isLoading: roomLoading,
    mutate: mutateRoom,
  } = useSWR<RoomWithMembersResponseDto>(
    code ? `/api/rooms/code/${code}` : null,
    () => roomFetcher(code),
    {
      dedupingInterval: 2 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  // SWR for swipes data - depends on room being loaded
  const {
    data: swipes,
    error: swipesError,
    isLoading: swipesLoading,
    mutate: mutateSwipes,
  } = useSWR<Swipe[]>(
    room?.id ? `/api/swipes/me/${room.id}` : null,
    () => swipesFetcher(room!.id),
    {
      dedupingInterval: 30 * 1000, // 30 sec cache - avoid frequent revalidation
      revalidateOnFocus: false, // Don't revalidate on tab focus (causes flicker)
      revalidateOnMount: true, // Fetch fresh swipes on initial mount
      revalidateOnReconnect: false,
    },
  );

  // Convert swipes to Set of movie IDs (use local state if available for optimistic updates)
  const swipedMovieIds = useMemo(() => {
    if (localSwipedIds !== null) {
      return localSwipedIds;
    }
    return new Set(swipes?.map((s) => s.movieId) ?? []);
  }, [swipes, localSwipedIds]);

  // Setter that updates local state for optimistic updates
  const setSwipedMovieIds = useCallback(
    (updater: React.SetStateAction<Set<string>>) => {
      setLocalSwipedIds((prev) => {
        const current = prev ?? swipedMovieIds;
        if (typeof updater === 'function') {
          return updater(current);
        }
        return updater;
      });
    },
    [swipedMovieIds],
  );

  // Sync local state when server data catches up to optimistic updates
  useEffect(() => {
    if (!swipes || localSwipedIds === null) return;
    // Only reset if server data includes all local optimistic ids
    const serverIds = new Set(swipes.map((s) => s.movieId));
    const allIncluded = [...localSwipedIds].every((id) => serverIds.has(id));
    if (allIncluded) {
      setLocalSwipedIds(null);
    }
  }, [swipes, localSwipedIds]);

  const reloadSwipes = useCallback(async () => {
    setLocalSwipedIds(null);
    await mutateSwipes();
  }, [mutateSwipes]);

  const reloadRoom = useCallback(async () => {
    await mutateRoom();
  }, [mutateRoom]);

  // Compose a single status from the two SWR slices.
  const error = roomError?.message ?? swipesError?.message ?? null;
  const swipesLoaded = !swipesLoading && (swipes !== undefined || swipesError !== undefined);

  let status: RoomDataStatus;
  if (error) {
    status = 'error';
  } else if (!code || roomLoading) {
    // Treat "no code yet" as loading rather than ready — the consumer hasn't
    // told us what to fetch yet, so it shouldn't think we're done.
    status = 'loading';
  } else if (room && !swipesLoaded) {
    status = 'partial';
  } else {
    status = 'ready';
  }

  // Legacy boolean kept for backward compat — true while either request is
  // pending and there's no error yet.
  const loading = status === 'loading' || status === 'partial';

  return {
    room: room ?? null,
    status,
    loading,
    error,
    swipedMovieIds,
    swipesLoaded,
    setSwipedMovieIds,
    reloadSwipes,
    reloadRoom,
  };
}
