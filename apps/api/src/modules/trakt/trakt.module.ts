import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../infra/prisma.service';
import { TraktService } from './trakt.service';
import { TraktController } from './trakt.controller';

@Module({
  imports: [ConfigModule],
  controllers: [TraktController],
  providers: [TraktService, PrismaService],
  exports: [TraktService],
})
export class TraktModule {}
