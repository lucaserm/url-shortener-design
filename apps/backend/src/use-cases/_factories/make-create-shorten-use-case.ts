import { CassandraShortenRepository } from "@/repositories/cassandra/cassandra-shorten-repository";
import { CreateShortenUseCase } from "../shorten/create-shorten-use-case";

export function makeCreateShortenUseCase() {
  const shortenRepository = new CassandraShortenRepository();
  const useCase = new CreateShortenUseCase(shortenRepository);
  return useCase;
}