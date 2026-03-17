import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchesGateway } from './matches.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, MatchesGateway],
  exports: [MatchesService, MatchesGateway],
  imports: [CacheModule.register(), AuthModule],
})
export class MatchesModule {}
