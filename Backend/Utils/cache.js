import { redis } from "../Config.js/redis.js";
const CACHE_PREFIX = "summary:";

export const setCache = async (userId, data, ttl = 600) => {
    try {
        const key = `${CACHE_PREFIX}${userId}`;
        await redis.set(key, JSON.stringify(data), 'EX', ttl);
    }
    catch (err) {
        console.warn('Cache Set failed', err.message);
    }
};

export const getCache = async (userId) => {
    try {
        const key = `${CACHE_PREFIX}${userId}`;
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (err) {
        console.warn("Cache get failed", err.message);
        return null;
    }
}

export const delCache = async (userId) => {
    try {
        const key = `${CACHE_PREFIX}${userId}`;
        await redis.del(key);
    }
    catch (err) {
        console.warn('Cache del failed', err.message);
    }
};