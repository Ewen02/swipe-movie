import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../../infra/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    room: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    roomMember: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a room successfully', async () => {
      const userId = 'user-123';
      const createRoomDto = {
        name: 'Test Room',
        type: 'MOVIE' as const,
        genreId: 28,
        capacity: 10,
      };

      const mockRoom = {
        id: 'room-123',
        code: 'ABC123',
        ...createRoomDto,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        members: [],
      };

      mockPrismaService.room.create.mockResolvedValue(mockRoom);

      const result = await service.create(createRoomDto, userId);

      expect(result).toEqual(mockRoom);
      expect(mockPrismaService.room.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: createRoomDto.name,
            type: createRoomDto.type,
            genreId: createRoomDto.genreId,
            createdBy: userId,
          }),
        }),
      );
    });

    it('should generate a unique 6-character code', async () => {
      const userId = 'user-123';
      const createRoomDto = {
        name: 'Test Room',
        type: 'MOVIE' as const,
      };

      mockPrismaService.room.create.mockResolvedValue({
        id: 'room-123',
        code: 'XYZ789',
        ...createRoomDto,
        createdBy: userId,
      });

      await service.create(createRoomDto, userId);

      expect(mockPrismaService.room.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            code: expect.any(String),
          }),
        }),
      );
    });
  });

  describe('findByCode', () => {
    it('should find a room by code', async () => {
      const code = 'ABC123';
      const mockRoom = {
        id: 'room-123',
        code,
        name: 'Test Room',
        type: 'MOVIE',
        members: [],
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);

      const result = await service.findByCode(code);

      expect(result).toEqual(mockRoom);
      expect(mockPrismaService.room.findUnique).toHaveBeenCalledWith({
        where: { code },
        include: { members: true },
      });
    });

    it('should throw NotFoundException when room not found', async () => {
      const code = 'INVALID';

      mockPrismaService.room.findUnique.mockResolvedValue(null);

      await expect(service.findByCode(code)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for deleted rooms', async () => {
      const code = 'ABC123';
      const mockDeletedRoom = {
        id: 'room-123',
        code,
        deletedAt: new Date(),
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockDeletedRoom);

      await expect(service.findByCode(code)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('joinRoom', () => {
    it('should join a room successfully', async () => {
      const code = 'ABC123';
      const userId = 'user-123';
      const mockRoom = {
        id: 'room-123',
        code,
        capacity: 10,
        members: [],
        deletedAt: null,
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.roomMember.findFirst.mockResolvedValue(null);
      mockPrismaService.roomMember.create.mockResolvedValue({
        roomId: mockRoom.id,
        userId,
      });

      const result = await service.joinRoom(code, userId);

      expect(result).toEqual(mockRoom);
      expect(mockPrismaService.roomMember.create).toHaveBeenCalledWith({
        data: {
          roomId: mockRoom.id,
          userId,
        },
      });
    });

    it('should not create duplicate membership', async () => {
      const code = 'ABC123';
      const userId = 'user-123';
      const mockRoom = {
        id: 'room-123',
        code,
        members: [],
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.roomMember.findFirst.mockResolvedValue({
        roomId: mockRoom.id,
        userId,
      });

      const result = await service.joinRoom(code, userId);

      expect(result).toEqual(mockRoom);
      expect(mockPrismaService.roomMember.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when room is full', async () => {
      const code = 'ABC123';
      const userId = 'user-123';
      const mockRoom = {
        id: 'room-123',
        code,
        capacity: 2,
        members: [{ userId: 'user-1' }, { userId: 'user-2' }],
        deletedAt: null,
      };

      mockPrismaService.room.findUnique.mockResolvedValue(mockRoom);
      mockPrismaService.roomMember.findFirst.mockResolvedValue(null);

      await expect(service.joinRoom(code, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findUserRooms', () => {
    it('should return user rooms with member count', async () => {
      const userId = 'user-123';
      const mockRooms = [
        {
          room: {
            id: 'room-1',
            name: 'Room 1',
            code: 'ABC123',
            members: [{ userId }, { userId: 'user-2' }],
          },
        },
        {
          room: {
            id: 'room-2',
            name: 'Room 2',
            code: 'XYZ789',
            members: [{ userId }],
          },
        },
      ];

      mockPrismaService.roomMember.findMany.mockResolvedValue(mockRooms);

      const result = await service.findUserRooms(userId);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('memberCount', 2);
      expect(result[1]).toHaveProperty('memberCount', 1);
    });

    it('should return empty array for user with no rooms', async () => {
      const userId = 'user-123';

      mockPrismaService.roomMember.findMany.mockResolvedValue([]);

      const result = await service.findUserRooms(userId);

      expect(result).toEqual([]);
    });
  });
});
