import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SwipesService } from './swipes.service';
import { SwipesController } from './swipes.controller';
import { MatchesModule } from '../matches/matches.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  controllers: [SwipesController],
  providers: [SwipesService],
  exports: [SwipesService],
  imports: [
    MatchesModule,
    forwardRef(() => SubscriptionModule),
    forwardRef(() => RecommendationsModule),
    CacheModule.register(),
  ],
})
export class SwipesModule {}
