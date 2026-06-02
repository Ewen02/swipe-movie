import { Test, TestingModule } from '@nestjs/testing';
import { Logger, ForbiddenException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { PrismaService } from '../../infra/prisma.service';
import { NestEmailService } from '../email/email.service';
import { PushService } from '../push/push.service';

describe('GroupsService.startSession', () => {
  let service: GroupsService;
  let prisma: {
    group: { findUnique: jest.Mock; update: jest.Mock };
    room: { create: jest.Mock };
  };
  let emailService: { sendRoomInvite: jest.Mock };
  let pushService: { sendToUsers: jest.Mock };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  beforeEach(async () => {
    prisma = {
      group: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      room: {
        create: jest.fn().mockResolvedValue({ id: 'room-1', code: 'ABC123' }),
      },
    };
    emailService = { sendRoomInvite: jest.fn().mockResolvedValue(true) };
    pushService = { sendToUsers: jest.fn().mockResolvedValue(0) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NestEmailService, useValue: emailService },
        { provide: PushService, useValue: pushService },
      ],
    }).compile();

    service = module.get(GroupsService);
  });

  const groupWith = (members: any[]) => ({
    id: 'group-1',
    name: 'Movie Night',
    createdBy: 'host',
    type: 'MOVIE',
    genreId: 0,
    minRating: null,
    releaseYearMin: null,
    releaseYearMax: null,
    runtimeMin: null,
    runtimeMax: null,
    watchProviders: [],
    watchRegion: 'FR',
    originalLanguage: null,
    members,
  });

  it('spawns a fresh room linked to the group and emails non-host, non-guest members', async () => {
    prisma.group.findUnique.mockResolvedValue(
      groupWith([
        {
          userId: 'host',
          user: { id: 'host', name: 'Host', email: 'host@x.com', isGuest: false, locale: 'fr' },
        },
        {
          userId: 'friend',
          user: { id: 'friend', name: 'Friend', email: 'friend@x.com', isGuest: false, locale: 'en' },
        },
        {
          userId: 'guest',
          user: { id: 'guest', name: 'Guest', email: 'g@trial.local', isGuest: true, locale: 'fr' },
        },
      ]),
    );

    const res = await service.startSession('host', 'group-1');

    expect(prisma.room.create).toHaveBeenCalledTimes(1);
    expect(prisma.room.create.mock.calls[0][0].data).toEqual(
      expect.objectContaining({ groupId: 'group-1', createdBy: 'host' }),
    );
    // Only the host joins the new room immediately.
    expect(prisma.room.create.mock.calls[0][0].data.members.create).toEqual([
      { userId: 'host' },
    ]);
    // Host excluded, guest excluded → only the real friend is invited.
    expect(emailService.sendRoomInvite).toHaveBeenCalledTimes(1);
    expect(emailService.sendRoomInvite).toHaveBeenCalledWith(
      'friend@x.com',
      expect.objectContaining({ roomCode: 'ABC123', inviterName: 'Host', locale: 'en' }),
    );
    expect(res).toEqual({ code: 'ABC123', roomId: 'room-1', notified: 1 });
  });

  it('rejects a non-member host', async () => {
    prisma.group.findUnique.mockResolvedValue(
      groupWith([
        { userId: 'someone-else', user: { id: 'someone-else', name: 'X', email: 'x@x.com', isGuest: false, locale: 'fr' } },
      ]),
    );

    await expect(service.startSession('intruder', 'group-1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(prisma.room.create).not.toHaveBeenCalled();
  });
});
