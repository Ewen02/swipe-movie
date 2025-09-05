import { Module } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, PrismaService],
  exports: [MatchesService],
})
export class MatchesModule {}
