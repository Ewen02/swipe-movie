import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailHeaderStrategy } from './email-header.strategy';
import { PrismaService } from '../../infra/prisma.service';
import { Request } from 'express';

describe('EmailHeaderStrategy', () => {
  let strategy: EmailHeaderStrategy;
  let prisma: { user: { findUnique: jest.Mock } };

  const TEST_SECRET = 'test-internal-secret';
  const TEST_ORIGIN = 'https://app.example.com';

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const configValues: Record<string, string> = {
      INTERNAL_API_SECRET: TEST_SECRET,
      WEB_ORIGIN: TEST_ORIGIN,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailHeaderStrategy,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => configValues[key]),
            getOrThrow: jest.fn((key: string) => {
              const val = configValues[key];
              if (val === undefined) throw new Error(`Missing ${key}`);
              return val;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<EmailHeaderStrategy>(EmailHeaderStrategy);
  });

  const makeReq = (headers: Record<string, string> = {}): Request =>
    ({ headers } as unknown as Request);

  describe('validate', () => {
    it('should return user object when internal secret is valid and email exists', async () => {
      const user = { id: 'user-1', email: 'alice@example.com', roles: ['user'] };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await strategy.validate(
        makeReq({
          'x-internal-secret': TEST_SECRET,
          'x-user-email': 'alice@example.com',
        }),
      );

      expect(result).toEqual({
        sub: 'user-1',
        email: 'alice@example.com',
        roles: ['user'],
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'alice@example.com' },
        select: { id: true, email: true, roles: true },
      });
    });

    it('should return user object when origin header matches allowed origin', async () => {
      const user = { id: 'user-2', email: 'bob@example.com', roles: [] };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await strategy.validate(
        makeReq({
          origin: TEST_ORIGIN,
          'x-user-email': 'bob@example.com',
        }),
      );

      expect(result).toEqual({
        sub: 'user-2',
        email: 'bob@example.com',
        roles: [],
      });
    });

    it('should return user object when referer header starts with allowed origin', async () => {
      const user = { id: 'user-3', email: 'carol@example.com', roles: ['admin'] };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await strategy.validate(
        makeReq({
          referer: `${TEST_ORIGIN}/some/path`,
          'x-user-email': 'carol@example.com',
        }),
      );

      expect(result).toEqual({
        sub: 'user-3',
        email: 'carol@example.com',
        roles: ['admin'],
      });
    });

    it('should throw UnauthorizedException when secret is missing AND origin is missing', async () => {
      await expect(
        strategy.validate(
          makeReq({
            'x-user-email': 'alice@example.com',
          }),
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when secret is wrong and origin is wrong', async () => {
      await expect(
        strategy.validate(
          makeReq({
            'x-internal-secret': 'wrong-secret',
            origin: 'https://evil.com',
            'x-user-email': 'alice@example.com',
          }),
        ),
      ).rejects.toThrow(new UnauthorizedException('Request origin not allowed'));
    });

    it('should throw UnauthorizedException when X-User-Email header is missing', async () => {
      await expect(
        strategy.validate(
          makeReq({
            'x-internal-secret': TEST_SECRET,
          }),
        ),
      ).rejects.toThrow(new UnauthorizedException('Missing X-User-Email header'));
    });

    it('should throw UnauthorizedException for invalid email format', async () => {
      await expect(
        strategy.validate(
          makeReq({
            'x-internal-secret': TEST_SECRET,
            'x-user-email': 'not-an-email',
          }),
        ),
      ).rejects.toThrow(new UnauthorizedException('Invalid email format'));
    });

    it('should throw UnauthorizedException for email exceeding 254 characters', async () => {
      const longEmail = `${'a'.repeat(250)}@b.co`;
      await expect(
        strategy.validate(
          makeReq({
            'x-internal-secret': TEST_SECRET,
            'x-user-email': longEmail,
          }),
        ),
      ).rejects.toThrow(new UnauthorizedException('Invalid email format'));
    });

    it('should throw UnauthorizedException when user is not found in the database', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        strategy.validate(
          makeReq({
            'x-internal-secret': TEST_SECRET,
            'x-user-email': 'unknown@example.com',
          }),
        ),
      ).rejects.toThrow(new UnauthorizedException('User not found'));
    });

    it('should default roles to empty array when user.roles is null', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-4',
        email: 'noroles@example.com',
        roles: null,
      });

      const result = await strategy.validate(
        makeReq({
          'x-internal-secret': TEST_SECRET,
          'x-user-email': 'noroles@example.com',
        }),
      );

      expect(result.roles).toEqual([]);
    });
  });
});
