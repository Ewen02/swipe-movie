import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DigestService } from './digest.service';
import { PrismaService } from '../../infra/prisma.service';
import { NestEmailService } from '../email/email.service';

describe('DigestService.sendWeeklyDigests', () => {
  let service: DigestService;
  let prisma: {
    swipe: { groupBy: jest.Mock };
    user: { findMany: jest.Mock };
    match: { count: jest.Mock };
    room: { count: jest.Mock };
  };
  let emailService: { sendWeeklyDigest: jest.Mock };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  beforeEach(async () => {
    prisma = {
      swipe: { groupBy: jest.fn().mockResolvedValue([]) },
      user: { findMany: jest.fn().mockResolvedValue([]) },
      match: { count: jest.fn().mockResolvedValue(0) },
      room: { count: jest.fn().mockResolvedValue(0) },
    };
    emailService = { sendWeeklyDigest: jest.fn().mockResolvedValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DigestService,
        { provide: PrismaService, useValue: prisma },
        { provide: NestEmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get(DigestService);
  });

  it('does nothing when nobody swiped this week', async () => {
    prisma.swipe.groupBy.mockResolvedValue([]);

    await service.sendWeeklyDigests();

    expect(prisma.user.findMany).not.toHaveBeenCalled();
    expect(emailService.sendWeeklyDigest).not.toHaveBeenCalled();
  });

  it('emails active non-guest users with their weekly stats', async () => {
    prisma.swipe.groupBy.mockResolvedValue([
      { userId: 'u1', _count: { id: 42 } },
    ]);
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'u1',
        email: 'u1@example.com',
        name: 'Alice',
        members: [{ roomId: 'r1' }, { roomId: 'r2' }],
      },
    ]);
    prisma.match.count.mockResolvedValue(3);
    prisma.room.count.mockResolvedValue(2);

    await service.sendWeeklyDigests();

    expect(emailService.sendWeeklyDigest).toHaveBeenCalledTimes(1);
    expect(emailService.sendWeeklyDigest).toHaveBeenCalledWith(
      'u1@example.com',
      {
        userName: 'Alice',
        totalSwipes: 42,
        newMatches: 3,
        roomsActive: 2,
      },
    );
  });

  it('skips guest (@trial.local) users even if they swiped', async () => {
    prisma.swipe.groupBy.mockResolvedValue([
      { userId: 'g1', _count: { id: 5 } },
    ]);
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'g1',
        email: 'guest_z@trial.local',
        name: 'Guest',
        members: [],
      },
    ]);

    await service.sendWeeklyDigests();

    expect(emailService.sendWeeklyDigest).not.toHaveBeenCalled();
  });
});
