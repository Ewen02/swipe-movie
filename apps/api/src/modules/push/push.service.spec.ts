import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import webpush from 'web-push';
import { PushService } from './push.service';
import { PrismaService } from '../../infra/prisma.service';

jest.mock('web-push', () => ({
  __esModule: true,
  default: {
    setVapidDetails: jest.fn(),
    sendNotification: jest.fn(),
  },
}));

const mockedWebpush = webpush as unknown as {
  setVapidDetails: jest.Mock;
  sendNotification: jest.Mock;
};

describe('PushService', () => {
  let prisma: {
    pushSubscription: {
      findMany: jest.Mock;
      deleteMany: jest.Mock;
      upsert: jest.Mock;
    };
  };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      pushSubscription: {
        findMany: jest.fn().mockResolvedValue([]),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        upsert: jest.fn().mockResolvedValue({}),
      },
    };
  });

  async function build(config: Record<string, string | undefined>) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: { get: (k: string) => config[k] },
        },
      ],
    }).compile();
    return module.get(PushService);
  }

  const VAPID = {
    VAPID_PUBLIC_KEY: 'pub',
    VAPID_PRIVATE_KEY: 'priv',
  };

  it('is disabled (no-op) when VAPID keys are missing', async () => {
    const service = await build({});
    expect(service.isEnabled()).toBe(false);

    const sent = await service.sendToUsers(['u1'], { title: 't', body: 'b' });

    expect(sent).toBe(0);
    expect(prisma.pushSubscription.findMany).not.toHaveBeenCalled();
    expect(mockedWebpush.sendNotification).not.toHaveBeenCalled();
  });

  it('configures VAPID and sends to all of a user’s subscriptions', async () => {
    prisma.pushSubscription.findMany.mockResolvedValue([
      { endpoint: 'e1', p256dh: 'k1', auth: 'a1' },
      { endpoint: 'e2', p256dh: 'k2', auth: 'a2' },
    ]);
    mockedWebpush.sendNotification.mockResolvedValue(undefined);

    const service = await build(VAPID);
    expect(mockedWebpush.setVapidDetails).toHaveBeenCalled();

    const sent = await service.sendToUsers(['u1'], {
      title: '🎉',
      body: 'match',
      url: '/rooms/ABC',
    });

    expect(sent).toBe(2);
    expect(mockedWebpush.sendNotification).toHaveBeenCalledTimes(2);
  });

  it('prunes endpoints the push service reports as gone (410)', async () => {
    prisma.pushSubscription.findMany.mockResolvedValue([
      { endpoint: 'dead', p256dh: 'k', auth: 'a' },
      { endpoint: 'live', p256dh: 'k', auth: 'a' },
    ]);
    mockedWebpush.sendNotification
      .mockRejectedValueOnce({ statusCode: 410 })
      .mockResolvedValueOnce(undefined);

    const service = await build(VAPID);
    const sent = await service.sendToUsers(['u1'], { title: 't', body: 'b' });

    expect(sent).toBe(1);
    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith({
      where: { endpoint: { in: ['dead'] } },
    });
  });

  it('keeps endpoints on transient (non-404/410) errors', async () => {
    prisma.pushSubscription.findMany.mockResolvedValue([
      { endpoint: 'e1', p256dh: 'k', auth: 'a' },
    ]);
    mockedWebpush.sendNotification.mockRejectedValue({ statusCode: 500 });

    const service = await build(VAPID);
    const sent = await service.sendToUsers(['u1'], { title: 't', body: 'b' });

    expect(sent).toBe(0);
    expect(prisma.pushSubscription.deleteMany).not.toHaveBeenCalled();
  });

  it('returns 0 without querying when no userIds are given', async () => {
    const service = await build(VAPID);
    const sent = await service.sendToUsers([], { title: 't', body: 'b' });
    expect(sent).toBe(0);
    expect(prisma.pushSubscription.findMany).not.toHaveBeenCalled();
  });
});
