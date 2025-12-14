import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../infra/prisma.service';
import { AniListService } from './anilist.service';
import { AniListController } from './anilist.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AniListController],
  providers: [AniListService, PrismaService],
  exports: [AniListService],
})
export class AniListModule {}
