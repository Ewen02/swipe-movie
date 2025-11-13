import { Module } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchesGateway } from './matches.gateway';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, MatchesGateway, PrismaService],
  exports: [MatchesService],
})
export class MatchesModule {}
