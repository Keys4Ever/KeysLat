import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisConfig implements OnModuleDestroy {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.connect();
    }

    getClient(): RedisClientType {
        return this.client;
    }

    async onModuleDestroy() {
        await this.client.disconnect();
    }
}
