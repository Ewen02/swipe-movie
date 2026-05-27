import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesGateway } from './matches.gateway';
import { PrismaService } from '../../infra/prisma.service';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: any;
  let gateway: { emitMatchCreated: jest.Mock; emitMatchDeleted: jest.Mock };
  let cacheManager: { get: jest.Mock; set: jest.Mock; del: jest.Mock };

  beforeEach(async () => {
    // The service uses prisma.$transaction, which receives a callback.
    // We create nested mocks that the transaction callback will use.
    const txMock = {
      swipe: {
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      match: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    prisma = {
      $transaction: jest.fn((cb: (tx: typeof txMock) => Promise<any>) => cb(txMock)),
      swipe: {
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      match: {
        findMany: jest.fn(),
        count: jest.fn(),
        deleteMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      room: {
        findUnique: jest.fn(),
      },
      // Keep a reference to the tx mock for assertions
      _tx: txMock,
    };

    gateway = {
      emitMatchCreated: jest.fn(),
      emitMatchDeleted: jest.fn(),
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: PrismaService, useValue: prisma },
        { provide: MatchesGateway, useValue: gateway },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  describe('createIfNeeded', () => {
    const roomId = 'room-1';
    const movieId = 'movie-42';

    it('should create a match and emit event when all members swiped yes (likes >= 2)', async () => {
      const createdAt = new Date('2025-01-15T12:00:00Z');
      prisma._tx.swipe.count.mockResolvedValue(2);
      prisma._tx.match.findUnique.mockResolvedValue(null);
      prisma._tx.match.create.mockResolvedValue({
        id: 'match-1',
        roomId,
        movieId,
        createdAt,
      });

      const result = await service.createIfNeeded(roomId, movieId);

      expect(result).toEqual({
        id: 'match-1',
        roomId,
        movieId,
        createdAt,
        voteCount: 2,
      });
      expect(prisma._tx.swipe.count).toHaveBeenCalledWith({
        where: { roomId, movieId, value: true },
      });
      expect(prisma._tx.match.create).toHaveBeenCalledWith({
        data: { roomId, movieId },
        select: { id: true, roomId: true, movieId: true, createdAt: true },
      });
      expect(gateway.emitMatchCreated).toHaveBeenCalledWith(roomId, {
        id: 'match-1',
        roomId,
        movieId,
        createdAt,
        voteCount: 2,
      });
      expect(cacheManager.del).toHaveBeenCalledWith(`matches:room:${roomId}`);
    });

    it('should return null and not create a match when fewer than 2 likes', async () => {
      prisma._tx.swipe.count.mockResolvedValue(1);

      const result = await service.createIfNeeded(roomId, movieId);

      expect(result).toBeNull();
      expect(prisma._tx.match.create).not.toHaveBeenCalled();
      expect(gateway.emitMatchCreated).not.toHaveBeenCalled();
    });

    it('should return null and not create a match when zero likes', async () => {
      prisma._tx.swipe.count.mockResolvedValue(0);

      const result = await service.createIfNeeded(roomId, movieId);

      expect(result).toBeNull();
      expect(prisma._tx.match.findUnique).not.toHaveBeenCalled();
      expect(prisma._tx.match.create).not.toHaveBeenCalled();
    });

    it('should return null without emitting when match already exists (duplicate)', async () => {
      prisma._tx.swipe.count.mockResolvedValue(3);
      prisma._tx.match.findUnique.mockResolvedValue({ id: 'existing-match' });

      const result = await service.createIfNeeded(roomId, movieId);

      expect(result).toBeNull();
      expect(prisma._tx.match.findUnique).toHaveBeenCalledWith({
        where: { roomId_movieId: { roomId, movieId } },
        select: { id: true },
      });
      expect(prisma._tx.match.create).not.toHaveBeenCalled();
      expect(gateway.emitMatchCreated).not.toHaveBeenCalled();
    });

    it('should pass serializable isolation level to the transaction', async () => {
      prisma._tx.swipe.count.mockResolvedValue(0);

      await service.createIfNeeded(roomId, movieId);

      expect(prisma.$transaction).toHaveBeenCalledWith(
        expect.any(Function),
        { isolationLevel: 'Serializable' },
      );
    });
  });

  describe('deleteMatch', () => {
    const roomId = 'room-1';
    const movieId = 'movie-42';

    it('should return true and emit event when match is deleted', async () => {
      prisma.match.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteMatch(roomId, movieId);

      expect(result).toBe(true);
      expect(cacheManager.del).toHaveBeenCalledWith(`matches:room:${roomId}`);
      expect(gateway.emitMatchDeleted).toHaveBeenCalledWith(roomId, movieId);
    });

    it('should return false when no match exists to delete', async () => {
      prisma.match.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.deleteMatch(roomId, movieId);

      expect(result).toBe(false);
      expect(gateway.emitMatchDeleted).not.toHaveBeenCalled();
    });
  });

  describe('findByRoom', () => {
    const roomId = 'room-1';

    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findByRoom(roomId)).rejects.toThrow(NotFoundException);
    });

    it('should return cached matches when cache is available (no pagination)', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: roomId });
      const cachedData = [
        { id: 'match-1', movieId: 'movie-1', roomId, voteCount: 2, createdAt: new Date() },
      ];
      cacheManager.get.mockResolvedValue(cachedData);

      const result = await service.findByRoom(roomId);

      expect(result).toBe(cachedData);
      expect(prisma.match.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache when cache is empty (no pagination)', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: roomId });
      cacheManager.get.mockResolvedValue(null);

      const matches = [
        { id: 'match-1', movieId: 'movie-1', roomId, createdAt: new Date() },
        { id: 'match-2', movieId: 'movie-2', roomId, createdAt: new Date() },
      ];
      prisma.match.findMany.mockResolvedValue(matches);
      prisma.swipe.groupBy.mockResolvedValue([
        { movieId: 'movie-1', _count: { id: 3 } },
        { movieId: 'movie-2', _count: { id: 2 } },
      ]);

      const result = await service.findByRoom(roomId);

      expect(result).toEqual([
        { ...matches[0], voteCount: 3 },
        { ...matches[1], voteCount: 2 },
      ]);
      expect(cacheManager.set).toHaveBeenCalledWith(
        `matches:room:${roomId}`,
        expect.any(Array),
        60 * 1000,
      );
    });

    it('should return empty array when room exists but has no matches', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: roomId });
      cacheManager.get.mockResolvedValue(null);
      prisma.match.findMany.mockResolvedValue([]);

      const result = await service.findByRoom(roomId);

      expect(result).toEqual([]);
    });
  });
});
