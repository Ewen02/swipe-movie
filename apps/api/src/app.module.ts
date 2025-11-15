import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
    // Rate limiting: 100 requêtes par minute par IP
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 req/s max
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 req/min max
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 500, // 500 req/15min max
      },
    ]),
    AuthModule,
    RoomsModule,
    SwipesModule,
    MatchesModule,
    MoviesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
