import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../../infra/prisma.service';
import type { FeatureLimitsDto } from './dto';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let prisma: Record<string, any>;
  let configService: Record<string, jest.Mock>;

  const mockUserId = 'user-1';
  const mockDate = new Date('2025-01-01T00:00:00Z');

  const mockSubscription = {
    id: 'sub-1',
    referenceId: mockUserId,
    plan: 'pro',
    status: 'active',
    stripeCustomerId: 'cus_test123',
    stripeSubscriptionId: 'sub_test123',
    periodStart: mockDate,
    periodEnd: new Date('2025-02-01T00:00:00Z'),
    cancelAtPeriodEnd: false,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  beforeEach(async () => {
    prisma = {
      subscription: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      room: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      roomMember: {
        findMany: jest.fn(),
      },
      swipe: {
        groupBy: jest.fn(),
      },
    };

    configService = {
      get: jest.fn().mockReturnValue('false'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  describe('getUserPlan', () => {
    it('should return the user plan when subscription exists', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription);

      const result = await service.getUserPlan(mockUserId);

      expect(result).toBe('pro');
    });

    it('should return "free" when user has no subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);

      const result = await service.getUserPlan(mockUserId);

      expect(result).toBe('free');
    });
  });

  describe('getFeatureLimits', () => {
    it('should return correct limits for free plan', () => {
      const limits = service.getFeatureLimits('free');

      expect(limits.maxRooms).toBe(3);
      expect(limits.maxParticipants).toBe(4);
      expect(limits.maxSwipes).toBe(20);
      expect(limits.hasAdvancedFilters).toBe(false);
      expect(limits.hasApiAccess).toBe(false);
    });

    it('should return correct limits for starter plan', () => {
      const limits = service.getFeatureLimits('starter');

      expect(limits.maxRooms).toBe(-1); // unlimited
      expect(limits.maxParticipants).toBe(8);
      expect(limits.maxSwipes).toBe(50);
      expect(limits.hasEmailNotifications).toBe(true);
    });

    it('should return correct limits for pro plan', () => {
      const limits = service.getFeatureLimits('pro');

      expect(limits.maxRooms).toBe(-1);
      expect(limits.maxParticipants).toBe(-1);
      expect(limits.maxSwipes).toBe(-1);
      expect(limits.hasAdvancedFilters).toBe(true);
    });

    it('should return correct limits for team plan', () => {
      const limits = service.getFeatureLimits('team');

      expect(limits.hasApiAccess).toBe(true);
      expect(limits.hasAdvancedFilters).toBe(true);
      expect(limits.maxSwipes).toBe(-1);
    });

    it('should fall back to free plan for unknown plan', () => {
      const limits = service.getFeatureLimits('unknown');

      expect(limits.maxRooms).toBe(3);
      expect(limits.maxSwipes).toBe(20);
    });
  });

  describe('getSubscriptionOrNull', () => {
    it('should return mapped subscription when found', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription);

      const result = await service.getSubscriptionOrNull(mockUserId);

      expect(result).not.toBeNull();
      expect(result!.id).toBe('sub-1');
      expect(result!.userId).toBe(mockUserId);
      expect(result!.plan).toBe('pro');
      expect(result!.status).toBe('active');
      expect(result!.stripeCustomerId).toBe('cus_test123');
    });

    it('should return null when no subscription found', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);

      const result = await service.getSubscriptionOrNull(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('getSubscription', () => {
    it('should return subscription when found', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription);

      const result = await service.getSubscription(mockUserId);

      expect(result.id).toBe('sub-1');
      expect(result.plan).toBe('pro');
    });

    it('should throw NotFoundException when no subscription found', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);

      await expect(service.getSubscription(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null); // no existing
      prisma.subscription.create.mockResolvedValue(mockSubscription);

      const result = await service.createSubscription({
        userId: mockUserId,
        plan: 'pro',
        stripeCustomerId: 'cus_test123',
      });

      expect(result.plan).toBe('pro');
      expect(prisma.subscription.create).toHaveBeenCalledWith({
        data: {
          referenceId: mockUserId,
          plan: 'pro',
          status: 'active',
          stripeCustomerId: 'cus_test123',
        },
      });
    });

    it('should throw BadRequestException when user already has a subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription);

      await expect(
        service.createSubscription({
          userId: mockUserId,
          plan: 'pro',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateSubscription', () => {
    it('should update an existing subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription);
      prisma.subscription.update.mockResolvedValue({
        ...mockSubscription,
        plan: 'team',
      });

      const result = await service.updateSubscription(mockUserId, {
        plan: 'team',
      });

      expect(result.plan).toBe('team');
      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: expect.objectContaining({ plan: 'team' }),
      });
    });

    it('should throw NotFoundException when subscription not found', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);

      await expect(
        service.updateSubscription(mockUserId, { plan: 'team' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription and set cancelAtPeriodEnd', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription);
      prisma.subscription.update.mockResolvedValue({
        ...mockSubscription,
        status: 'canceled',
        cancelAtPeriodEnd: true,
      });

      const result = await service.cancelSubscription(mockUserId);

      expect(result.status).toBe('canceled');
      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: {
          status: 'canceled',
          cancelAtPeriodEnd: true,
        },
      });
    });
  });

  describe('checkFeatureAccess', () => {
    it('should return true for boolean feature the user has', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription); // pro plan

      const result = await service.checkFeatureAccess(mockUserId, 'hasAdvancedFilters');

      expect(result).toBe(true);
    });

    it('should return false for boolean feature the user lacks', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null); // free plan

      const result = await service.checkFeatureAccess(mockUserId, 'hasAdvancedFilters');

      expect(result).toBe(false);
    });

    it('should return true for unlimited numeric features (-1)', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription); // pro plan

      const result = await service.checkFeatureAccess(mockUserId, 'maxSwipes');

      expect(result).toBe(true); // -1 means unlimited, not 0
    });
  });

  describe('checkLimit', () => {
    it('should always allow when ENABLE_SUBSCRIPTION_LIMITS is false', async () => {
      configService.get.mockReturnValue('false');

      const result = await service.checkLimit(mockUserId, 'maxRooms', 100);

      expect(result).toEqual({ allowed: true, limit: -1 });
      // Should not even query the DB
      expect(prisma.subscription.findFirst).not.toHaveBeenCalled();
    });

    it('should allow when current count is below limit', async () => {
      configService.get.mockReturnValue('true');
      prisma.subscription.findFirst.mockResolvedValue(null); // free plan

      const result = await service.checkLimit(mockUserId, 'maxRooms', 2);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(3); // free plan maxRooms
    });

    it('should deny when current count meets limit', async () => {
      configService.get.mockReturnValue('true');
      prisma.subscription.findFirst.mockResolvedValue(null); // free plan

      const result = await service.checkLimit(mockUserId, 'maxRooms', 3);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(3);
    });

    it('should always allow for unlimited plans (-1)', async () => {
      configService.get.mockReturnValue('true');
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription); // pro plan

      const result = await service.checkLimit(mockUserId, 'maxRooms', 999);

      expect(result).toEqual({ allowed: true, limit: -1 });
    });
  });

  describe('getUsageStats', () => {
    it('should return usage stats with active rooms, max swipes, and max participants', async () => {
      prisma.room.count.mockResolvedValue(2);
      prisma.roomMember.findMany.mockResolvedValue([
        { roomId: 'room-1' },
        { roomId: 'room-2' },
      ]);
      prisma.swipe.groupBy.mockResolvedValue([
        { roomId: 'room-1', _count: { id: 10 } },
        { roomId: 'room-2', _count: { id: 25 } },
      ]);
      prisma.room.findMany.mockResolvedValue([
        { _count: { members: 3 } },
        { _count: { members: 5 } },
      ]);

      const result = await service.getUsageStats(mockUserId);

      expect(result.activeRooms).toBe(2);
      expect(result.maxSwipesInRoom).toBe(25);
      expect(result.maxParticipantsInRoom).toBe(5);
    });

    it('should return 0 for maxSwipesInRoom when user has no rooms', async () => {
      prisma.room.count.mockResolvedValue(0);
      prisma.roomMember.findMany.mockResolvedValue([]);
      prisma.room.findMany.mockResolvedValue([]);

      const result = await service.getUsageStats(mockUserId);

      expect(result.activeRooms).toBe(0);
      expect(result.maxSwipesInRoom).toBe(0);
      expect(result.maxParticipantsInRoom).toBe(0);
    });
  });

  describe('hasMinimumPlan', () => {
    it('should return true when user plan meets requirement', async () => {
      prisma.subscription.findFirst.mockResolvedValue(mockSubscription); // pro plan

      const result = await service.hasMinimumPlan(mockUserId, 'starter');

      expect(result).toBe(true);
    });

    it('should return false when user plan is below requirement', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null); // free plan

      const result = await service.hasMinimumPlan(mockUserId, 'pro');

      expect(result).toBe(false);
    });

    it('should return true when user plan equals requirement', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null); // free plan

      const result = await service.hasMinimumPlan(mockUserId, 'free');

      expect(result).toBe(true);
    });
  });
});
