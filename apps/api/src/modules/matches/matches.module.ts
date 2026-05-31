import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchesGateway } from './matches.gateway';
import { AuthModule } from '../auth/auth.module';
import { MoviesModule } from '../movies/movies.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, MatchesGateway],
  exports: [MatchesService, MatchesGateway],
  imports: [CacheModule.register(), AuthModule, MoviesModule, EmailModule],
})
export class MatchesModule {}
