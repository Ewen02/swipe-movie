import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Headers,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { TrialService } from './trial.service';
import { AuthService } from '../auth/auth.service';
import { StartTrialDto } from './dto/start-trial.dto';
import { MigrateTrialDto } from './dto/migrate-trial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trial')
export class TrialController {
  constructor(
    private readonly trialService: TrialService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('start')
  // 20/h instead of 5/h — corporate NAT and mobile carriers share IPs across
  // many users, so a tight limit blocked legitimate trials. Abuse is bounded
  // by the daily guest cleanup cron and ghost-user storage cost is minimal.
  @Throttle({ default: { limit: 20, ttl: 3600000 } })
  async startTrial(@Body() dto: StartTrialDto) {
    return this.trialService.startTrial(dto);
  }

  @Post('migrate')
  @UseGuards(JwtAuthGuard)
  async migrateTrial(
    @Body() dto: MigrateTrialDto,
    @Headers('x-trial-token') trialToken: string | undefined,
    @Req() req: { user: { id: string } },
  ) {
    // The caller must be the real (post-OAuth) user, never the guest itself.
    // Without this check, a stale trial JWT in the Authorization header would
    // authenticate the request as the guest, and migrateGuestToUser would
    // throw a cryptic 403 deep in the service.
    if (req.user.id === dto.guestId) {
      throw new BadRequestException(
        'Migration must be triggered by the real user, not the guest',
      );
    }

    // Prefer the signed trial token: it proves the caller actually owned the
    // guest session, so they can't claim an arbitrary guestId from the body.
    // Body guestId is still accepted as a fallback for older clients but must
    // match the token when both are present.
    let guestId = dto.guestId;
    if (trialToken) {
      const guestPayload = this.authService.verifyToken(trialToken);
      if (!guestPayload) {
        throw new BadRequestException('Invalid trial token');
      }
      if (dto.guestId && dto.guestId !== guestPayload.id) {
        throw new BadRequestException('Trial token does not match guestId');
      }
      guestId = guestPayload.id;
    }

    if (!guestId) {
      throw new BadRequestException('Missing guest identity');
    }

    const result = await this.trialService.migrateGuestToUser(
      guestId,
      req.user.id,
    );
    return { success: true, alreadyMigrated: result.alreadyMigrated };
  }

  @Post('cleanup')
  async cleanupPostGuests(
    @Headers('user-agent') userAgent: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.verifyCronAuth(userAgent, authHeader);
    const count = await this.trialService.cleanupExpiredGuests();
    return { deleted: count };
  }

  @Get('cleanup')
  async cleanupGetGuests(
    @Headers('user-agent') userAgent: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.verifyCronAuth(userAgent, authHeader);
    const count = await this.trialService.cleanupExpiredGuests();
    return { deleted: count };
  }

  private verifyCronAuth(userAgent: string, authHeader: string) {
    const cronSecret = this.config.get<string>('CRON_SECRET');
    const isVercelCron = userAgent?.startsWith('vercel-cron');
    const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isVercelCron && !hasValidSecret) {
      throw new ForbiddenException('Unauthorized');
    }
  }
}
