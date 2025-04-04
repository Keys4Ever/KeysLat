import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis client connected!'))
redisClient.connect();


export default redisClient;
