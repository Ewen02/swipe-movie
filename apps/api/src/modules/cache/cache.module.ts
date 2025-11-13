import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        // If Redis URL is not configured, use in-memory cache
        if (!redisUrl) {
          return {
            ttl: 3600000, // 1 hour in milliseconds
            max: 100, // maximum number of items in cache
          };
        }

        // Use Redis cache
        return {
          store: await redisStore({
            url: redisUrl,
            ttl: 3600000, // 1 hour
          }),
        };
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheConfigModule {}
