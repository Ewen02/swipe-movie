import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infra/prisma.service';
import {
  MediaSource,
} from '../../common/constants/media';
import {
  TraktConfig,
  TraktTokens,
  ExternalConnection,
  ExternalProviders,
} from '@swipe-movie/types';

@Injectable()
export class TraktAuthService {
  private readonly logger = new Logger(TraktAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.clientId = this.configService.get<string>('TRAKT_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('TRAKT_CLIENT_SECRET') || '';
    this.redirectUri =
      this.configService.get<string>('TRAKT_REDIRECT_URI') ||
      'http://localhost:3000/auth/trakt/callback';
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    });

    if (state) {
      params.append('state', state);
    }

    return `${TraktConfig.AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TraktTokens> {
    this.logger.debug(
      `Exchanging code for tokens with redirect_uri: ${this.redirectUri}`,
    );

    const response = await fetch(TraktConfig.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(
        `Trakt token exchange failed (${response.status}): ${error}`,
      );
      this.logger.error(
        `Request details - redirect_uri: ${this.redirectUri}, client_id: ${this.clientId.substring(0, 8)}...`,
      );
      throw new UnauthorizedException(
        `Failed to exchange Trakt code for tokens: ${error}`,
      );
    }

    return await response.json();
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TraktTokens> {
    const response = await fetch(TraktConfig.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to refresh Trakt token');
    }

    return await response.json();
  }

  /**
   * Store tokens for user
   */
  async storeTokens(userId: string, tokens: TraktTokens): Promise<void> {
    const expiresAt = new Date((tokens.created_at + tokens.expires_in) * 1000);

    await this.prisma.account.upsert({
      where: {
        userId_providerId: {
          userId,
          providerId: ExternalProviders.TRAKT,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: expiresAt,
      },
      create: {
        userId,
        providerId: ExternalProviders.TRAKT,
        accountId: 'trakt', // Will be updated with username
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: expiresAt,
      },
    });
  }

  /**
   * Get stored tokens for user
   */
  async getStoredTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string | null } | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: ExternalProviders.TRAKT,
      },
    });

    if (!account || !account.accessToken) {
      return null;
    }

    // Check if token is expired and refresh if needed
    if (
      account.accessTokenExpiresAt &&
      account.accessTokenExpiresAt < new Date() &&
      account.refreshToken
    ) {
      try {
        const newTokens = await this.refreshAccessToken(account.refreshToken);
        await this.storeTokens(userId, newTokens);
        return {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        };
      } catch (error) {
        this.logger.error(`Failed to refresh Trakt token for user ${userId}`);
        return null;
      }
    }

    return {
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    };
  }

  /**
   * Get connection status
   */
  async getConnectionStatus(userId: string): Promise<ExternalConnection> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: ExternalProviders.TRAKT,
      },
    });

    if (!account || !account.accessToken) {
      return {
        provider: ExternalProviders.TRAKT,
        connected: false,
      };
    }

    return {
      provider: ExternalProviders.TRAKT,
      connected: true,
      username: account.accountId !== 'trakt' ? account.accountId : undefined,
      expiresAt: account.accessTokenExpiresAt?.toISOString(),
      lastSync: account.lastSyncAt?.toISOString(),
    };
  }

  /**
   * Disconnect Trakt account
   */
  async disconnect(userId: string): Promise<void> {
    // Delete account connection
    await this.prisma.account.deleteMany({
      where: {
        userId,
        providerId: ExternalProviders.TRAKT,
      },
    });

    // Optionally delete imported media library entries
    await this.prisma.userMediaLibrary.deleteMany({
      where: {
        userId,
        source: MediaSource.trakt,
      },
    });
  }
}
