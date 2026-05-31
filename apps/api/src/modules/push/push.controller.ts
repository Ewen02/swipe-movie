import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PushService } from './push.service';
import {
  PushSubscriptionDto,
  UnsubscribeDto,
} from './dto/push-subscription.dto';

@Controller('push')
export class PushController {
  constructor(
    private readonly pushService: PushService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Public VAPID key the browser needs to create a subscription. Public by
   * design (it's the public half of the keypair); no auth required.
   */
  @Get('public-key')
  getPublicKey() {
    return { publicKey: this.config.get<string>('VAPID_PUBLIC_KEY') ?? null };
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async subscribe(
    @Req() req: Express.Request,
    @Body() dto: PushSubscriptionDto,
  ) {
    await this.pushService.saveSubscription(
      (req.user as { sub: string }).sub,
      dto,
    );
  }

  @Post('unsubscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(@Req() req: Express.Request, @Body() dto: UnsubscribeDto) {
    await this.pushService.removeSubscription(
      (req.user as { sub: string }).sub,
      dto.endpoint,
    );
  }
}
