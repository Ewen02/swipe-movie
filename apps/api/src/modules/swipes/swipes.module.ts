import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { SwipesService } from './swipes.service';
import { SwipesController } from './swipes.controller';
import { MatchesModule } from '../matches/matches.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  controllers: [SwipesController],
  providers: [SwipesService, PrismaService],
  exports: [SwipesService],
  imports: [MatchesModule, forwardRef(() => SubscriptionModule)],
})
export class SwipesModule {}
