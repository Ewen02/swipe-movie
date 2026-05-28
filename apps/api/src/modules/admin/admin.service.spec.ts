import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AdminService } from './admin.service';
import { PrismaService } from '../../infra/prisma.service';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: any;
  let cacheManager: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      room: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      swipe: {
        count: jest.fn(),
        groupBy: jest.fn(),
        findMany: jest.fn(),
      },
      match: {
        count: jest.fn(),
        groupBy: jest.fn(),
        findMany: jest.fn(),
      },
      roomMember: {
        groupBy: jest.fn(),
      },
      subscription: {
        groupBy: jest.fn(),
      },
    };

    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  describe('getGlobalStats', () => {
    it('should return correct counts from the database (users vs guests split)', async () => {
      // Two user.count calls now: authenticated then guests.
      prisma.user.count
        .mockResolvedValueOnce(100) // totalUsers (isGuest=false)
        .mockResolvedValueOnce(15); // totalGuests (isGuest=true)
      prisma.room.count.mockResolvedValue(25);
      prisma.swipe.count.mockResolvedValue(5000);
      prisma.match.count.mockResolvedValue(150);
      prisma.swipe.groupBy
        .mockResolvedValueOnce([{ userId: 'u1' }, { userId: 'u2' }]) // activeToday
        .mockResolvedValueOnce([{ userId: 'u1' }, { userId: 'u2' }, { userId: 'u3' }]) // activeWeek
        .mockResolvedValueOnce([{ userId: 'u1' }, { userId: 'u2' }, { userId: 'u3' }, { userId: 'u4' }]); // activeMonth

      const result = await service.getGlobalStats();

      expect(result).toEqual({
        totalUsers: 100,
        totalGuests: 15,
        totalRooms: 25,
        totalSwipes: 5000,
        totalMatches: 150,
        activeToday: 2,
        activeWeek: 3,
        activeMonth: 4,
      });
    });

    it('should cache the result after computing', async () => {
      prisma.user.count.mockResolvedValue(0);
      prisma.room.count.mockResolvedValue(0);
      prisma.swipe.count.mockResolvedValue(0);
      prisma.match.count.mockResolvedValue(0);
      prisma.swipe.groupBy.mockResolvedValue([]);

      await service.getGlobalStats();

      expect(cacheManager.set).toHaveBeenCalledWith(
        'admin:global-stats',
        expect.objectContaining({ totalUsers: 0, totalGuests: 0 }),
        5 * 60 * 1000,
      );
    });

    it('should return cached data without hitting the database', async () => {
      const cachedStats = {
        totalUsers: 50,
        totalGuests: 8,
        totalRooms: 10,
        totalSwipes: 2000,
        totalMatches: 80,
        activeToday: 5,
        activeWeek: 15,
        activeMonth: 30,
      };
      cacheManager.get.mockResolvedValue(cachedStats);

      const result = await service.getGlobalStats();

      expect(result).toEqual(cachedStats);
      expect(prisma.user.count).not.toHaveBeenCalled();
      expect(prisma.room.count).not.toHaveBeenCalled();
      expect(prisma.swipe.count).not.toHaveBeenCalled();
      expect(prisma.match.count).not.toHaveBeenCalled();
    });
  });

  describe('getDailyActivity', () => {
    it('should return array with correct number of days and guest/conversion fields', async () => {
      prisma.swipe.findMany.mockResolvedValue([]);
      prisma.match.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);
      prisma.room.findMany.mockResolvedValue([]);

      const result = await service.getDailyActivity(7);

      expect(result.days).toHaveLength(7);
      expect(result.days[0]).toHaveProperty('date');
      expect(result.days[0]).toHaveProperty('swipes');
      expect(result.days[0]).toHaveProperty('matches');
      expect(result.days[0]).toHaveProperty('newUsers');
      expect(result.days[0]).toHaveProperty('newGuests');
      expect(result.days[0]).toHaveProperty('newConversions');
      expect(result.days[0]).toHaveProperty('newRooms');
    });

    it('should default to 30 days when no argument is provided', async () => {
      prisma.swipe.findMany.mockResolvedValue([]);
      prisma.match.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);
      prisma.room.findMany.mockResolvedValue([]);

      const result = await service.getDailyActivity();

      expect(result.days).toHaveLength(30);
    });

    it('should bucket items into the correct date', async () => {
      // Use a UTC-based date that the service's bucketByDate will assign to a known key
      const eventDate = new Date('2025-06-15T12:00:00.000Z');

      prisma.swipe.findMany.mockResolvedValue([
        { createdAt: eventDate },
        { createdAt: eventDate },
      ]);
      prisma.match.findMany.mockResolvedValue([{ createdAt: eventDate }]);
      prisma.user.findMany.mockResolvedValue([]);
      prisma.room.findMany.mockResolvedValue([]);

      // Use enough days that '2025-06-15' is guaranteed to fall within the range
      const result = await service.getDailyActivity(365);

      // The bucketByDate function uses toISOString().split('T')[0]
      const expectedKey = '2025-06-15';
      const dayEntry = result.days.find((d: any) => d.date === expectedKey);

      expect(dayEntry).toBeDefined();
      expect(dayEntry!.swipes).toBe(2);
      expect(dayEntry!.matches).toBe(1);
      expect(dayEntry!.newUsers).toBe(0);
      expect(dayEntry!.newGuests).toBe(0);
      expect(dayEntry!.newConversions).toBe(0);
      expect(dayEntry!.newRooms).toBe(0);
    });

    it('should return cached data when available', async () => {
      const cached = {
        days: [
          {
            date: '2025-01-01',
            swipes: 10,
            matches: 1,
            newUsers: 2,
            newGuests: 0,
            newConversions: 0,
            newRooms: 1,
          },
        ],
      };
      cacheManager.get.mockResolvedValue(cached);

      const result = await service.getDailyActivity(1);

      expect(result).toBe(cached);
      expect(prisma.swipe.findMany).not.toHaveBeenCalled();
    });

    it('should cache the result after computing', async () => {
      prisma.swipe.findMany.mockResolvedValue([]);
      prisma.match.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);
      prisma.room.findMany.mockResolvedValue([]);

      await service.getDailyActivity(14);

      expect(cacheManager.set).toHaveBeenCalledWith(
        'admin:daily-activity:14',
        expect.objectContaining({ days: expect.any(Array) }),
        5 * 60 * 1000,
      );
    });
  });

  describe('getUsers', () => {
    it('should return paginated users with lastSwipe data and guest flag', async () => {
      const createdAt = new Date('2025-01-01T00:00:00Z');
      const lastSwipeDate = new Date('2025-01-10T14:30:00Z');

      prisma.user.findMany.mockResolvedValue([
        {
          id: 'user-1',
          email: 'alice@example.com',
          name: 'Alice',
          roles: ['user'],
          createdAt,
          isGuest: false,
          convertedFromGuestAt: null,
          _count: { swipes: 42, members: 3 },
        },
      ]);
      prisma.user.count.mockResolvedValue(1);
      prisma.swipe.groupBy.mockResolvedValue([
        { userId: 'user-1', _max: { createdAt: lastSwipeDate } },
      ]);

      const result = await service.getUsers(1, 10);

      expect(result).toEqual({
        data: [
          {
            id: 'user-1',
            email: 'alice@example.com',
            name: 'Alice',
            roles: ['user'],
            createdAt,
            isGuest: false,
            convertedFromGuestAt: null,
            swipesCount: 42,
            roomsCount: 3,
            lastActive: lastSwipeDate,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        filter: 'users',
        totalPages: 1,
      });
    });

    it('defaults filter=users and only fetches isGuest=false', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getUsers(1, 10);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isGuest: false } }),
      );
      expect(prisma.user.count).toHaveBeenCalledWith({ where: { isGuest: false } });
    });

    it('filter=guests returns only guests', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getUsers(1, 10, 'guests');

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isGuest: true } }),
      );
    });

    it('filter=all returns both', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getUsers(1, 10, 'all');

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('should use correct skip/take for pagination', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getUsers(3, 20);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40, // (3-1) * 20
          take: 20,
        }),
      );
    });

    it('should set lastActive to null when user has no swipes', async () => {
      prisma.user.findMany.mockResolvedValue([
        {
          id: 'user-2',
          email: 'bob@example.com',
          name: 'Bob',
          roles: [],
          createdAt: new Date(),
          isGuest: false,
          convertedFromGuestAt: null,
          _count: { swipes: 0, members: 0 },
        },
      ]);
      prisma.user.count.mockResolvedValue(1);
      prisma.swipe.groupBy.mockResolvedValue([]);

      const result = await service.getUsers(1, 10);

      expect(result.data[0].lastActive).toBeNull();
    });

    it('should compute totalPages correctly', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(55);

      const result = await service.getUsers(1, 20);

      expect(result.totalPages).toBe(3); // Math.ceil(55 / 20)
    });

    it('should not query swipes when there are no users on the page', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getUsers(1, 10);

      expect(prisma.swipe.groupBy).not.toHaveBeenCalled();
    });
  });
});
