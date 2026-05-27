import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../infra/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: Record<string, any>;

  const mockUserId = 'user-1';
  const mockDate = new Date('2025-01-01T00:00:00Z');

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userMediaLibrary: {
        upsert: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        groupBy: jest.fn(),
      },
      swipe: { deleteMany: jest.fn() },
      roomMember: { deleteMany: jest.fn() },
      account: { deleteMany: jest.fn() },
      session: { deleteMany: jest.fn() },
      room: {
        findMany: jest.fn(),
        delete: jest.fn(),
      },
      match: { deleteMany: jest.fn(), findMany: jest.fn() },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // =========================================
  // getUserPreferences
  // =========================================
  describe('getUserPreferences', () => {
    it('should return user preferences when user exists', async () => {
      const mockPrefs = {
        watchProviders: [8, 119],
        watchRegion: 'FR',
        favoriteGenreIds: [28, 12],
        onboardingStep: 4,
        onboardingCompleted: true,
      };
      prisma.user.findUnique.mockResolvedValue(mockPrefs);

      const result = await service.getUserPreferences(mockUserId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: {
          watchProviders: true,
          watchRegion: true,
          favoriteGenreIds: true,
          onboardingStep: true,
          onboardingCompleted: true,
        },
      });
      expect(result).toEqual(mockPrefs);
    });

    it('should return null when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserPreferences(mockUserId);

      expect(result).toBeNull();
    });
  });

  // =========================================
  // updateUserPreferences
  // =========================================
  describe('updateUserPreferences', () => {
    it('should update and return preferences', async () => {
      const dto = {
        watchProviders: [337],
        watchRegion: 'US',
      };
      const updatedUser = {
        watchProviders: [337],
        watchRegion: 'US',
        favoriteGenreIds: [28],
        onboardingStep: 2,
        onboardingCompleted: false,
      };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUserPreferences(mockUserId, dto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: {
          watchProviders: [337],
          watchRegion: 'US',
        },
        select: {
          watchProviders: true,
          watchRegion: true,
          favoriteGenreIds: true,
          onboardingStep: true,
          onboardingCompleted: true,
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should only include defined fields in update data', async () => {
      const dto = { onboardingStep: 3 };
      prisma.user.update.mockResolvedValue({
        watchProviders: [],
        watchRegion: 'FR',
        favoriteGenreIds: [],
        onboardingStep: 3,
        onboardingCompleted: false,
      });

      await service.updateUserPreferences(mockUserId, dto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { onboardingStep: 3 },
        select: expect.any(Object),
      });
    });
  });

  // =========================================
  // completeOnboarding
  // =========================================
  describe('completeOnboarding', () => {
    it('should set onboardingCompleted = true and step = 4', async () => {
      const completedUser = {
        watchProviders: [8],
        watchRegion: 'FR',
        favoriteGenreIds: [28],
        onboardingStep: 4,
        onboardingCompleted: true,
      };
      prisma.user.update.mockResolvedValue(completedUser);

      const result = await service.completeOnboarding(mockUserId);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: {
          onboardingStep: 4,
          onboardingCompleted: true,
        },
        select: {
          watchProviders: true,
          watchRegion: true,
          favoriteGenreIds: true,
          onboardingStep: true,
          onboardingCompleted: true,
        },
      });
      expect(result.onboardingCompleted).toBe(true);
      expect(result.onboardingStep).toBe(4);
    });
  });

  // =========================================
  // getUserLibrary
  // =========================================
  describe('getUserLibrary', () => {
    const mockItems = [
      {
        id: 'lib-1',
        tmdbId: '123',
        mediaType: 'movie',
        status: 'watched',
        source: 'trakt',
        rating: 8.5,
        importedAt: mockDate,
      },
      {
        id: 'lib-2',
        tmdbId: '456',
        mediaType: 'movie',
        status: 'watchlist',
        source: 'manual',
        rating: null,
        importedAt: mockDate,
      },
    ];

    it('should return paginated library items', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue(mockItems);
      prisma.userMediaLibrary.count.mockResolvedValue(2);

      const result = await service.getUserLibrary(mockUserId, { page: 1, limit: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should apply status filter', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([mockItems[0]]);
      prisma.userMediaLibrary.count.mockResolvedValue(1);

      const result = await service.getUserLibrary(mockUserId, {
        status: 'watched',
        page: 1,
        limit: 20,
      });

      expect(prisma.userMediaLibrary.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, status: 'watched' },
        }),
      );
      expect(result.items).toHaveLength(1);
    });

    it('should apply source filter', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([mockItems[0]]);
      prisma.userMediaLibrary.count.mockResolvedValue(1);

      await service.getUserLibrary(mockUserId, {
        source: 'trakt',
        page: 1,
        limit: 20,
      });

      expect(prisma.userMediaLibrary.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, source: 'trakt' },
        }),
      );
    });

    it('should handle pagination correctly', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([]);
      prisma.userMediaLibrary.count.mockResolvedValue(50);

      const result = await service.getUserLibrary(mockUserId, { page: 3, limit: 10 });

      expect(prisma.userMediaLibrary.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
      expect(result.totalPages).toBe(5);
      expect(result.page).toBe(3);
    });

    it('should default to page 1 and limit 20', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([]);
      prisma.userMediaLibrary.count.mockResolvedValue(0);

      await service.getUserLibrary(mockUserId, {});

      expect(prisma.userMediaLibrary.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should map rating null to undefined in response', async () => {
      prisma.userMediaLibrary.findMany.mockResolvedValue([mockItems[1]]);
      prisma.userMediaLibrary.count.mockResolvedValue(1);

      const result = await service.getUserLibrary(mockUserId, {});

      expect(result.items[0].rating).toBeUndefined();
    });
  });

  // =========================================
  // getLibraryStats
  // =========================================
  describe('getLibraryStats', () => {
    it('should return counts grouped by status and source', async () => {
      prisma.userMediaLibrary.count.mockResolvedValue(25);
      prisma.userMediaLibrary.groupBy
        .mockResolvedValueOnce([
          { status: 'watched', _count: 10 },
          { status: 'watchlist', _count: 8 },
          { status: 'liked', _count: 7 },
        ])
        .mockResolvedValueOnce([
          { source: 'trakt', _count: 15 },
          { source: 'manual', _count: 10 },
        ]);

      const result = await service.getLibraryStats(mockUserId);

      expect(result.total).toBe(25);
      expect(result.byStatus).toEqual({
        watched: 10,
        watchlist: 8,
        liked: 7,
      });
      expect(result.bySource).toEqual({
        trakt: 15,
        manual: 10,
      });
    });

    it('should return empty maps when user has no library items', async () => {
      prisma.userMediaLibrary.count.mockResolvedValue(0);
      prisma.userMediaLibrary.groupBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.getLibraryStats(mockUserId);

      expect(result.total).toBe(0);
      expect(result.byStatus).toEqual({});
      expect(result.bySource).toEqual({});
    });
  });

  // =========================================
  // deleteUserAccount
  // =========================================
  describe('deleteUserAccount', () => {
    it('should delete all user data in a transaction', async () => {
      const txMock = {
        swipe: { deleteMany: jest.fn().mockResolvedValue({ count: 5 }) },
        roomMember: { deleteMany: jest.fn().mockResolvedValue({ count: 2 }) },
        userMediaLibrary: { deleteMany: jest.fn().mockResolvedValue({ count: 10 }) },
        account: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
        session: { deleteMany: jest.fn().mockResolvedValue({ count: 3 }) },
        room: {
          findMany: jest.fn().mockResolvedValue([]),
          delete: jest.fn(),
        },
        match: { deleteMany: jest.fn() },
        user: { delete: jest.fn().mockResolvedValue({ id: mockUserId }) },
      };

      prisma.$transaction.mockImplementation(async (cb: Function) => cb(txMock));

      await service.deleteUserAccount(mockUserId);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(txMock.swipe.deleteMany).toHaveBeenCalledWith({ where: { userId: mockUserId } });
      expect(txMock.roomMember.deleteMany).toHaveBeenCalledWith({ where: { userId: mockUserId } });
      expect(txMock.userMediaLibrary.deleteMany).toHaveBeenCalledWith({ where: { userId: mockUserId } });
      expect(txMock.account.deleteMany).toHaveBeenCalledWith({ where: { userId: mockUserId } });
      expect(txMock.session.deleteMany).toHaveBeenCalledWith({ where: { userId: mockUserId } });
      expect(txMock.user.delete).toHaveBeenCalledWith({ where: { id: mockUserId } });
    });

    it('should cascade delete owned rooms and their data', async () => {
      const ownedRooms = [{ id: 'room-1' }, { id: 'room-2' }];
      const txMock = {
        swipe: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        roomMember: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        userMediaLibrary: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        account: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        session: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        room: {
          findMany: jest.fn().mockResolvedValue(ownedRooms),
          delete: jest.fn().mockResolvedValue({}),
        },
        match: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        user: { delete: jest.fn().mockResolvedValue({ id: mockUserId }) },
      };

      prisma.$transaction.mockImplementation(async (cb: Function) => cb(txMock));

      await service.deleteUserAccount(mockUserId);

      // Should delete matches, swipes, members, and room for each owned room
      expect(txMock.match.deleteMany).toHaveBeenCalledWith({ where: { roomId: 'room-1' } });
      expect(txMock.match.deleteMany).toHaveBeenCalledWith({ where: { roomId: 'room-2' } });
      expect(txMock.swipe.deleteMany).toHaveBeenCalledWith({ where: { roomId: 'room-1' } });
      expect(txMock.swipe.deleteMany).toHaveBeenCalledWith({ where: { roomId: 'room-2' } });
      expect(txMock.roomMember.deleteMany).toHaveBeenCalledWith({ where: { roomId: 'room-1' } });
      expect(txMock.roomMember.deleteMany).toHaveBeenCalledWith({ where: { roomId: 'room-2' } });
      expect(txMock.room.delete).toHaveBeenCalledWith({ where: { id: 'room-1' } });
      expect(txMock.room.delete).toHaveBeenCalledWith({ where: { id: 'room-2' } });
    });
  });

  // =========================================
  // updateLibraryItemStatus
  // =========================================
  describe('updateLibraryItemStatus', () => {
    it('should update item status when item belongs to user', async () => {
      const mockItem = { id: 'lib-1', userId: mockUserId };
      const updatedItem = {
        id: 'lib-1',
        tmdbId: '123',
        mediaType: 'movie',
        status: 'watched',
        source: 'manual',
        rating: null,
        importedAt: mockDate,
      };

      prisma.userMediaLibrary.findUnique.mockResolvedValue(mockItem);
      prisma.userMediaLibrary.update.mockResolvedValue(updatedItem);

      const result = await service.updateLibraryItemStatus(mockUserId, 'lib-1', 'watched' as any);

      expect(result.status).toBe('watched');
      expect(result.rating).toBeUndefined();
    });

    it('should throw NotFoundException when item does not exist', async () => {
      prisma.userMediaLibrary.findUnique.mockResolvedValue(null);

      await expect(
        service.updateLibraryItemStatus(mockUserId, 'lib-999', 'watched' as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when item belongs to another user', async () => {
      prisma.userMediaLibrary.findUnique.mockResolvedValue({
        id: 'lib-1',
        userId: 'other-user',
      });

      await expect(
        service.updateLibraryItemStatus(mockUserId, 'lib-1', 'watched' as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // =========================================
  // deleteLibraryItem
  // =========================================
  describe('deleteLibraryItem', () => {
    it('should delete an item owned by the user', async () => {
      prisma.userMediaLibrary.findUnique.mockResolvedValue({
        id: 'lib-1',
        userId: mockUserId,
      });
      prisma.userMediaLibrary.delete.mockResolvedValue({});

      await service.deleteLibraryItem(mockUserId, 'lib-1');

      expect(prisma.userMediaLibrary.delete).toHaveBeenCalledWith({
        where: { id: 'lib-1' },
      });
    });

    it('should throw NotFoundException when item does not exist', async () => {
      prisma.userMediaLibrary.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteLibraryItem(mockUserId, 'lib-999'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when item belongs to another user', async () => {
      prisma.userMediaLibrary.findUnique.mockResolvedValue({
        id: 'lib-1',
        userId: 'other-user',
      });

      await expect(
        service.deleteLibraryItem(mockUserId, 'lib-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // =========================================
  // saveOnboardingSwipe
  // =========================================
  describe('saveOnboardingSwipe', () => {
    it('should upsert a liked swipe', async () => {
      prisma.userMediaLibrary.upsert.mockResolvedValue({});

      await service.saveOnboardingSwipe(mockUserId, {
        tmdbId: '550',
        mediaType: 'movie',
        liked: true,
      });

      expect(prisma.userMediaLibrary.upsert).toHaveBeenCalledWith({
        where: {
          userId_tmdbId_mediaType: {
            userId: mockUserId,
            tmdbId: '550',
            mediaType: 'movie',
          },
        },
        create: expect.objectContaining({
          status: 'liked',
          source: 'onboarding',
        }),
        update: expect.objectContaining({
          status: 'liked',
          source: 'onboarding',
        }),
      });
    });

    it('should upsert a disliked swipe', async () => {
      prisma.userMediaLibrary.upsert.mockResolvedValue({});

      await service.saveOnboardingSwipe(mockUserId, {
        tmdbId: '550',
        mediaType: 'movie',
        liked: false,
      });

      expect(prisma.userMediaLibrary.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ status: 'disliked' }),
          update: expect.objectContaining({ status: 'disliked' }),
        }),
      );
    });
  });

  // =========================================
  // exportUserData
  // =========================================
  describe('exportUserData', () => {
    it('should throw NotFoundException when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.userMediaLibrary.findMany.mockResolvedValue([]);
      prisma.swipe.findMany = jest.fn().mockResolvedValue([]);
      prisma.roomMember.findMany = jest.fn().mockResolvedValue([]);
      prisma.match.findMany.mockResolvedValue([]);

      await expect(service.exportUserData(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return all user data when user exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'test@test.com',
        name: 'Test',
        createdAt: mockDate,
        watchProviders: [8],
        watchRegion: 'FR',
        favoriteGenreIds: [28],
        onboardingStep: 4,
        onboardingCompleted: true,
      });
      prisma.userMediaLibrary.findMany.mockResolvedValue([]);
      prisma.swipe.findMany = jest.fn().mockResolvedValue([]);
      prisma.roomMember.findMany = jest.fn().mockResolvedValue([]);
      prisma.match.findMany.mockResolvedValue([]);

      const result = await service.exportUserData(mockUserId);

      expect(result.profile.email).toBe('test@test.com');
      expect(result.preferences.watchProviders).toEqual([8]);
      expect(result.exportedAt).toBeDefined();
    });
  });
});
