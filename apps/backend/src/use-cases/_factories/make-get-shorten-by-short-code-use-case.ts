import { CassandraShortenRepository } from "@/repositories/cassandra/cassandra-shorten-repository";
import { GetShortenByShortCodeUseCase } from "../shorten/get-shorten-by-short-code-use-case";

export function makeGetShortenByShortCodeUseCase() {
  const shortenRepository = new CassandraShortenRepository();
  const useCase = new GetShortenByShortCodeUseCase(shortenRepository);
  return useCase;
}
