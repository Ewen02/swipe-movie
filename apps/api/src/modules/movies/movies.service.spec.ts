import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MoviesService } from './movies.service';
import { MovieDiscoverService } from './movie-discover.service';
import { MovieDetailsService } from './movie-details.service';
import { MovieProviderService } from './movie-provider.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { PrismaService } from '../../infra/prisma.service';
import type { MovieDetailsDto, MovieBasicDto } from './dtos/movie-response.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let tmdb: Record<string, jest.Mock>;
  let prisma: Record<string, any>;
  let cacheManager: Record<string, jest.Mock>;

  // TMDb fixture data
  const tmdbMovieDetails = {
    id: 550,
    adult: false,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg',
    genre_ids: [18, 53],
    genres: [
      { id: 18, name: 'Drama' },
      { id: 53, name: 'Thriller' },
    ],
    original_language: 'en',
    original_title: 'Fight Club',
    popularity: 61.416,
    release_date: '1999-10-15',
    overview: 'A ticking-time-bomb insomniac...',
    video: false,
    vote_average: 8.433,
    vote_count: 26280,
    budget: 63000000,
    revenue: 100853753,
    runtime: 139,
    status: 'Released',
    tagline: 'Mischief. Mayhem. Soap.',
    homepage: 'http://www.foxmovies.com/movies/fight-club',
    imdb_id: 'tt0137523',
    production_companies: [
      { id: 508, name: 'Regency Enterprises', origin_country: 'US' },
    ],
    production_countries: [
      { iso_3166_1: 'US', name: 'United States of America' },
    ],
    spoken_languages: [
      { iso_639_1: 'en', english_name: 'English', name: 'English' },
    ],
    videos: {
      results: [
        {
          id: 'vid-1',
          key: 'SUXWAEX2jlg',
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ],
    },
    credits: {
      cast: [
        {
          id: 819,
          name: 'Edward Norton',
          character: 'The Narrator',
          profile_path: '/5XBz.jpg',
        },
      ],
      crew: [
        {
          id: 7467,
          name: 'David Fincher',
          job: 'Director',
          department: 'Directing',
        },
        {
          id: 9999,
          name: 'Some Gaffer',
          job: 'Gaffer',
          department: 'Lighting',
        },
      ],
    },
    similar: {
      results: [
        {
          id: 680,
          adult: false,
          title: 'Pulp Fiction',
          poster_path: '/pulp.jpg',
          backdrop_path: '/pulpbg.jpg',
          genre_ids: [53, 80],
          original_language: 'en',
          original_title: 'Pulp Fiction',
          popularity: 50,
          release_date: '1994-09-10',
          overview: 'A burger-loving hit man...',
          video: false,
          vote_average: 8.5,
          vote_count: 20000,
        },
      ],
    },
    external_ids: {
      imdb_id: 'tt0137523',
      facebook_id: 'FightClub',
      instagram_id: null,
      twitter_id: null,
    },
  };

  const tmdbWatchProvidersResponse = {
    results: {
      FR: {
        flatrate: [
          {
            provider_id: 8,
            provider_name: 'Netflix',
            logo_path: '/netflix.png',
          },
          {
            provider_id: 9,
            provider_name: 'Netflix Amazon Channel',
            logo_path: '/netflix-amazon.png',
          },
        ],
      },
    },
  };

  const tmdbPopularResponse = {
    results: [
      {
        id: 550,
        adult: false,
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        backdrop_path: '/backdrop.jpg',
        genre_ids: [18, 53],
        original_language: 'en',
        original_title: 'Fight Club',
        popularity: 61.416,
        release_date: '1999-10-15',
        overview: 'A ticking-time-bomb insomniac...',
        video: false,
        vote_average: 8.433,
        vote_count: 26280,
      },
    ],
  };

  const tmdbGenresResponse = {
    genres: [
      { id: 28, name: 'Action' },
      { id: 18, name: 'Drama' },
    ],
  };

  beforeEach(async () => {
    tmdb = {
      fetchJson: jest.fn(),
    };

    prisma = {
      swipe: {
        count: jest.fn(),
      },
      match: {
        count: jest.fn(),
      },
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        MovieDiscoverService,
        MovieDetailsService,
        MovieProviderService,
        { provide: TmdbService, useValue: tmdb },
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('getMovieDetails', () => {
    it('should return a mapped MovieDetailsDto on cache miss', async () => {
      tmdb.fetchJson
        .mockResolvedValueOnce(tmdbMovieDetails) // movie details
        .mockResolvedValueOnce(tmdbWatchProvidersResponse); // watch providers

      const result = await service.getMovieDetails(550);

      expect(result.id).toBe(550);
      expect(result.title).toBe('Fight Club');
      expect(result.budget).toBe(63000000);
      expect(result.runtime).toBe(139);
      expect(result.genres).toEqual([
        { id: 18, name: 'Drama' },
        { id: 53, name: 'Thriller' },
      ]);
      expect(result.cast).toHaveLength(1);
      expect(result.cast![0].name).toBe('Edward Norton');
      // Crew should be filtered to Director/Writer/Producer only
      expect(result.crew).toHaveLength(1);
      expect(result.crew![0].job).toBe('Director');
      expect(result.similar).toHaveLength(1);
      expect(result.videos).toHaveLength(1);
      expect(result.watchProviders).toBeDefined();
      // Should cache the result
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should return cached result on cache hit', async () => {
      const cachedDetails: Partial<MovieDetailsDto> = {
        id: 550,
        title: 'Fight Club (cached)',
      };
      cacheManager.get.mockResolvedValue(cachedDetails);

      const result = await service.getMovieDetails(550);

      expect(result.title).toBe('Fight Club (cached)');
      expect(tmdb.fetchJson).not.toHaveBeenCalled();
    });

    it('should use correct TMDb endpoint for TV type', async () => {
      tmdb.fetchJson
        .mockResolvedValueOnce({ ...tmdbMovieDetails, name: 'Breaking Bad' })
        .mockResolvedValueOnce({ results: {} });

      await service.getMovieDetails(1396, 'tv');

      expect(tmdb.fetchJson).toHaveBeenCalledWith(
        expect.stringContaining('/tv/1396'),
      );
    });

    it('should pass language and region options', async () => {
      tmdb.fetchJson
        .mockResolvedValueOnce(tmdbMovieDetails)
        .mockResolvedValueOnce({ results: {} });

      await service.getMovieDetails(550, 'movie', {
        language: 'fr-FR',
        region: 'US',
      });

      const firstCallUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(firstCallUrl).toContain('language=fr-FR');
    });
  });

  describe('getPublicStats', () => {
    it('should return stats with likeRate when enough data', async () => {
      prisma.swipe.count
        .mockResolvedValueOnce(40) // likeCount
        .mockResolvedValueOnce(60); // swipeCount
      prisma.match.count.mockResolvedValue(5);

      const result = await service.getPublicStats(550);

      expect(result.hasEnoughData).toBe(true);
      expect(result.likeRate).toBeCloseTo(40 / 60);
      expect(result.swipeCount).toBe(60);
      expect(result.matchCount).toBe(5);
      // Should cache the result
      expect(cacheManager.set).toHaveBeenCalledWith(
        'tmdb:public-stats:550',
        result,
        30 * 60 * 1000,
      );
    });

    it('should return null likeRate when below MIN_SWIPES_FOR_STATS threshold', async () => {
      prisma.swipe.count
        .mockResolvedValueOnce(10) // likeCount
        .mockResolvedValueOnce(30); // swipeCount (below 50)
      prisma.match.count.mockResolvedValue(1);

      const result = await service.getPublicStats(550);

      expect(result.hasEnoughData).toBe(false);
      expect(result.likeRate).toBeNull();
      expect(result.swipeCount).toBe(30);
    });

    it('should return cached stats on cache hit', async () => {
      const cached = {
        likeRate: 0.75,
        swipeCount: 100,
        matchCount: 10,
        hasEnoughData: true,
      };
      cacheManager.get.mockResolvedValue(cached);

      const result = await service.getPublicStats(550);

      expect(result).toEqual(cached);
      expect(prisma.swipe.count).not.toHaveBeenCalled();
    });
  });

  describe('getWatchProviders', () => {
    it('should return deduplicated providers for the given region', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbWatchProvidersResponse);

      const result = await service.getWatchProviders(550, 'movie', 'FR');

      // Netflix and Netflix Amazon Channel should be deduplicated
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Netflix');
      expect(result[0].id).toBe(8);
      expect(result[0].logoPath).toContain('/netflix.png');
    });

    it('should return empty array when region has no providers', async () => {
      tmdb.fetchJson.mockResolvedValue({ results: {} });

      const result = await service.getWatchProviders(550, 'movie', 'XX');

      expect(result).toEqual([]);
      expect(cacheManager.set).toHaveBeenCalled(); // empty result is still cached
    });

    it('should return empty array when no flatrate providers', async () => {
      tmdb.fetchJson.mockResolvedValue({
        results: { FR: { buy: [{ provider_id: 1, provider_name: 'iTunes', logo_path: '' }] } },
      });

      const result = await service.getWatchProviders(550, 'movie', 'FR');

      expect(result).toEqual([]);
    });

    it('should return cached providers on cache hit', async () => {
      const cached = [{ id: 8, name: 'Netflix', logoPath: '/logo.png' }];
      cacheManager.get.mockResolvedValue(cached);

      const result = await service.getWatchProviders(550);

      expect(result).toEqual(cached);
      expect(tmdb.fetchJson).not.toHaveBeenCalled();
    });

    it('should use correct endpoint for TV type', async () => {
      tmdb.fetchJson.mockResolvedValue({ results: {} });

      await service.getWatchProviders(1396, 'tv', 'FR');

      expect(tmdb.fetchJson).toHaveBeenCalledWith('/tv/1396/watch/providers');
    });

    it('should return empty array on TMDb API error', async () => {
      tmdb.fetchJson.mockRejectedValue(new Error('TMDb API down'));

      const result = await service.getWatchProviders(550);

      expect(result).toEqual([]);
    });
  });

  describe('getPopularMovies', () => {
    it('should return mapped MovieBasicDto array', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbPopularResponse);

      const result = await service.getPopularMovies(1, 'FR');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(550);
      expect(result[0].title).toBe('Fight Club');
      expect(result[0].posterUrl).toContain('/poster.jpg');
      expect(result[0].backdropUrl).toContain('/backdrop.jpg');
      expect(result[0].genreIds).toEqual([18, 53]);
    });

    it('should return empty array when TMDb returns no results', async () => {
      tmdb.fetchJson.mockResolvedValue({ results: [] });

      const result = await service.getPopularMovies();

      expect(result).toEqual([]);
    });

    it('should handle missing results field', async () => {
      tmdb.fetchJson.mockResolvedValue({});

      const result = await service.getPopularMovies();

      expect(result).toEqual([]);
    });
  });

  describe('getGenres', () => {
    it('should return mapped genre list', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbGenresResponse);

      const result = await service.getGenres();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 28, name: 'Action' });
      expect(result[1]).toEqual({ id: 18, name: 'Drama' });
    });

    it('should return cached genres on cache hit', async () => {
      const cached = [{ id: 28, name: 'Action' }];
      cacheManager.get.mockResolvedValue(cached);

      const result = await service.getGenres();

      expect(result).toEqual(cached);
      expect(tmdb.fetchJson).not.toHaveBeenCalled();
    });
  });

  describe('getMoviesByGenre', () => {
    it('should return movies for a genre with default filters', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbPopularResponse);

      const result = await service.getMoviesByGenre(28);

      expect(result).toHaveLength(1);
      const callUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(callUrl).toContain('with_genres=28');
    });

    it('should not add with_genres when genreId is 0 (all genres)', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbPopularResponse);

      await service.getMoviesByGenre(0);

      const callUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(callUrl).not.toContain('with_genres');
    });

    it('should apply filters when provided', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbPopularResponse);

      await service.getMoviesByGenre(28, 'movie', 1, {
        minRating: 7,
        releaseYearMin: 2020,
        releaseYearMax: 2024,
        runtimeMin: 60,
        runtimeMax: 180,
        watchProviders: [8],
        watchRegion: 'US',
        originalLanguage: 'en',
      });

      const callUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(callUrl).toContain('vote_average.gte=7');
      expect(callUrl).toContain('primary_release_date.gte=2020-01-01');
      expect(callUrl).toContain('primary_release_date.lte=2024-12-31');
      expect(callUrl).toContain('with_runtime.gte=60');
      expect(callUrl).toContain('with_runtime.lte=180');
      expect(callUrl).toContain('watch_region=US');
      expect(callUrl).toContain('with_original_language=en');
    });

    it('should use TV date params for TV type', async () => {
      tmdb.fetchJson.mockResolvedValue({ results: [] });

      await service.getMoviesByGenre(28, 'tv', 1, {
        releaseYearMin: 2020,
        releaseYearMax: 2024,
      });

      const callUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(callUrl).toContain('first_air_date.gte=2020-01-01');
      expect(callUrl).toContain('first_air_date.lte=2024-12-31');
    });

    it('should return cached result on cache hit', async () => {
      const cached: MovieBasicDto[] = [{ id: 1, title: 'Cached' } as MovieBasicDto];
      cacheManager.get.mockResolvedValue(cached);

      const result = await service.getMoviesByGenre(28);

      expect(result).toEqual(cached);
      expect(tmdb.fetchJson).not.toHaveBeenCalled();
    });
  });

  describe('searchMovies', () => {
    it('should search and return mapped results', async () => {
      tmdb.fetchJson.mockResolvedValue(tmdbPopularResponse);

      const result = await service.searchMovies('Fight Club');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Fight Club');
      const callUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(callUrl).toContain('query=Fight+Club');
    });

    it('should use correct endpoint for TV search', async () => {
      tmdb.fetchJson.mockResolvedValue({ results: [] });

      await service.searchMovies('Breaking Bad', 'tv');

      const callUrl = tmdb.fetchJson.mock.calls[0][0] as string;
      expect(callUrl).toContain('/search/tv');
    });
  });

  describe('getBatchMovieDetails', () => {
    it('should return details for successful fetches and skip failures', async () => {
      // getBatchMovieDetails delegates to MovieDetailsService.getBatchMovieDetails,
      // which internally calls its own getMovieDetails. We spy on the inner service.
      const movieDetailsService = service['movieDetailsService'] as MovieDetailsService;
      const details550 = { id: 550, title: 'Fight Club' } as MovieDetailsDto;
      const details680 = { id: 680, title: 'Pulp Fiction' } as MovieDetailsDto;

      jest
        .spyOn(movieDetailsService, 'getMovieDetails')
        .mockResolvedValueOnce(details550)
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce(details680);

      const result = await service.getBatchMovieDetails([550, 999, 680]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(550);
      expect(result[1].id).toBe(680);
    });
  });

  describe('clearCache', () => {
    it('should call cacheManager.clear()', async () => {
      await service.clearCache();

      expect(cacheManager.clear).toHaveBeenCalled();
    });
  });
});
