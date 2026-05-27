import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RoomsService } from './rooms.service';
import { RoomCrudService } from './room-crud.service';
import { RoomMembershipService } from './room-membership.service';
import { RoomsController } from './rooms.controller';
import { SwipesModule } from '../swipes/swipes.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomCrudService, RoomMembershipService],
  imports: [SwipesModule, SubscriptionModule, CacheModule.register(), forwardRef(() => MatchesModule)],
  exports: [RoomsService],
})
export class RoomsModule {}
