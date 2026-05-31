import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RoomCrudService } from './room-crud.service';
import { RoomMembershipService } from './room-membership.service';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../../infra/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { MatchesGateway } from '../matches/matches.gateway';
import { NestEmailService } from '../email/email.service';
import type { CreateRoomDto } from './dtos';

// Mock generateRoomCode to return a deterministic value
jest.mock('../../common/utils/code', () => ({
  generateRoomCode: jest.fn(() => 'ABC123'),
}));

describe('RoomCrudService', () => {
  let service: RoomCrudService;
  let prisma: Record<string, any>;
  let cacheManager: Record<string, jest.Mock>;
  let subscriptionService: Record<string, jest.Mock>;

  const mockUserId = 'user-1';
  const mockRoomId = 'room-1';
  const mockRoomCode = 'ABC123';
  const mockDate = new Date('2025-01-01T00:00:00Z');

  const mockRoom = {
    id: mockRoomId,
    name: 'Test Room',
    code: mockRoomCode,
    genreId: 28,
    type: 'MOVIE',
    createdBy: mockUserId,
    createdAt: mockDate,
    minRating: null,
    releaseYearMin: null,
    releaseYearMax: null,
    runtimeMin: null,
    runtimeMax: null,
    watchProviders: [8, 119],
    watchRegion: 'FR',
    originalLanguage: null,
    deletedAt: null,
  };

  beforeEach(async () => {
    prisma = {
      room: {
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn(),
      },
      roomMember: {
        create: jest.fn(),
        upsert: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    subscriptionService = {
      checkLimit: jest.fn().mockResolvedValue({ allowed: true, limit: -1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomCrudService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: SubscriptionService, useValue: subscriptionService },
        {
          provide: NestEmailService,
          useValue: { sendRoomExpiryReminder: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<RoomCrudService>(RoomCrudService);
  });

  describe('create', () => {
    const dto: CreateRoomDto = {
      type: 'movie',
      genreId: 28,
      name: 'Test Room',
      watchProviders: [8, 119],
      watchRegion: 'FR',
    };

    it('should create a room with correct code, defaults, and add creator as member', async () => {
      prisma.room.count.mockResolvedValue(0);

      prisma.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          user: { findUnique: jest.fn().mockResolvedValue({ id: mockUserId }) },
          room: { create: jest.fn().mockResolvedValue(mockRoom) },
          roomMember: {
            create: jest
              .fn()
              .mockResolvedValue({ roomId: mockRoomId, userId: mockUserId }),
          },
        };
        return cb(tx);
      });

      const result = await service.create(mockUserId, dto);

      expect(prisma.room.count).toHaveBeenCalledWith({
        where: { createdBy: mockUserId, deletedAt: null },
      });
      expect(subscriptionService.checkLimit).toHaveBeenCalledWith(
        mockUserId,
        'maxRooms',
        0,
      );
      expect(result).toEqual(mockRoom);
      expect(cacheManager.del).toHaveBeenCalledWith(`rooms:user:${mockUserId}`);
    });

    it('should throw ForbiddenException when room limit is reached', async () => {
      prisma.room.count.mockResolvedValue(3);
      subscriptionService.checkLimit.mockResolvedValue({
        allowed: false,
        limit: 3,
      });

      await expect(service.create(mockUserId, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prisma.room.count.mockResolvedValue(0);
      prisma.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          user: { findUnique: jest.fn().mockResolvedValue(null) },
          room: { create: jest.fn() },
          roomMember: { create: jest.fn() },
        };
        return cb(tx);
      });

      await expect(service.create(mockUserId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verifyOwnership', () => {
    it('should pass when user is the owner', async () => {
      prisma.room.findUnique.mockResolvedValue({ createdBy: mockUserId });

      await expect(
        service.verifyOwnership(mockRoomId, mockUserId),
      ).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      prisma.room.findUnique.mockResolvedValue({ createdBy: 'other-user' });

      await expect(
        service.verifyOwnership(mockRoomId, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyOwnership(mockRoomId, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyMembership', () => {
    it('should pass when user is a member', async () => {
      prisma.roomMember.findUnique.mockResolvedValue({
        roomId: mockRoomId,
        userId: mockUserId,
      });

      await expect(
        service.verifyMembership(mockRoomId, mockUserId),
      ).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      prisma.roomMember.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyMembership(mockRoomId, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getById', () => {
    it('should return room with members', async () => {
      const roomMembers = [
        { user: { id: 'user-1', name: 'Alice' } },
        { user: { id: 'user-2', name: 'Bob' } },
      ];

      prisma.roomMember.findUnique.mockResolvedValue({
        roomId: mockRoomId,
        userId: mockUserId,
      });
      prisma.$transaction.mockResolvedValue([mockRoom, roomMembers]);

      const result = await service.getById(mockRoomId, mockUserId);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockRoomId);
      expect(result.members).toHaveLength(2);
      expect(result.members[0]).toEqual({ id: 'user-1', name: 'Alice' });
    });

    it('should throw NotFoundException when room not found', async () => {
      prisma.roomMember.findUnique.mockResolvedValue({
        roomId: mockRoomId,
        userId: mockUserId,
      });
      prisma.$transaction.mockResolvedValue([null, []]);

      await expect(service.getById(mockRoomId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      prisma.roomMember.findUnique.mockResolvedValue(null);

      await expect(service.getById(mockRoomId, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getByCode', () => {
    it('should return cached result when available and no userId', async () => {
      const cachedResult = {
        id: mockRoomId,
        name: 'Cached Room',
        code: mockRoomCode,
        members: [],
      };
      cacheManager.get.mockResolvedValue(cachedResult);

      const result = await service.getByCode(mockRoomCode);

      expect(result).toEqual(cachedResult);
      expect(prisma.room.findUnique).not.toHaveBeenCalled();
    });

    it('should skip cache when userId is provided', async () => {
      const roomWithMembers = {
        ...mockRoom,
        members: [
          { userId: mockUserId, user: { id: mockUserId, name: 'Alice' } },
        ],
      };
      prisma.room.findUnique.mockResolvedValue(roomWithMembers);

      const result = await service.getByCode(mockRoomCode, mockUserId);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockRoomId);
    });

    it('should throw NotFoundException when room not found', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.getByCode('NOPE')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      const roomWithMembers = {
        ...mockRoom,
        members: [
          { userId: 'other-user', user: { id: 'other-user', name: 'Bob' } },
        ],
      };
      prisma.room.findUnique.mockResolvedValue(roomWithMembers);

      await expect(service.getByCode(mockRoomCode, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getUserRooms', () => {
    it('should return cached user rooms for non-paginated requests', async () => {
      const cachedRooms = { rooms: [{ id: mockRoomId, name: 'Test Room' }] };
      cacheManager.get.mockResolvedValue(cachedRooms);

      const result = await service.getUserRooms(mockUserId);

      expect(result).toEqual(cachedRooms);
      expect(prisma.room.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from DB on cache miss', async () => {
      cacheManager.get.mockResolvedValue(null);
      prisma.room.findMany.mockResolvedValue([
        {
          ...mockRoom,
          _count: { matches: 2, members: 3 },
        },
      ]);

      const result = await service.getUserRooms(mockUserId);

      expect(prisma.room.findMany).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalled();
      expect((result as any).rooms).toHaveLength(1);
      expect((result as any).rooms[0].matchCount).toBe(2);
    });
  });

  describe('expireOldRooms', () => {
    it('should soft-delete rooms older than 24 hours', async () => {
      prisma.room.updateMany.mockResolvedValue({ count: 2 });

      await service.expireOldRooms();

      expect(prisma.room.updateMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          createdAt: { lt: expect.any(Date) },
        },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});

describe('RoomMembershipService', () => {
  let service: RoomMembershipService;
  let prisma: Record<string, any>;
  let cacheManager: Record<string, jest.Mock>;
  let subscriptionService: Record<string, jest.Mock>;
  let matchesGateway: Record<string, jest.Mock>;
  let roomCrudService: Record<string, jest.Mock>;

  const mockUserId = 'user-1';
  const mockRoomId = 'room-1';
  const mockRoomCode = 'ABC123';
  const mockDate = new Date('2025-01-01T00:00:00Z');

  const mockRoom = {
    id: mockRoomId,
    name: 'Test Room',
    code: mockRoomCode,
    genreId: 28,
    type: 'MOVIE',
    createdBy: 'creator-1',
    createdAt: mockDate,
    minRating: null,
    releaseYearMin: null,
    releaseYearMax: null,
    runtimeMin: null,
    runtimeMax: null,
    watchProviders: [8, 119],
    watchRegion: 'FR',
    originalLanguage: null,
    deletedAt: null,
  };

  beforeEach(async () => {
    prisma = {
      room: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      roomMember: {
        upsert: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    subscriptionService = {
      checkLimit: jest.fn().mockResolvedValue({ allowed: true, limit: -1 }),
    };

    matchesGateway = {
      emitUserJoined: jest.fn(),
      emitUserLeft: jest.fn(),
    };

    roomCrudService = {
      invalidateUserRoomsCache: jest.fn().mockResolvedValue(undefined),
      invalidateRoomCache: jest.fn().mockResolvedValue(undefined),
      mapToRoomResponse: jest.fn().mockImplementation((room) => ({
        id: room.id,
        name: room.name,
        code: room.code,
        genreId: room.genreId,
        type: room.type,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
        watchProviders: room.watchProviders,
      })),
      verifyMembership: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomMembershipService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: MatchesGateway, useValue: matchesGateway },
        { provide: RoomCrudService, useValue: roomCrudService },
      ],
    }).compile();

    service = module.get<RoomMembershipService>(RoomMembershipService);
  });

  describe('join', () => {
    const roomWithMembers = {
      ...mockRoom,
      members: [{ userId: 'user-2', roomId: mockRoomId }],
    };

    it('should join an existing room successfully', async () => {
      prisma.room.findUnique
        .mockResolvedValueOnce(roomWithMembers)
        .mockResolvedValueOnce(mockRoom);

      prisma.roomMember.upsert.mockResolvedValue({
        roomId: mockRoomId,
        userId: mockUserId,
      });

      prisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        name: 'Test User',
      });

      const result = await service.join(mockUserId, mockRoomCode);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockRoomId);
      expect(prisma.roomMember.upsert).toHaveBeenCalled();
      expect(matchesGateway.emitUserJoined).toHaveBeenCalledWith(mockRoomId, {
        id: mockUserId,
        name: 'Test User',
      });
    });

    it('should not emit user joined event if already a member', async () => {
      const roomWithExistingMember = {
        ...mockRoom,
        members: [{ userId: mockUserId, roomId: mockRoomId }],
      };

      prisma.room.findUnique
        .mockResolvedValueOnce(roomWithExistingMember)
        .mockResolvedValueOnce(mockRoom);

      prisma.roomMember.upsert.mockResolvedValue({
        roomId: mockRoomId,
        userId: mockUserId,
      });

      prisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        name: 'Test User',
      });

      await service.join(mockUserId, mockRoomCode);

      expect(subscriptionService.checkLimit).not.toHaveBeenCalled();
      expect(matchesGateway.emitUserJoined).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.join(mockUserId, 'INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException (GONE) when room is deleted', async () => {
      prisma.room.findUnique.mockResolvedValue({
        ...roomWithMembers,
        deletedAt: new Date(),
      });

      await expect(service.join(mockUserId, mockRoomCode)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw ForbiddenException when room is full', async () => {
      prisma.room.findUnique.mockResolvedValue(roomWithMembers);
      subscriptionService.checkLimit.mockResolvedValue({
        allowed: false,
        limit: 1,
      });

      await expect(service.join(mockUserId, mockRoomCode)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should invalidate caches after joining', async () => {
      prisma.room.findUnique
        .mockResolvedValueOnce(roomWithMembers)
        .mockResolvedValueOnce(mockRoom);
      prisma.roomMember.upsert.mockResolvedValue({});
      prisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        name: 'Test',
      });

      await service.join(mockUserId, mockRoomCode);

      expect(roomCrudService.invalidateUserRoomsCache).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(roomCrudService.invalidateRoomCache).toHaveBeenCalledWith(
        mockRoomCode,
      );
    });
  });

  describe('leave', () => {
    it('should remove a member from the room', async () => {
      prisma.room.findUnique.mockResolvedValue(mockRoom);
      prisma.roomMember.deleteMany.mockResolvedValue({ count: 1 });
      prisma.roomMember.count.mockResolvedValue(1);

      const result = await service.leave(mockUserId, mockRoomId);

      expect(result).toEqual({ ok: true });
      expect(prisma.roomMember.deleteMany).toHaveBeenCalledWith({
        where: { roomId: mockRoomId, userId: mockUserId },
      });
      expect(matchesGateway.emitUserLeft).toHaveBeenCalledWith(
        mockRoomId,
        mockUserId,
      );
    });

    it('should soft-delete room when last member leaves', async () => {
      prisma.room.findUnique.mockResolvedValue(mockRoom);
      prisma.roomMember.deleteMany.mockResolvedValue({ count: 1 });
      prisma.roomMember.count.mockResolvedValue(0);
      prisma.room.update.mockResolvedValue({
        ...mockRoom,
        deletedAt: new Date(),
      });

      await service.leave(mockUserId, mockRoomId);

      expect(prisma.room.update).toHaveBeenCalledWith({
        where: { id: mockRoomId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.leave(mockUserId, mockRoomId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should invalidate caches after leaving', async () => {
      prisma.room.findUnique.mockResolvedValue(mockRoom);
      prisma.roomMember.deleteMany.mockResolvedValue({ count: 1 });
      prisma.roomMember.count.mockResolvedValue(1);

      await service.leave(mockUserId, mockRoomId);

      expect(roomCrudService.invalidateUserRoomsCache).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(roomCrudService.invalidateRoomCache).toHaveBeenCalledWith(
        mockRoomCode,
      );
    });
  });

  describe('members', () => {
    it('should return room members', async () => {
      prisma.roomMember.findMany.mockResolvedValue([
        { user: { id: 'user-1', name: 'Alice' } },
        { user: { id: 'user-2', name: 'Bob' } },
      ]);

      const result = await service.members(mockRoomId, mockUserId);

      expect(roomCrudService.verifyMembership).toHaveBeenCalledWith(
        mockRoomId,
        mockUserId,
      );
      expect(result.members).toHaveLength(2);
      expect(result.members[0]).toEqual({ id: 'user-1', name: 'Alice' });
    });

    it('should skip membership check if no userId', async () => {
      prisma.roomMember.findMany.mockResolvedValue([]);

      const result = await service.members(mockRoomId);

      expect(roomCrudService.verifyMembership).not.toHaveBeenCalled();
      expect(result.members).toHaveLength(0);
    });
  });
});

describe('RoomsService (facade)', () => {
  let service: RoomsService;
  let roomCrudService: Record<string, jest.Mock>;
  let roomMembershipService: Record<string, jest.Mock>;

  beforeEach(async () => {
    roomCrudService = {
      create: jest.fn().mockResolvedValue({ id: 'room-1' }),
      getById: jest.fn().mockResolvedValue({ id: 'room-1', members: [] }),
      getByCode: jest.fn().mockResolvedValue({ id: 'room-1', members: [] }),
      getUserRooms: jest.fn().mockResolvedValue({ rooms: [] }),
      expireOldRooms: jest.fn().mockResolvedValue(undefined),
    };

    roomMembershipService = {
      join: jest.fn().mockResolvedValue({ id: 'room-1' }),
      leave: jest.fn().mockResolvedValue({ ok: true }),
      members: jest.fn().mockResolvedValue({ members: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: RoomCrudService, useValue: roomCrudService },
        { provide: RoomMembershipService, useValue: roomMembershipService },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should delegate create to RoomCrudService', async () => {
    const dto: CreateRoomDto = { type: 'movie' };
    await service.create('user-1', dto);
    expect(roomCrudService.create).toHaveBeenCalledWith('user-1', dto);
  });

  it('should delegate join to RoomMembershipService', async () => {
    await service.join('user-1', 'ABC123');
    expect(roomMembershipService.join).toHaveBeenCalledWith('user-1', 'ABC123');
  });

  it('should delegate leave to RoomMembershipService', async () => {
    await service.leave('user-1', 'room-1');
    expect(roomMembershipService.leave).toHaveBeenCalledWith(
      'user-1',
      'room-1',
    );
  });

  it('should delegate getById to RoomCrudService', async () => {
    await service.getById('room-1', 'user-1');
    expect(roomCrudService.getById).toHaveBeenCalledWith('room-1', 'user-1');
  });

  it('should delegate getByCode to RoomCrudService', async () => {
    await service.getByCode('ABC123', 'user-1');
    expect(roomCrudService.getByCode).toHaveBeenCalledWith('ABC123', 'user-1');
  });

  it('should delegate members to RoomMembershipService', async () => {
    await service.members('room-1', 'user-1');
    expect(roomMembershipService.members).toHaveBeenCalledWith(
      'room-1',
      'user-1',
    );
  });

  it('should delegate getUserRooms to RoomCrudService', async () => {
    await service.getUserRooms('user-1');
    expect(roomCrudService.getUserRooms).toHaveBeenCalledWith(
      'user-1',
      undefined,
    );
  });

  it('should delegate expireOldRooms to RoomCrudService', async () => {
    await service.expireOldRooms();
    expect(roomCrudService.expireOldRooms).toHaveBeenCalled();
  });
});
