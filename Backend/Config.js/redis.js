import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config();

const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';

export const redis = new Redis({
    port: redisPort,
    host: redisHost,
    lazyConnect: true, //redis not avai prevent server crash
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on('connect', () => { console.log('Successfully Connected to the redis') });
redis.on('error', (err) => { console.warn("Redis connection issue: ", err.message) })