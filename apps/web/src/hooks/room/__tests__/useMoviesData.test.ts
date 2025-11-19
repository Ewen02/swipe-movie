import { renderHook, waitFor } from '@testing-library/react'
import { useMoviesData } from '../useMoviesData'
import { getMoviesByGenre, getBatchWatchProviders } from '@/lib/api/movies'
import * as utils from '@/lib/utils'

// Mock the API functions
jest.mock('@/lib/api/movies')
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  shuffleWithSeed: jest.fn((arr) => arr), // Return same array for predictability
}))

const mockGetMoviesByGenre = getMoviesByGenre as jest.MockedFunction<typeof getMoviesByGenre>
const mockGetBatchWatchProviders = getBatchWatchProviders as jest.MockedFunction<typeof getBatchWatchProviders>

describe('useMoviesData', () => {
  const mockRoom = {
    id: 'room-1',
    code: 'ABC123',
    name: 'Test Room',
    type: 'movie' as const,
    genreId: 28, // Action
    minRating: 7,
    members: [{ id: 'user-1', name: 'User 1', email: 'user1@test.com' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockMovies = [
    {
      id: 123,
      title: 'Test Movie 1',
      overview: 'Test overview 1',
      posterUrl: '/poster1.jpg',
      backdropUrl: '/backdrop1.jpg',
      releaseDate: '2024-01-01',
      voteAverage: 8.5,
      voteCount: 1000,
      genreIds: [28],
    },
    {
      id: 456,
      title: 'Test Movie 2',
      overview: 'Test overview 2',
      posterUrl: '/poster2.jpg',
      backdropUrl: '/backdrop2.jpg',
      releaseDate: '2024-02-01',
      voteAverage: 7.5,
      voteCount: 500,
      genreIds: [28],
    },
  ]

  const mockProviders = {
    123: [{ id: 8, name: 'Netflix', logoPath: '/netflix.png' }],
    456: [{ id: 9, name: 'Prime Video', logoPath: '/prime.png' }],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.log for tests
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should load movies when room and swipes are ready', async () => {
    mockGetMoviesByGenre.mockResolvedValue(mockMovies)
    mockGetBatchWatchProviders.mockResolvedValue(mockProviders)

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    // Initially loading
    expect(result.current.moviesLoading).toBe(true)

    // Wait for movies to load
    await waitFor(() => {
      expect(result.current.moviesLoading).toBe(false)
    })

    // Check loaded movies
    expect(result.current.movies).toHaveLength(2)
    expect(result.current.movies[0].id).toBe(123)
    expect(result.current.movies[1].id).toBe(456)
    expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28, 'movie', 1, { minRating: 7 })
  })

  it('should not load if swipes are not loaded', () => {
    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: false,
      })
    )

    // Should not attempt to load
    expect(mockGetMoviesByGenre).not.toHaveBeenCalled()
    expect(result.current.movies).toHaveLength(0)
  })

  it('should filter out swiped movies', async () => {
    mockGetMoviesByGenre.mockResolvedValue(mockMovies)
    mockGetBatchWatchProviders.mockResolvedValue(mockProviders)

    const swipedIds = new Set(['123']) // Movie 123 already swiped

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: swipedIds,
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(result.current.moviesLoading).toBe(false)
    })

    // Only movie 456 should be returned
    expect(result.current.movies).toHaveLength(1)
    expect(result.current.movies[0].id).toBe(456)
  })

  it('should apply room filters to API call', async () => {
    const roomWithFilters = {
      ...mockRoom,
      minRating: 8,
      releaseYearMin: 2020,
      releaseYearMax: 2024,
      runtimeMin: 90,
      runtimeMax: 150,
      watchProviders: [8, 9],
      watchRegion: 'US',
      originalLanguage: 'en',
    }

    mockGetMoviesByGenre.mockResolvedValue(mockMovies)
    mockGetBatchWatchProviders.mockResolvedValue(mockProviders)

    renderHook(() =>
      useMoviesData({
        room: roomWithFilters,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(mockGetMoviesByGenre).toHaveBeenCalled()
    })

    expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28, 'movie', 1, {
      minRating: 8,
      releaseYearMin: 2020,
      releaseYearMax: 2024,
      runtimeMin: 90,
      runtimeMax: 150,
      watchProviders: [8, 9],
      watchRegion: 'US',
      originalLanguage: 'en',
    })
  })

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    mockGetMoviesByGenre.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(result.current.moviesLoading).toBe(false)
    })

    // Should not crash
    expect(result.current.movies).toHaveLength(0)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load movies:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  it('should load more movies when handleLoadMoreMovies is called', async () => {
    const page1Movies = [mockMovies[0]]
    const page2Movies = [mockMovies[1]]

    mockGetMoviesByGenre
      .mockResolvedValueOnce(page1Movies)
      .mockResolvedValueOnce(page2Movies)
    mockGetBatchWatchProviders.mockResolvedValue(mockProviders)

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.movies).toHaveLength(1)
    })

    // Clear mocks to track new calls
    mockGetMoviesByGenre.mockClear()

    // Load more
    result.current.handleLoadMoreMovies()

    await waitFor(() => {
      expect(mockGetMoviesByGenre).toHaveBeenCalledWith(28, 'movie', 2, expect.any(Object))
    })

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(2)
    })
  })

  it('should stop loading when API returns empty results', async () => {
    mockGetMoviesByGenre.mockResolvedValue([])
    mockGetBatchWatchProviders.mockResolvedValue({})

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(result.current.moviesLoading).toBe(false)
    })

    expect(result.current.hasMoreMovies).toBe(false)
  })

  it('should not load more if already loading', async () => {
    mockGetMoviesByGenre.mockImplementation(() => new Promise(() => {})) // Never resolves

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    // Initial load starts
    expect(result.current.moviesLoading).toBe(true)

    const callCountBefore = mockGetMoviesByGenre.mock.calls.length

    // Try to load more while loading
    result.current.handleLoadMoreMovies()

    // Should not trigger another call
    expect(mockGetMoviesByGenre).toHaveBeenCalledTimes(callCountBefore)
  })

  it('should handle watch providers loading error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    mockGetMoviesByGenre.mockResolvedValue(mockMovies)
    mockGetBatchWatchProviders.mockRejectedValue(new Error('Providers failed'))

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(result.current.moviesLoading).toBe(false)
    })

    // Movies should still load without providers
    expect(result.current.movies).toHaveLength(2)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load watch providers:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should reload when room ID changes', async () => {
    mockGetMoviesByGenre.mockResolvedValue(mockMovies)
    mockGetBatchWatchProviders.mockResolvedValue(mockProviders)

    const { result, rerender } = renderHook(
      ({ room }) =>
        useMoviesData({
          room,
          swipedMovieIds: new Set(),
          swipesLoaded: true,
        }),
      { initialProps: { room: mockRoom } }
    )

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(2)
    })

    // Clear mocks
    mockGetMoviesByGenre.mockClear()

    // Change room
    const newRoom = { ...mockRoom, id: 'room-2', name: 'New Room' }
    mockGetMoviesByGenre.mockResolvedValue([mockMovies[0]])

    rerender({ room: newRoom })

    await waitFor(() => {
      expect(mockGetMoviesByGenre).toHaveBeenCalled()
    })
  })

  it('should use custom swipedIds in loadMovies when provided', async () => {
    mockGetMoviesByGenre.mockResolvedValue(mockMovies)
    mockGetBatchWatchProviders.mockResolvedValue(mockProviders)

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(['123']), // Initial swiped set
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(1) // Only 456
    })

    // Now call loadMovies with custom swiped IDs
    const customSwipedIds = new Set(['456']) // Different set

    await result.current.loadMovies(28, 'movie', 1, false, mockRoom, customSwipedIds)

    await waitFor(() => {
      // Should use customSwipedIds and return only 123
      expect(result.current.movies.some(m => m.id === 123)).toBe(true)
      expect(result.current.movies.some(m => m.id === 456)).toBe(false)
    })
  })

  it('should setMovies when called directly', async () => {
    mockGetMoviesByGenre.mockResolvedValue([])
    mockGetBatchWatchProviders.mockResolvedValue({})

    const { result } = renderHook(() =>
      useMoviesData({
        room: mockRoom,
        swipedMovieIds: new Set(),
        swipesLoaded: true,
      })
    )

    await waitFor(() => {
      expect(result.current.moviesLoading).toBe(false)
    })

    // Set movies manually
    const newMovies = [mockMovies[0]]
    result.current.setMovies(newMovies)

    await waitFor(() => {
      expect(result.current.movies).toEqual(newMovies)
    })
  })
})
