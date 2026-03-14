import { redis } from "@/db/redis";
import type { CacheService } from "../cache-service";

export class RedisCacheService implements CacheService {
  private prefix = "url:";

  async get(key: string): Promise<string | null> {
    return redis.get(this.prefix + key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await redis.set(this.prefix + key, value, "EX", ttlSeconds);
    } else {
      await redis.set(this.prefix + key, value);
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(this.prefix + key);
  }
}
