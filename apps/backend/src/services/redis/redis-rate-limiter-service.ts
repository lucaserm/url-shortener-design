import { redis } from "@/db/redis";
import type { RateLimiterService } from "../rate-limiter-service";

interface RateLimiterOptions {
  windowSeconds: number;
  maxRequests: number;
}

export class RedisRateLimiterService implements RateLimiterService {
  constructor(private options: RateLimiterOptions) {}

  async isRateLimited(key: string): Promise<boolean> {
    const redisKey = `rate:${key}`;
    const now = Date.now();
    const windowStart = now - this.options.windowSeconds * 1000;

    const multi = redis.multi();
    multi.zremrangebyscore(redisKey, 0, windowStart);
    multi.zcard(redisKey);
    multi.zadd(redisKey, now, `${now}`);
    multi.expire(redisKey, this.options.windowSeconds);

    const results = await multi.exec();
    const count = results?.[1]?.[1] as number;

    return count >= this.options.maxRequests;
  }
}
