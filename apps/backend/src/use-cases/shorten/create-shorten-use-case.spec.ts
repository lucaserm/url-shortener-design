import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";

import { InMemoryShortenRepository } from "@/repositories/in-memory/in-memory-shorten-repositoy";

import { CreateShortenUseCase } from "./create-shorten-use-case";

let shortenRepository: InMemoryShortenRepository;
let sut: CreateShortenUseCase;

describe("use case: create shorten", () => {
  beforeEach(() => {
    shortenRepository = new InMemoryShortenRepository();
    sut = new CreateShortenUseCase(shortenRepository);
  });

  it("should create a new shorten with valid data", async () => {
    const response = await sut.execute({
      url: faker.internet.url(),
    });

    expect(response).toHaveProperty("short_url");
    expect(response).toHaveProperty("short_code");

    const createdShorten = shortenRepository.items[0];
    expect(createdShorten).toBeDefined();
    expect(createdShorten.short_code).toBe(response.short_code);
  });
});
