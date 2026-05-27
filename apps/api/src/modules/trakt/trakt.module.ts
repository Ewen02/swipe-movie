import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TraktService } from './trakt.service';
import { TraktAuthService } from './trakt-auth.service';
import { TraktSyncService } from './trakt-sync.service';
import { TraktController } from './trakt.controller';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [ConfigModule, forwardRef(() => RecommendationsModule)],
  controllers: [TraktController],
  providers: [TraktService, TraktAuthService, TraktSyncService],
  exports: [TraktService],
})
export class TraktModule {}
