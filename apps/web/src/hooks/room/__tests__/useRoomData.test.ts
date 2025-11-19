import { renderHook, waitFor } from '@testing-library/react'
import { useRoomData } from '../useRoomData'
import { getRoomByCode } from '@/lib/api/rooms'
import { getMySwipesByRoom } from '@/lib/api/swipes'

// Mock the API functions
jest.mock('@/lib/api/rooms')
jest.mock('@/lib/api/swipes')

const mockGetRoomByCode = getRoomByCode as jest.MockedFunction<typeof getRoomByCode>
const mockGetMySwipesByRoom = getMySwipesByRoom as jest.MockedFunction<typeof getMySwipesByRoom>

describe('useRoomData', () => {
  const mockRoom = {
    id: 'room-1',
    code: 'ABC123',
    name: 'Test Room',
    type: 'movie' as const,
    genreId: 28,
    minRating: 7,
    members: [
      { id: 'user-1', name: 'User 1', email: 'user1@test.com' },
      { id: 'user-2', name: 'User 2', email: 'user2@test.com' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockSwipes = [
    { id: 'swipe-1', movieId: '123', value: true, roomId: 'room-1', userId: 'user-1', createdAt: new Date().toISOString() },
    { id: 'swipe-2', movieId: '456', value: false, roomId: 'room-1', userId: 'user-1', createdAt: new Date().toISOString() },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should load room and swipes on mount', async () => {
    mockGetRoomByCode.mockResolvedValue(mockRoom)
    mockGetMySwipesByRoom.mockResolvedValue(mockSwipes)

    const { result } = renderHook(() => useRoomData({ code: 'ABC123' }))

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.room).toBeNull()

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Check loaded data
    expect(result.current.room).toEqual(mockRoom)
    expect(result.current.swipedMovieIds.has('123')).toBe(true)
    expect(result.current.swipedMovieIds.has('456')).toBe(true)
    expect(result.current.swipesLoaded).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should handle room loading error', async () => {
    const errorMessage = 'Room not found'
    mockGetRoomByCode.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useRoomData({ code: 'INVALID' }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.room).toBeNull()
  })

  it('should handle swipes loading error gracefully', async () => {
    mockGetRoomByCode.mockResolvedValue(mockRoom)
    mockGetMySwipesByRoom.mockRejectedValue(new Error('Swipes failed'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useRoomData({ code: 'ABC123' }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Room should still load
    expect(result.current.room).toEqual(mockRoom)
    // Swipes should be empty but loaded flag should be true
    expect(result.current.swipedMovieIds.size).toBe(0)
    expect(result.current.swipesLoaded).toBe(true)

    consoleSpy.mockRestore()
  })

  it('should not load if code is empty', async () => {
    const { result } = renderHook(() => useRoomData({ code: '' }))

    // Should not attempt to load
    expect(mockGetRoomByCode).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(true)
    expect(result.current.room).toBeNull()
  })

  it('should reload room when reloadRoom is called', async () => {
    mockGetRoomByCode.mockResolvedValue(mockRoom)
    mockGetMySwipesByRoom.mockResolvedValue(mockSwipes)

    const { result } = renderHook(() => useRoomData({ code: 'ABC123' }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear mock calls
    mockGetRoomByCode.mockClear()
    mockGetMySwipesByRoom.mockClear()

    // Update mock data
    const updatedRoom = { ...mockRoom, name: 'Updated Room' }
    mockGetRoomByCode.mockResolvedValue(updatedRoom)
    mockGetMySwipesByRoom.mockResolvedValue(mockSwipes)

    // Reload room
    await result.current.reloadRoom()

    await waitFor(() => {
      expect(result.current.room?.name).toBe('Updated Room')
    })

    expect(mockGetRoomByCode).toHaveBeenCalledWith('ABC123')
    expect(mockGetMySwipesByRoom).toHaveBeenCalled()
  })

  it('should reload swipes when reloadSwipes is called', async () => {
    mockGetRoomByCode.mockResolvedValue(mockRoom)
    mockGetMySwipesByRoom.mockResolvedValue(mockSwipes)

    const { result } = renderHook(() => useRoomData({ code: 'ABC123' }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear mock calls
    mockGetMySwipesByRoom.mockClear()

    // Update swipes
    const newSwipes = [...mockSwipes, { id: 'swipe-3', movieId: '789', value: true, roomId: 'room-1', userId: 'user-1', createdAt: new Date().toISOString() }]
    mockGetMySwipesByRoom.mockResolvedValue(newSwipes)

    // Reload swipes
    await result.current.reloadSwipes()

    await waitFor(() => {
      expect(result.current.swipedMovieIds.has('789')).toBe(true)
    })

    expect(mockGetMySwipesByRoom).toHaveBeenCalledWith('room-1')
  })

  it('should not reload swipes if room is null', async () => {
    const { result } = renderHook(() => useRoomData({ code: '' }))

    // Room is null
    expect(result.current.room).toBeNull()

    // Try to reload swipes
    await result.current.reloadSwipes()

    // Should not call API
    expect(mockGetMySwipesByRoom).not.toHaveBeenCalled()
  })

  it('should update swipedMovieIds when setSwipedMovieIds is called', async () => {
    mockGetRoomByCode.mockResolvedValue(mockRoom)
    mockGetMySwipesByRoom.mockResolvedValue(mockSwipes)

    const { result } = renderHook(() => useRoomData({ code: 'ABC123' }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Add a new swiped movie ID
    const newSet = new Set(result.current.swipedMovieIds)
    newSet.add('999')

    result.current.setSwipedMovieIds(newSet)

    await waitFor(() => {
      expect(result.current.swipedMovieIds.has('999')).toBe(true)
    })
  })

  it('should reload when code changes', async () => {
    mockGetRoomByCode.mockResolvedValue(mockRoom)
    mockGetMySwipesByRoom.mockResolvedValue(mockSwipes)

    const { result, rerender } = renderHook(
      ({ code }) => useRoomData({ code }),
      { initialProps: { code: 'ABC123' } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.room?.code).toBe('ABC123')

    // Change code
    const newRoom = { ...mockRoom, code: 'XYZ789', name: 'New Room' }
    mockGetRoomByCode.mockResolvedValue(newRoom)

    rerender({ code: 'XYZ789' })

    await waitFor(() => {
      expect(result.current.room?.code).toBe('XYZ789')
    })

    expect(mockGetRoomByCode).toHaveBeenCalledWith('XYZ789')
  })
})
