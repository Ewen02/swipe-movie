import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';
import { RoomCrudService } from './room-crud.service';
import { PrismaService } from '../../infra/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { NestEmailService } from '../email/email.service';
import { PushService } from '../push/push.service';

describe('RoomCrudService.sendExpiryReminders', () => {
  let service: RoomCrudService;
  let prisma: {
    room: { findMany: jest.Mock; update: jest.Mock };
  };
  let emailService: { sendRoomExpiryReminder: jest.Mock };
  let pushService: { sendToUsers: jest.Mock };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  beforeEach(async () => {
    prisma = {
      room: {
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    emailService = {
      sendRoomExpiryReminder: jest.fn().mockResolvedValue(true),
    };
    pushService = {
      sendToUsers: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomCrudService,
        { provide: PrismaService, useValue: prisma },
        { provide: SubscriptionService, useValue: {} },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        { provide: NestEmailService, useValue: emailService },
        { provide: PushService, useValue: pushService },
      ],
    }).compile();

    service = module.get(RoomCrudService);
  });

  it('emails non-guest members and marks the room as reminded', async () => {
    prisma.room.findMany.mockResolvedValue([
      {
        id: 'room-1',
        name: 'Movie Night',
        code: 'ABC123',
        createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21h old
        _count: { matches: 2 },
        members: [
          { user: { email: 'a@example.com', name: 'A', isGuest: false } },
          {
            user: {
              email: 'guest_x@trial.local',
              name: 'Guest',
              isGuest: true,
            },
          },
        ],
      },
    ]);

    await service.sendExpiryReminders();

    expect(emailService.sendRoomExpiryReminder).toHaveBeenCalledTimes(1);
    expect(emailService.sendRoomExpiryReminder).toHaveBeenCalledWith(
      'a@example.com',
      expect.objectContaining({ roomName: 'Movie Night', matchCount: 2 }),
    );
    expect(prisma.room.update).toHaveBeenCalledWith({
      where: { id: 'room-1' },
      data: { expiryReminderSentAt: expect.any(Date) },
    });
  });

  it('still marks a guest-only room as reminded without emailing', async () => {
    prisma.room.findMany.mockResolvedValue([
      {
        id: 'room-2',
        name: 'Guest Room',
        code: 'XYZ',
        createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000),
        _count: { matches: 0 },
        members: [
          {
            user: {
              email: 'guest_y@trial.local',
              name: 'Guest',
              isGuest: true,
            },
          },
        ],
      },
    ]);

    await service.sendExpiryReminders();

    expect(emailService.sendRoomExpiryReminder).not.toHaveBeenCalled();
    // Marked anyway, so the hourly cron doesn't re-scan it forever.
    expect(prisma.room.update).toHaveBeenCalledWith({
      where: { id: 'room-2' },
      data: { expiryReminderSentAt: expect.any(Date) },
    });
  });

  it('does nothing when no rooms are in the reminder window', async () => {
    prisma.room.findMany.mockResolvedValue([]);

    await service.sendExpiryReminders();

    expect(emailService.sendRoomExpiryReminder).not.toHaveBeenCalled();
    expect(prisma.room.update).not.toHaveBeenCalled();
  });
});
