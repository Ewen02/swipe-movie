import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SwipesModule } from './modules/swipes/swipes.module';
import { MatchesModule } from './modules/matches/matches.module';
import { MoviesModule } from './modules/movies/movies.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CacheConfigModule } from './modules/cache/cache.module';
import { TraktModule } from './modules/trakt/trakt.module';
import { AniListModule } from './modules/anilist/anilist.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './modules/health/health.controller';
import { HttpsRedirectMiddleware } from './common/middleware/https-redirect.middleware';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { PrismaModule } from './infra/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
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
    SubscriptionModule,
    TraktModule,
    AniListModule,
    RecommendationsModule,
    UsersModule,
    EmailModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpsRedirectMiddleware)
      .forRoutes('*')
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
