import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TrialService } from './trial.service';
import { StartTrialDto } from './dto/start-trial.dto';
import { MigrateTrialDto } from './dto/migrate-trial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trial')
export class TrialController {
  constructor(private readonly trialService: TrialService) {}

  @Post('start')
  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  async startTrial(@Body() dto: StartTrialDto) {
    return this.trialService.startTrial(dto);
  }

  @Post('migrate')
  @UseGuards(JwtAuthGuard)
  async migrateTrial(
    @Body() dto: MigrateTrialDto,
    @Req() req: { user: { id: string } },
  ) {
    await this.trialService.migrateGuestToUser(dto.guestId, req.user.id);
    return { success: true };
  }
}
