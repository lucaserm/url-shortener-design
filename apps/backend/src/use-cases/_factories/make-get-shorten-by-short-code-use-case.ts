import { CassandraShortenRepository } from "@/repositories/cassandra/cassandra-shorten-repository";
import { RedisCacheService } from "@/services/redis/redis-cache-service";
import { GetShortenByShortCodeUseCase } from "../shorten/get-shorten-by-short-code-use-case";

export function makeGetShortenByShortCodeUseCase() {
  const shortenRepository = new CassandraShortenRepository();
  const cacheService = new RedisCacheService();
  const useCase = new GetShortenByShortCodeUseCase(
    shortenRepository,
    cacheService,
  );
  return useCase;
}
