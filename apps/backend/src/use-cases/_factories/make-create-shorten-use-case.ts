import { env } from "@/env";
import { CassandraShortenRepository } from "@/repositories/cassandra/cassandra-shorten-repository";
import { RedisRateLimiterService } from "@/services/redis/redis-rate-limiter-service";
import { CreateShortenUseCase } from "../shorten/create-shorten-use-case";

export function makeCreateShortenUseCase() {
  const shortenRepository = new CassandraShortenRepository();
  const rateLimiter = new RedisRateLimiterService({
    windowSeconds: env.RATE_LIMIT_WINDOW_SECONDS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  });
  const useCase = new CreateShortenUseCase(shortenRepository, rateLimiter);
  return useCase;
}
