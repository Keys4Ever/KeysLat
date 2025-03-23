import { Injectable } from '@nestjs/common';
import { RedisConfig } from '../config/redis-config';

@Injectable()
export class RedisService {
    constructor(private readonly redisConfig: RedisConfig) {}

    async getOriginalUrl(shortUrl: string): Promise<string | null> {
        const client = this.redisConfig.getClient();

        try {
            const response = await client.get(shortUrl);
            if (!response) {
                return null;
            }

            // #TODO implement stats
            // stats.updateClicks(shortUrl);

            return JSON.parse(response);
        } catch (error) {
            throw new Error(`Redis Error: ${error.message}`);
        }
    }

    async setUrl(key: string, value: string, ttl: number): Promise<void> {
        const client = this.redisConfig.getClient();

        try {
            await client.set(key, JSON.stringify(value), {
                EX: ttl,
            });
        } catch (error) {
            throw new Error(`Redis Error: ${error.message}`);
        }
    }
}
