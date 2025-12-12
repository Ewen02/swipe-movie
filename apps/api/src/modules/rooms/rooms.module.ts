import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SwipesModule } from '../swipes/swipes.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
  imports: [SwipesModule, SubscriptionModule, CacheModule.register()],
})
export class RoomsModule {}
