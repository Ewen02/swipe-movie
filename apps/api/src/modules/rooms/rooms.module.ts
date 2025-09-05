import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SwipesModule } from '../swipes/swipes.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
  imports: [SwipesModule],
})
export class RoomsModule {}
