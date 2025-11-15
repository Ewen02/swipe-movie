import { Test, TestingModule } from '@nestjs/testing';
import { SwipesService } from './swipes.service';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesGateway } from '../matches/matches.gateway';
import { NotFoundException } from '@nestjs/common';

describe('SwipesService', () => {
  let service: SwipesService;
  let prisma: PrismaService;
  let matchesGateway: MatchesGateway;

  const mockPrismaService = {
    swipe: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    match: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    room: {
      findUnique: jest.fn(),
    },
    roomMember: {
      count: jest.fn(),
    },
  };

  const mockMatchesGateway = {
    notifyMatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwipesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: MatchesGateway,
          useValue: mockMatchesGateway,
        },
      ],
    }).compile();

    service = module.get<SwipesService>(SwipesService);
    prisma = module.get<PrismaService>(PrismaService);
    matchesGateway = module.get<MatchesGateway>(MatchesGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a swipe successfully', async () => {
      const roomId = 'room-123';
      const userId = 'user-123';
      const movieId = 'movie-456';
      const value = true;

      const mockRoom = {
        id: roomId,
        members: [{ userId }, { userId: 'user-2' }],
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.swipe.create.mockResolvedValue({
        id: 'swipe-123',
        roomId,
        userId,
        movieId,
        value,
      });
      mockPrismaService.swipe.count.mockResolvedValue(1);
      mockPrismaService.roomMember.count.mockResolvedValue(2);

      const result = await service.create(roomId, userId, movieId, value);

      expect(result).toHaveProperty('swipe');
      expect(result.matchCreated).toBe(false);
      expect(mockPrismaService.swipe.create).toHaveBeenCalledWith({
        data: { roomId, userId, movieId, value },
      });
    });

    it('should create a match when all members like the movie', async () => {
      const roomId = 'room-123';
      const userId = 'user-123';
      const movieId = 'movie-456';
      const value = true;

      const mockRoom = {
        id: roomId,
        members: [{ userId }, { userId: 'user-2' }],
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.swipe.create.mockResolvedValue({
        id: 'swipe-123',
        roomId,
        userId,
        movieId,
        value,
      });
      mockPrismaService.swipe.count.mockResolvedValue(2); // Both members liked
      mockPrismaService.roomMember.count.mockResolvedValue(2);
      mockPrismaService.match.findUnique.mockResolvedValue(null);
      mockPrismaService.match.create.mockResolvedValue({
        id: 'match-123',
        roomId,
        movieId,
      });

      const result = await service.create(roomId, userId, movieId, value);

      expect(result.matchCreated).toBe(true);
      expect(mockPrismaService.match.create).toHaveBeenCalledWith({
        data: { roomId, movieId },
      });
      expect(mockMatchesGateway.notifyMatch).toHaveBeenCalled();
    });

    it('should not create match when not all members liked', async () => {
      const roomId = 'room-123';
      const userId = 'user-123';
      const movieId = 'movie-456';
      const value = true;

      const mockRoom = {
        id: roomId,
        members: [{ userId }, { userId: 'user-2' }, { userId: 'user-3' }],
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.swipe.create.mockResolvedValue({
        id: 'swipe-123',
        roomId,
        userId,
        movieId,
        value,
      });
      mockPrismaService.swipe.count.mockResolvedValue(2); // Only 2 out of 3
      mockPrismaService.roomMember.count.mockResolvedValue(3);

      const result = await service.create(roomId, userId, movieId, value);

      expect(result.matchCreated).toBe(false);
      expect(mockPrismaService.match.create).not.toHaveBeenCalled();
    });

    it('should not create match for dislike swipes', async () => {
      const roomId = 'room-123';
      const userId = 'user-123';
      const movieId = 'movie-456';
      const value = false; // Dislike

      const mockRoom = {
        id: roomId,
        members: [{ userId }],
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.swipe.create.mockResolvedValue({
        id: 'swipe-123',
        roomId,
        userId,
        movieId,
        value,
      });

      const result = await service.create(roomId, userId, movieId, value);

      expect(result.matchCreated).toBe(false);
      expect(mockPrismaService.swipe.count).not.toHaveBeenCalled();
      expect(mockPrismaService.match.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when room not found', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue(null);

      await expect(
        service.create('invalid-room', 'user-123', 'movie-456', true),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSwipe', () => {
    it('should delete a swipe and associated match', async () => {
      const roomId = 'room-123';
      const userId = 'user-123';
      const movieId = 'movie-456';

      const mockSwipe = {
        id: 'swipe-123',
        roomId,
        userId,
        movieId,
      };

      mockPrismaService.swipe.findUnique.mockResolvedValue(mockSwipe);
      mockPrismaService.swipe.delete.mockResolvedValue(mockSwipe);
      mockPrismaService.match.delete.mockResolvedValue({
        id: 'match-123',
        roomId,
        movieId,
      });

      await service.deleteSwipe(roomId, userId, movieId);

      expect(mockPrismaService.swipe.delete).toHaveBeenCalledWith({
        where: {
          roomId_userId_movieId: { roomId, userId, movieId },
        },
      });
      expect(mockPrismaService.match.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when swipe not found', async () => {
      mockPrismaService.swipe.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteSwipe('room-123', 'user-123', 'movie-456'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByRoom', () => {
    it('should return all swipes for a room', async () => {
      const roomId = 'room-123';
      const userId = 'user-123';

      const mockSwipes = [
        { id: 'swipe-1', roomId, userId, movieId: 'movie-1', value: true },
        { id: 'swipe-2', roomId, userId, movieId: 'movie-2', value: false },
      ];

      mockPrismaService.swipe.findMany.mockResolvedValue(mockSwipes);

      const result = await service.findByRoom(roomId, userId);

      expect(result).toEqual(mockSwipes);
      expect(mockPrismaService.swipe.findMany).toHaveBeenCalledWith({
        where: { roomId, userId },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no swipes found', async () => {
      mockPrismaService.swipe.findMany.mockResolvedValue([]);

      const result = await service.findByRoom('room-123', 'user-123');

      expect(result).toEqual([]);
    });
  });
});
