import { Global, Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { AuthModule } from '../auth/auth.module';

/**
 * Global so any module (matches, rooms, …) can inject PushService to fan out
 * re-engagement notifications without re-importing. AuthModule provides the
 * passport strategies behind JwtAuthGuard used by the controller.
 */
@Global()
@Module({
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
  imports: [AuthModule],
})
export class PushModule {}
