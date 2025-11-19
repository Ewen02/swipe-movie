import { renderHook, waitFor, act } from '@testing-library/react'
import { useMatchNotifications } from '../useMatchNotifications'
import { useRoomSocket } from '@/hooks/useRoomSocket'
import { getMovieDetails } from '@/lib/api/movies'
import { useToast } from '@/components/providers/toast-provider'

// Mock dependencies
jest.mock('@/hooks/useRoomSocket')
jest.mock('@/lib/api/movies')
jest.mock('@/components/providers/toast-provider')

const mockUseRoomSocket = useRoomSocket as jest.MockedFunction<typeof useRoomSocket>
const mockGetMovieDetails = getMovieDetails as jest.MockedFunction<typeof getMovieDetails>
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>

describe('useMatchNotifications', () => {
  const mockToast = jest.fn()
  const mockResetNewMatch = jest.fn()

  const mockMatch = {
    id: 'match-1',
    roomId: 'room-1',
    movieId: '123',
    voteCount: 2,
    createdAt: new Date().toISOString(),
  }

  const mockMovie = {
    id: 123,
    title: 'Test Movie',
    overview: 'Test overview',
    posterUrl: '/poster.jpg',
    backdropUrl: '/backdrop.jpg',
    releaseDate: '2024-01-01',
    voteAverage: 8.5,
    voteCount: 1000,
    genreIds: [28],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseToast.mockReturnValue({ toast: mockToast } as any)
    mockUseRoomSocket.mockReturnValue({
      newMatch: null,
      resetNewMatch: mockResetNewMatch,
      isConnected: true,
      connectionState: 'connected',
      reconnectAttempts: 0,
    })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    expect(result.current.matchedMovie).toBeNull()
    expect(result.current.showMatchAnimation).toBe(false)
    expect(result.current.refreshMatches).toBe(0)
  })

  it('should handle new match from WebSocket', async () => {
    mockGetMovieDetails.mockResolvedValue(mockMovie)

    const { rerender, result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    // Simulate new match from WebSocket
    await act(async () => {
      mockUseRoomSocket.mockReturnValue({
        newMatch: { match: mockMatch, movie: mockMovie },
        resetNewMatch: mockResetNewMatch,
        isConnected: true,
        connectionState: 'connected',
        reconnectAttempts: 0,
      })

      rerender()
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: '🎉 Nouveau Match !',
        description: 'Un film a été matché par le groupe !',
        type: 'success',
        duration: 5000,
      })
    })

    await waitFor(() => {
      expect(result.current.matchedMovie).toEqual(mockMovie)
      expect(result.current.showMatchAnimation).toBe(true)
      expect(result.current.refreshMatches).toBe(1)
    })

    expect(mockGetMovieDetails).toHaveBeenCalledWith(123)
    expect(mockResetNewMatch).toHaveBeenCalled()
  })

  it('should handle match without movieId', async () => {
    const matchWithoutMovieId = { ...mockMatch, movieId: null }

    const { rerender, result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    await act(async () => {
      mockUseRoomSocket.mockReturnValue({
        newMatch: { match: matchWithoutMovieId as any },
        resetNewMatch: mockResetNewMatch,
        isConnected: true,
        connectionState: 'connected',
        reconnectAttempts: 0,
      })

      rerender()
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled()
    })

    // Should not fetch movie details
    expect(mockGetMovieDetails).not.toHaveBeenCalled()
    // Should still increment refresh counter
    expect(result.current.refreshMatches).toBe(1)
  })

  it('should prevent processing the same match twice', async () => {
    mockGetMovieDetails.mockResolvedValue(mockMovie)

    const { rerender } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    // First match
    mockUseRoomSocket.mockReturnValue({
      newMatch: { match: mockMatch },
      resetNewMatch: mockResetNewMatch,
      isConnected: true,
      connectionState: 'connected',
      reconnectAttempts: 0,
    })

    rerender()

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledTimes(1)
    })

    // Clear mocks
    mockToast.mockClear()
    mockGetMovieDetails.mockClear()

    // Same match again (simulate duplicate WebSocket event)
    rerender()

    // Should not process again
    expect(mockToast).not.toHaveBeenCalled()
    expect(mockGetMovieDetails).not.toHaveBeenCalled()
  })

  it('should handle movie details fetch error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    mockGetMovieDetails.mockRejectedValue(new Error('Movie not found'))

    const { rerender, result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    mockUseRoomSocket.mockReturnValue({
      newMatch: { match: mockMatch },
      resetNewMatch: mockResetNewMatch,
      isConnected: true,
      connectionState: 'connected',
      reconnectAttempts: 0,
    })

    rerender()

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled()
    })

    // Should handle error gracefully
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch movie details:',
      expect.any(Error)
    )
    expect(result.current.matchedMovie).toBeNull()
    expect(result.current.showMatchAnimation).toBe(false)

    consoleErrorSpy.mockRestore()
  })

  it('should complete match animation', () => {
    mockGetMovieDetails.mockResolvedValue(mockMovie)

    const { result, rerender } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    // Trigger match
    mockUseRoomSocket.mockReturnValue({
      newMatch: { match: mockMatch },
      resetNewMatch: mockResetNewMatch,
      isConnected: true,
      connectionState: 'connected',
      reconnectAttempts: 0,
    })

    rerender()

    // Complete animation
    act(() => {
      result.current.handleMatchAnimationComplete()
    })

    expect(result.current.showMatchAnimation).toBe(false)
    expect(result.current.matchedMovie).toBeNull()
  })

  it('should trigger match animation manually', () => {
    const { result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    act(() => {
      result.current.triggerMatchAnimation(mockMovie)
    })

    expect(result.current.matchedMovie).toEqual(mockMovie)
    expect(result.current.showMatchAnimation).toBe(true)
  })

  it('should not process match when roomId is null', () => {
    const { result } = renderHook(() =>
      useMatchNotifications({ roomId: null })
    )

    expect(mockUseRoomSocket).toHaveBeenCalledWith(null)
    expect(result.current.matchedMovie).toBeNull()
  })

  it('should increment refreshMatches counter', async () => {
    mockGetMovieDetails.mockResolvedValue(mockMovie)

    const { rerender, result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    // Initial value
    expect(result.current.refreshMatches).toBe(0)

    // First match
    mockUseRoomSocket.mockReturnValue({
      newMatch: { match: { ...mockMatch, id: 'match-1' } },
      resetNewMatch: mockResetNewMatch,
      isConnected: true,
      connectionState: 'connected',
      reconnectAttempts: 0,
    })

    rerender()

    await waitFor(() => {
      expect(result.current.refreshMatches).toBe(1)
    })

    // Reset for second match
    mockResetNewMatch.mockClear()

    // Second match (different ID)
    mockUseRoomSocket.mockReturnValue({
      newMatch: { match: { ...mockMatch, id: 'match-2' } },
      resetNewMatch: mockResetNewMatch,
      isConnected: true,
      connectionState: 'connected',
      reconnectAttempts: 0,
    })

    rerender()

    await waitFor(() => {
      expect(result.current.refreshMatches).toBe(2)
    })
  })

  it('should allow manual increment of refreshMatches', () => {
    const { result } = renderHook(() =>
      useMatchNotifications({ roomId: 'room-1' })
    )

    expect(result.current.refreshMatches).toBe(0)

    act(() => {
      result.current.setRefreshMatches(prev => prev + 1)
    })

    expect(result.current.refreshMatches).toBe(1)
  })
})
