import { Module } from '@nestjs/common';
import IORedis from 'ioredis';

@Module({
  providers: [
    { provide: 'REDIS', useFactory: () => new IORedis(process.env.REDIS_URL!) },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
