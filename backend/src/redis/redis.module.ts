import { Module } from '@nestjs/common';
import { RedisConfig } from 'src/config/redis-config';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [RedisConfig, RedisService],
  exports: [RedisConfig, RedisService]
})
export class RedisModule {}
