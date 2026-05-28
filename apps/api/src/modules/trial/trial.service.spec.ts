import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TrialService } from './trial.service';
import { PrismaService } from '../../infra/prisma.service';
import { AuthService } from '../auth/auth.service';

describe('TrialService', () => {
  let service: TrialService;
  let prisma: Record<string, any>;
  let authService: { issueToken: jest.Mock; verifyToken: jest.Mock };

  const guestId = 'ckguest1234567890abcd';
  const realUserId = 'ckreal1234567890abcd';

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        findMany: jest.fn(),
      },
      room: {
        create: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      roomMember: {
        create: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
        updateMany: jest.fn(),
      },
      swipe: {
        updateMany: jest.fn(),
      },
      $transaction: jest.fn(async (cb: (tx: typeof prisma) => Promise<unknown>) => cb(prisma)),
    };

    authService = {
      issueToken: jest.fn().mockReturnValue('signed.jwt.token'),
      verifyToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrialService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    service = module.get(TrialService);
  });

  describe('startTrial', () => {
    it('creates guest user, room, membership and returns a 2h token', async () => {
      prisma.user.create.mockResolvedValue({
        id: guestId,
        email: 'guest_x@trial.local',
        isGuest: true,
      });
      prisma.room.create.mockResolvedValue({ id: 'room-1', code: 'ABC123' });
      prisma.roomMember.create.mockResolvedValue({});

      const result = await service.startTrial({ genreId: 28, type: 'movie' });

      expect(result).toEqual({
        roomCode: 'ABC123',
        token: 'signed.jwt.token',
        guestId,
      });
      // The 2h override is what aligns the JWT with the trial cookie lifetime.
      expect(authService.issueToken).toHaveBeenCalledWith(expect.any(Object), { expiresIn: '2h' });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isGuest: true, onboardingCompleted: true }),
        }),
      );
    });
  });

  describe('migrateGuestToUser', () => {
    function setupHappyPath() {
      prisma.user.findUnique
        .mockResolvedValueOnce({ id: realUserId, isGuest: false }) // realUser first
        .mockResolvedValueOnce({ id: guestId, isGuest: true }); // then guest
      prisma.roomMember.findMany.mockResolvedValue([{ roomId: 'r1' }]);
      prisma.swipe.updateMany.mockResolvedValue({ count: 5 });
      prisma.roomMember.deleteMany.mockResolvedValue({ count: 0 });
      prisma.roomMember.updateMany.mockResolvedValue({ count: 1 });
      prisma.room.updateMany.mockResolvedValue({ count: 1 });
      prisma.user.update.mockResolvedValue({});
      prisma.user.delete.mockResolvedValue({});
    }

    it('migrates swipes, memberships, rooms and marks onboarding complete', async () => {
      setupHappyPath();

      const result = await service.migrateGuestToUser(guestId, realUserId);

      expect(result).toEqual({ alreadyMigrated: false });
      expect(prisma.swipe.updateMany).toHaveBeenCalledWith({
        where: { userId: guestId },
        data: { userId: realUserId },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: realUserId },
        data: { onboardingCompleted: true, onboardingStep: 4 },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: guestId } });
    });

    it('returns alreadyMigrated when guest no longer exists (idempotent retry)', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ id: realUserId, isGuest: false })
        .mockResolvedValueOnce(null);

      const result = await service.migrateGuestToUser(guestId, realUserId);

      expect(result).toEqual({ alreadyMigrated: true });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when real user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.migrateGuestToUser(guestId, realUserId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws ForbiddenException when target user is itself a guest', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: realUserId, isGuest: true });

      await expect(service.migrateGuestToUser(guestId, realUserId)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException when guestId points to a real user', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ id: realUserId, isGuest: false })
        .mockResolvedValueOnce({ id: guestId, isGuest: false });

      await expect(service.migrateGuestToUser(guestId, realUserId)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('retries the transaction on serialization_failure (P2034) up to 3 times', async () => {
      setupHappyPath();
      let calls = 0;
      prisma.$transaction.mockImplementation(async (cb: (tx: typeof prisma) => Promise<unknown>) => {
        calls++;
        if (calls < 3) {
          const err = new Error('serialization conflict') as Error & { code: string };
          err.code = 'P2034';
          throw err;
        }
        return cb(prisma);
      });

      // Re-prime findUnique because the retry path calls runMigration once
      // (findUnique calls are made before the transaction).
      prisma.user.findUnique
        .mockReset()
        .mockResolvedValueOnce({ id: realUserId, isGuest: false })
        .mockResolvedValueOnce({ id: guestId, isGuest: true });

      const result = await service.migrateGuestToUser(guestId, realUserId);
      expect(result).toEqual({ alreadyMigrated: false });
      expect(calls).toBe(3);
    });
  });

  describe('cleanupExpiredGuests', () => {
    it('returns 0 when no expired guests exist', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      const count = await service.cleanupExpiredGuests();
      expect(count).toBe(0);
      expect(prisma.room.deleteMany).not.toHaveBeenCalled();
      expect(prisma.user.deleteMany).not.toHaveBeenCalled();
    });

    it('deletes rooms then users when expired guests exist', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 'g1', email: 'g1@trial.local', createdAt: new Date(), _count: { swipes: 1, members: 1 } },
        { id: 'g2', email: 'g2@trial.local', createdAt: new Date(), _count: { swipes: 8, members: 2 } },
      ]);
      prisma.room.deleteMany.mockResolvedValue({ count: 2 });
      prisma.user.deleteMany.mockResolvedValue({ count: 2 });

      const count = await service.cleanupExpiredGuests();

      expect(count).toBe(2);
      // Engaged-lost (>=5 swipes) should be detected — see warn log; we can't
      // assert the log call directly but room/user deletion order matters.
      expect(prisma.room.deleteMany).toHaveBeenCalledWith({
        where: { createdBy: { in: ['g1', 'g2'] } },
      });
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['g1', 'g2'] } },
      });
    });
  });
});
