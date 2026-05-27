import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RecommendationsService } from './recommendations.service';
import { PrismaService } from '../../infra/prisma.service';
import { MoviesService } from '../movies/movies.service';
import type { RoomRecommendationContext, MovieBasic } from '@swipe-movie/types';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let prisma: Record<string, any>;
  let moviesService: { getMoviesByGenre: jest.Mock };
  let cacheManager: { get: jest.Mock; set: jest.Mock; del: jest.Mock };

  const mockContext: RoomRecommendationContext = {
    roomId: 'room-1',
    memberIds: ['user-1', 'user-2'],
    type: 'movie',
    genreId: 28,
  };

  function createMockMovie(overrides: Partial<MovieBasic> = {}): MovieBasic {
    return {
      id: 550,
      adult: false,
      title: 'Fight Club',
      posterUrl: '/poster.jpg',
      backdropUrl: '/backdrop.jpg',
      genreIds: [28, 18],
      originalLanguage: 'en',
      originalTitle: 'Fight Club',
      popularity: 50,
      releaseDate: '1999-10-15',
      overview: 'A movie about fight club',
      video: false,
      voteAverage: 8.4,
      voteCount: 25000,
      ...overrides,
    };
  }

  beforeEach(async () => {
    prisma = {
      userMediaLibrary: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
      },
    };

    moviesService = {
      getMoviesByGenre: jest.fn().mockResolvedValue([]),
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: MoviesService, useValue: moviesService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  // =========================================
  // getRecommendedMoviesForRoom
  // =========================================
  describe('getRecommendedMoviesForRoom', () => {
    it('should return scored movies sorted by recommendation score', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'Low Score', voteAverage: 5.0, voteCount: 50, popularity: 10 }),
        createMockMovie({ id: 2, title: 'High Score', voteAverage: 9.0, voteCount: 30000, popularity: 100 }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      expect(result).toHaveLength(2);
      // High Score should be first (higher voteAverage and voteCount)
      expect(result[0].title).toBe('High Score');
      expect(result[0].recommendationScore).toBeGreaterThan(0);
      expect(result[1].title).toBe('Low Score');
    });

    it('should return cached results on cache hit', async () => {
      const cachedMovies = [
        { ...createMockMovie(), recommendationScore: 80, isWatched: false },
      ];
      cacheManager.get.mockResolvedValue(cachedMovies);

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      expect(result).toEqual(cachedMovies);
      expect(moviesService.getMoviesByGenre).not.toHaveBeenCalled();
    });

    it('should fetch from TMDB and cache on cache miss', async () => {
      const movies = [createMockMovie()];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      await service.getRecommendedMoviesForRoom(mockContext, 1);

      expect(moviesService.getMoviesByGenre).toHaveBeenCalledWith(28, 'movie', 1, undefined);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'recommendations:room:room-1:page:1',
        expect.any(Array),
        expect.any(Number),
      );
    });

    it('should return empty array when no movies from TMDB', async () => {
      moviesService.getMoviesByGenre.mockResolvedValue([]);

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      expect(result).toEqual([]);
    });

    it('should filter out movies watched by ALL members', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'Watched by all' }),
        createMockMovie({ id: 2, title: 'Not watched' }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      // Both users watched movie 1
      prisma.userMediaLibrary.findMany.mockImplementation((args: any) => {
        if (args.where?.status === 'watched') {
          return Promise.resolve([
            { tmdbId: '1', userId: 'user-1' },
            { tmdbId: '1', userId: 'user-2' },
          ]);
        }
        if (args.where?.status === 'watchlist') {
          return Promise.resolve([]);
        }
        if (args.where?.rating !== undefined) {
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      });

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      // Movie 1 should be filtered out since all members watched it
      const titles = result.map((m) => m.title);
      expect(titles).not.toContain('Watched by all');
      expect(titles).toContain('Not watched');
    });

    it('should not filter movies watched by only some members', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'Watched by one' }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      // Only user-1 watched movie 1
      prisma.userMediaLibrary.findMany.mockImplementation((args: any) => {
        if (args.where?.status === 'watched') {
          return Promise.resolve([{ tmdbId: '1', userId: 'user-1' }]);
        }
        return Promise.resolve([]);
      });

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Watched by one');
    });
  });

  // =========================================
  // Scoring: watchlist boost
  // =========================================
  describe('scoring - watchlist members boost', () => {
    it('should boost score when members have movie in watchlist', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'In Watchlist', voteAverage: 7.0, voteCount: 5000 }),
        createMockMovie({ id: 2, title: 'Not in Watchlist', voteAverage: 7.0, voteCount: 5000 }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      // Movie 1 is in both users' watchlists
      prisma.userMediaLibrary.findMany.mockImplementation((args: any) => {
        if (args.where?.status === 'watchlist') {
          return Promise.resolve([
            { tmdbId: '1', userId: 'user-1' },
            { tmdbId: '1', userId: 'user-2' },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      // Movie 1 (in watchlist) should score higher than movie 2 (not in watchlist)
      const inWatchlist = result.find((m) => m.title === 'In Watchlist')!;
      const notInWatchlist = result.find((m) => m.title === 'Not in Watchlist')!;
      expect(inWatchlist.recommendationScore).toBeGreaterThan(notInWatchlist.recommendationScore!);
    });

    it('should give highest watchlist score when all members have the movie', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'All members watchlist', voteAverage: 6.0, voteCount: 200 }),
        createMockMovie({ id: 2, title: 'One member watchlist', voteAverage: 6.0, voteCount: 200 }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      prisma.userMediaLibrary.findMany.mockImplementation((args: any) => {
        if (args.where?.status === 'watchlist') {
          return Promise.resolve([
            { tmdbId: '1', userId: 'user-1' },
            { tmdbId: '1', userId: 'user-2' },
            { tmdbId: '2', userId: 'user-1' },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      const allMembers = result.find((m) => m.title === 'All members watchlist')!;
      const oneMember = result.find((m) => m.title === 'One member watchlist')!;
      // All members watchlist = 100 points vs one member = 25 points
      expect(allMembers.recommendationScore).toBeGreaterThan(oneMember.recommendationScore!);
    });
  });

  // =========================================
  // Scoring: TMDB rating factor
  // =========================================
  describe('scoring - TMDB rating factor', () => {
    it('should rank higher-rated movies above lower-rated ones', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'Low Rated', voteAverage: 4.0, voteCount: 5000, popularity: 50 }),
        createMockMovie({ id: 2, title: 'High Rated', voteAverage: 9.0, voteCount: 5000, popularity: 50 }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      expect(result[0].title).toBe('High Rated');
      expect(result[0].recommendationScore).toBeGreaterThan(result[1].recommendationScore!);
    });
  });

  // =========================================
  // Scoring: recency bonus
  // =========================================
  describe('scoring - recency bonus', () => {
    it('should give bonus to recent releases', async () => {
      const currentYear = new Date().getFullYear();
      const movies = [
        createMockMovie({ id: 1, title: 'Recent', releaseDate: `${currentYear}-06-15`, voteAverage: 7.0, voteCount: 5000 }),
        createMockMovie({ id: 2, title: 'Mid Age', releaseDate: '2015-06-15', voteAverage: 7.0, voteCount: 5000 }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      const recent = result.find((m) => m.title === 'Recent')!;
      const midAge = result.find((m) => m.title === 'Mid Age')!;
      expect(recent.recommendationScore).toBeGreaterThan(midAge.recommendationScore!);
    });

    it('should give bonus to classic movies (20+ years old)', async () => {
      const movies = [
        createMockMovie({ id: 1, title: 'Classic', releaseDate: '1990-06-15', voteAverage: 7.0, voteCount: 5000 }),
        createMockMovie({ id: 2, title: 'Mid Age', releaseDate: '2015-06-15', voteAverage: 7.0, voteCount: 5000 }),
      ];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      const result = await service.getRecommendedMoviesForRoom(mockContext, 1);

      const classic = result.find((m) => m.title === 'Classic')!;
      const midAge = result.find((m) => m.title === 'Mid Age')!;
      expect(classic.recommendationScore).toBeGreaterThan(midAge.recommendationScore!);
    });
  });

  // =========================================
  // Empty room edge case
  // =========================================
  describe('empty room (no members)', () => {
    it('should return empty results when room has no members', async () => {
      const emptyContext: RoomRecommendationContext = {
        roomId: 'room-empty',
        memberIds: [],
        type: 'movie',
        genreId: 28,
      };
      const movies = [createMockMovie()];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      const result = await service.getRecommendedMoviesForRoom(emptyContext, 1);

      // With 0 members, watchedByCount (0) is not < memberCount (0),
      // so all movies are filtered out — this is expected behavior
      expect(result).toHaveLength(0);
    });

    it('should work correctly with a single member', async () => {
      const singleMemberContext: RoomRecommendationContext = {
        roomId: 'room-single',
        memberIds: ['user-1'],
        type: 'movie',
        genreId: 28,
      };
      const movies = [createMockMovie()];
      moviesService.getMoviesByGenre.mockResolvedValue(movies);

      const result = await service.getRecommendedMoviesForRoom(singleMemberContext, 1);

      expect(result).toHaveLength(1);
      expect(result[0].recommendationScore).toBeGreaterThan(0);
    });
  });

  // =========================================
  // invalidateRoomRecommendationsCache
  // =========================================
  describe('invalidateRoomRecommendationsCache', () => {
    it('should delete cache entries for all pages', async () => {
      await service.invalidateRoomRecommendationsCache('room-1');

      // Should delete pages 1-20
      expect(cacheManager.del).toHaveBeenCalledTimes(20);
      expect(cacheManager.del).toHaveBeenCalledWith('recommendations:room:room-1:page:1');
      expect(cacheManager.del).toHaveBeenCalledWith('recommendations:room:room-1:page:20');
    });
  });

  // =========================================
  // getUserMediaLibrary
  // =========================================
  describe('getUserMediaLibrary', () => {
    it('should return user media library entries', async () => {
      const entries = [
        { tmdbId: '550', status: 'watched', source: 'trakt' },
        { tmdbId: '680', status: 'watchlist', source: 'manual' },
      ];
      prisma.userMediaLibrary.findMany.mockResolvedValue(entries);

      const result = await service.getUserMediaLibrary('user-1');

      expect(result).toEqual(entries);
      expect(prisma.userMediaLibrary.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        select: { tmdbId: true, status: true, source: true },
      });
    });
  });

  // =========================================
  // getWatchedByUsers
  // =========================================
  describe('getWatchedByUsers', () => {
    it('should return set of watched tmdbIds', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([
        { tmdbId: '550' },
        { tmdbId: '680' },
      ]);

      const result = await service.getWatchedByUsers(['user-1', 'user-2']);

      expect(result).toBeInstanceOf(Set);
      expect(result.has('550')).toBe(true);
      expect(result.has('680')).toBe(true);
      expect(result.size).toBe(2);
    });
  });

  // =========================================
  // getWatchlistByUsers
  // =========================================
  describe('getWatchlistByUsers', () => {
    it('should return map of tmdbId to watchlist count', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([
        { tmdbId: '550' },
        { tmdbId: '550' },
        { tmdbId: '680' },
      ]);

      const result = await service.getWatchlistByUsers(['user-1', 'user-2']);

      expect(result).toBeInstanceOf(Map);
      expect(result.get('550')).toBe(2);
      expect(result.get('680')).toBe(1);
    });
  });

  // =========================================
  // isMovieWatchedByUser
  // =========================================
  describe('isMovieWatchedByUser', () => {
    it('should return true when movie is watched', async () => {
      prisma.userMediaLibrary.findFirst.mockResolvedValue({ tmdbId: '550' });

      const result = await service.isMovieWatchedByUser('user-1', '550');

      expect(result).toBe(true);
    });

    it('should return false when movie is not watched', async () => {
      prisma.userMediaLibrary.findFirst.mockResolvedValue(null);

      const result = await service.isMovieWatchedByUser('user-1', '550');

      expect(result).toBe(false);
    });
  });

  // =========================================
  // getUserLibraryStats
  // =========================================
  describe('getUserLibraryStats', () => {
    it('should return watched and watchlist counts', async () => {
      prisma.userMediaLibrary.count
        .mockResolvedValueOnce(15)  // watched
        .mockResolvedValueOnce(8);  // watchlist

      const result = await service.getUserLibraryStats('user-1');

      expect(result).toEqual({ watched: 15, watchlist: 8 });
    });
  });

  // =========================================
  // getBatchMovieStatus
  // =========================================
  describe('getBatchMovieStatus', () => {
    it('should return status map for given tmdbIds', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([
        { tmdbId: '550', status: 'watched', source: 'trakt' },
        { tmdbId: '680', status: 'watchlist', source: 'manual' },
      ]);

      const result = await service.getBatchMovieStatus('user-1', ['550', '680']);

      expect(result).toBeInstanceOf(Map);
      expect(result.get('550')).toEqual({ tmdbId: '550', status: 'watched', source: 'trakt' });
      expect(result.get('680')).toEqual({ tmdbId: '680', status: 'watchlist', source: 'manual' });
    });

    it('should return empty map when no matches', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([]);

      const result = await service.getBatchMovieStatus('user-1', ['999']);

      expect(result.size).toBe(0);
    });
  });
});
