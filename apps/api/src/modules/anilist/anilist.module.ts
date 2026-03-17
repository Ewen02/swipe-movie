import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AniListService } from './anilist.service';
import { AniListController } from './anilist.controller';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [ConfigModule, forwardRef(() => RecommendationsModule)],
  controllers: [AniListController],
  providers: [AniListService],
  exports: [AniListService],
})
export class AniListModule {}
