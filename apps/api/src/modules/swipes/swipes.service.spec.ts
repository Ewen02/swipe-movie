import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SwipesService } from './swipes.service';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesService } from '../matches/matches.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { RecommendationsService } from '../recommendations/recommendations.service';

describe('SwipesService', () => {
  let service: SwipesService;
  let prisma: Record<string, any>;
  let matchesService: Record<string, jest.Mock>;
  let subscriptionService: Record<string, jest.Mock>;
  let cacheManager: Record<string, jest.Mock>;
  let recommendationsService: Record<string, jest.Mock>;

  const mockUserId = 'user-1';
  const mockRoomId = 'room-1';
  const mockMovieId = 'movie-550';
  const mockDate = new Date('2025-01-01T00:00:00Z');

  const mockSwipe = {
    id: 'swipe-1',
    userId: mockUserId,
    roomId: mockRoomId,
    movieId: mockMovieId,
    value: true,
    createdAt: mockDate,
  };

  beforeEach(async () => {
    prisma = {
      roomMember: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      swipe: {
        findUnique: jest.fn(),
        count: jest.fn(),
        upsert: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        groupBy: jest.fn(),
      },
      room: {
        findUnique: jest.fn(),
      },
      match: {
        count: jest.fn(),
      },
    };

    matchesService = {
      createIfNeeded: jest.fn().mockResolvedValue(null),
      deleteMatch: jest.fn().mockResolvedValue(true),
    };

    subscriptionService = {
      checkLimit: jest.fn().mockResolvedValue({ allowed: true, limit: -1 }),
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    recommendationsService = {
      invalidateRoomRecommendationsCache: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwipesService,
        { provide: PrismaService, useValue: prisma },
        { provide: MatchesService, useValue: matchesService },
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: RecommendationsService, useValue: recommendationsService },
      ],
    }).compile();

    service = module.get<SwipesService>(SwipesService);
  });

  describe('create', () => {
    beforeEach(() => {
      prisma.roomMember.findUnique.mockResolvedValue({
        roomId: mockRoomId,
        userId: mockUserId,
      });
      prisma.swipe.findUnique.mockResolvedValue(null); // no existing swipe
      prisma.swipe.count.mockResolvedValue(0);
      prisma.swipe.upsert.mockResolvedValue(mockSwipe);
    });

    it('should create a swipe and return it with matchCreated=false', async () => {
      const result = await service.create(mockUserId, mockRoomId, mockMovieId, true);

      expect(result).toEqual({ ...mockSwipe, matchCreated: false });
      expect(prisma.swipe.upsert).toHaveBeenCalledWith({
        where: {
          userId_roomId_movieId: {
            userId: mockUserId,
            roomId: mockRoomId,
            movieId: mockMovieId,
          },
        },
        update: { value: true },
        create: {
          userId: mockUserId,
          roomId: mockRoomId,
          movieId: mockMovieId,
          value: true,
        },
        select: {
          id: true,
          userId: true,
          roomId: true,
          movieId: true,
          value: true,
          createdAt: true,
        },
      });
    });

    it('should return matchCreated=true when a match is detected', async () => {
      const mockMatch = { id: 'match-1', roomId: mockRoomId, movieId: mockMovieId, createdAt: mockDate };
      matchesService.createIfNeeded.mockResolvedValue(mockMatch);

      const result = await service.create(mockUserId, mockRoomId, mockMovieId, true);

      expect(result.matchCreated).toBe(true);
      expect(matchesService.createIfNeeded).toHaveBeenCalledWith(mockRoomId, mockMovieId);
    });

    it('should not check match detection for dislike swipes', async () => {
      prisma.swipe.upsert.mockResolvedValue({ ...mockSwipe, value: false });

      const result = await service.create(mockUserId, mockRoomId, mockMovieId, false);

      expect(result.matchCreated).toBe(false);
      expect(matchesService.createIfNeeded).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not a room member', async () => {
      prisma.roomMember.findUnique.mockResolvedValue(null);

      await expect(
        service.create(mockUserId, mockRoomId, mockMovieId, true),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when swipe limit is reached', async () => {
      prisma.swipe.findUnique.mockResolvedValue(null); // new swipe
      prisma.swipe.count.mockResolvedValue(20);
      subscriptionService.checkLimit.mockResolvedValue({ allowed: false, limit: 20 });

      await expect(
        service.create(mockUserId, mockRoomId, mockMovieId, true),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should skip swipe limit check for existing swipe updates', async () => {
      prisma.swipe.findUnique.mockResolvedValue(mockSwipe); // existing swipe

      await service.create(mockUserId, mockRoomId, mockMovieId, false);

      // checkLimit should NOT be called because swipe already exists
      expect(subscriptionService.checkLimit).not.toHaveBeenCalled();
      expect(prisma.swipe.upsert).toHaveBeenCalled();
    });

    it('should invalidate user swipes cache and recommendations cache', async () => {
      await service.create(mockUserId, mockRoomId, mockMovieId, true);

      expect(cacheManager.del).toHaveBeenCalledWith(`swipes:user:${mockUserId}:room:${mockRoomId}`);
      expect(recommendationsService.invalidateRoomRecommendationsCache).toHaveBeenCalledWith(mockRoomId);
    });
  });

  describe('findByRoom', () => {
    it('should return all swipes for a room', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.swipe.findMany.mockResolvedValue([mockSwipe]);

      const result = await service.findByRoom(mockRoomId);

      expect(result).toEqual([mockSwipe]);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findByRoom(mockRoomId)).rejects.toThrow(NotFoundException);
    });

    it('should verify membership when userId is provided', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.roomMember.findUnique.mockResolvedValue(null);

      await expect(service.findByRoom(mockRoomId, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findByUserInRoom', () => {
    it('should return cached swipes on cache hit', async () => {
      const cachedSwipes = [mockSwipe];
      cacheManager.get.mockResolvedValue(cachedSwipes);

      const result = await service.findByUserInRoom(mockUserId, mockRoomId);

      expect(result).toEqual(cachedSwipes);
      expect(prisma.swipe.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from DB on cache miss and cache the result', async () => {
      cacheManager.get.mockResolvedValue(null);
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.swipe.findMany.mockResolvedValue([mockSwipe]);

      const result = await service.findByUserInRoom(mockUserId, mockRoomId);

      expect(result).toEqual([mockSwipe]);
      expect(cacheManager.set).toHaveBeenCalledWith(
        `swipes:user:${mockUserId}:room:${mockRoomId}`,
        [mockSwipe],
        2 * 60 * 1000,
      );
    });

    it('should throw NotFoundException when room does not exist', async () => {
      cacheManager.get.mockResolvedValue(null);
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findByUserInRoom(mockUserId, mockRoomId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a swipe and return { deleted: true }', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.swipe.findUnique.mockResolvedValue({ ...mockSwipe, value: false });
      prisma.swipe.delete.mockResolvedValue(mockSwipe);

      const result = await service.delete(mockUserId, mockRoomId, mockMovieId);

      expect(result).toEqual({ deleted: true });
    });

    it('should return { deleted: false } when swipe does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.swipe.findUnique.mockResolvedValue(null);

      const result = await service.delete(mockUserId, mockRoomId, mockMovieId);

      expect(result).toEqual({ deleted: false });
    });

    it('should delete associated match when a like swipe is removed and less than 2 likes remain', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.swipe.findUnique.mockResolvedValue({ ...mockSwipe, value: true });
      prisma.swipe.delete.mockResolvedValue(mockSwipe);
      prisma.swipe.count.mockResolvedValue(1); // only 1 like remaining

      await service.delete(mockUserId, mockRoomId, mockMovieId);

      expect(matchesService.deleteMatch).toHaveBeenCalledWith(mockRoomId, mockMovieId);
    });

    it('should not delete match when 2 or more likes remain', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: mockRoomId });
      prisma.swipe.findUnique.mockResolvedValue({ ...mockSwipe, value: true });
      prisma.swipe.delete.mockResolvedValue(mockSwipe);
      prisma.swipe.count.mockResolvedValue(2); // still enough likes

      await service.delete(mockUserId, mockRoomId, mockMovieId);

      expect(matchesService.deleteMatch).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(
        service.delete(mockUserId, mockRoomId, mockMovieId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return all swipes for a user', async () => {
      prisma.swipe.findMany.mockResolvedValue([mockSwipe]);

      const result = await service.findByUser(mockUserId);

      expect(result).toEqual([mockSwipe]);
      expect(prisma.swipe.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });
  });

  describe('getUserStats', () => {
    it('should return zeroed stats when user has no rooms', async () => {
      prisma.roomMember.findMany.mockResolvedValue([]);

      const result = await service.getUserStats(mockUserId);

      expect(result).toEqual({
        totalMatches: 0,
        totalSwipes: 0,
        totalSwipesToday: 0,
      });
    });

    it('should return aggregated stats across rooms', async () => {
      prisma.roomMember.findMany.mockResolvedValue([
        { roomId: 'room-1' },
        { roomId: 'room-2' },
      ]);
      prisma.swipe.count
        .mockResolvedValueOnce(15) // totalSwipes
        .mockResolvedValueOnce(3); // totalSwipesToday
      prisma.match.count.mockResolvedValue(5);

      const result = await service.getUserStats(mockUserId);

      expect(result).toEqual({
        totalMatches: 5,
        totalSwipes: 15,
        totalSwipesToday: 3,
      });
    });
  });

  describe('getRoomAnalytics', () => {
    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.getRoomAnalytics(mockRoomId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: mockRoomId,
        members: [
          { user: { id: 'other-user', name: 'Other' } },
        ],
      });

      await expect(service.getRoomAnalytics(mockRoomId, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return analytics for a valid room member', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: mockRoomId,
        members: [
          { user: { id: mockUserId, name: 'Alice' } },
          { user: { id: 'user-2', name: 'Bob' } },
        ],
      });

      prisma.swipe.groupBy
        .mockResolvedValueOnce([ // overview stats
          { value: true, _count: { id: 10 } },
          { value: false, _count: { id: 5 } },
        ])
        .mockResolvedValueOnce([ // member stats
          { userId: mockUserId, value: true, _count: { id: 7 } },
          { userId: mockUserId, value: false, _count: { id: 3 } },
          { userId: 'user-2', value: true, _count: { id: 3 } },
          { userId: 'user-2', value: false, _count: { id: 2 } },
        ])
        .mockResolvedValueOnce([ // movie stats
          { movieId: 'movie-1', value: true, _count: { id: 2 } },
          { movieId: 'movie-1', value: false, _count: { id: 1 } },
        ]);

      prisma.match.count.mockResolvedValue(2);

      prisma.swipe.findMany.mockResolvedValue([]); // recent swipes

      const result = await service.getRoomAnalytics(mockRoomId, mockUserId);

      expect(result.overview.totalSwipes).toBe(15);
      expect(result.overview.totalLikes).toBe(10);
      expect(result.overview.totalDislikes).toBe(5);
      expect(result.overview.totalMatches).toBe(2);
      expect(result.memberActivity).toHaveLength(2);
      expect(result.dailyActivity).toHaveLength(7);
    });
  });
});
