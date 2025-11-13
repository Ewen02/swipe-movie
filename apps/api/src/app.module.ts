import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SwipesModule } from './modules/swipes/swipes.module';
import { MatchesModule } from './modules/matches/matches.module';
import { MoviesModule } from './modules/movies/movies.module';
import { CacheConfigModule } from './modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheConfigModule,
    ThrottlerModule.forRoot([{ ttl: 60, limit: 60 }]),
    AuthModule,
    RoomsModule,
    SwipesModule,
    MatchesModule,
    MoviesModule,
  ],
})
export class AppModule {}
