import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";

import { makeShorten } from "@test/factories/make-shorten";
import { NotFoundError } from "@/errors/http/not-found-error";
import { InMemoryShortenRepository } from "@/repositories/in-memory/in-memory-shorten-repositoy";

import { GetShortenByShortCodeUseCase } from "./get-shorten-by-short-code-use-case";
import { GoneError } from "@/errors/http/gone-error";

let shortenRepository: InMemoryShortenRepository;
let sut: GetShortenByShortCodeUseCase;

describe("use case: get shorten by short code", () => {
  beforeEach(() => {
    shortenRepository = new InMemoryShortenRepository();
    sut = new GetShortenByShortCodeUseCase(shortenRepository);
  });

  it("should create a new shorten with valid data", async () => {
    const shorten = makeShorten();
    shortenRepository.items.push(shorten);

    const response = await sut.execute({
      shortCode: shorten.short_code,
    });

    expect(response).toHaveProperty("shorten");
    expect(response.shorten.short_code).toBe(shorten.short_code);
  });

  it("should throw an error if the short code does not exist", async () => {
    expect(
      sut.execute({
        shortCode: faker.string.alphanumeric(6),
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw an error if the shorten was expired", async () => {
    const shorten = makeShorten({
      expires_at: new Date(Date.now() - 1000), // expired 1 second ago
    });

    shortenRepository.items.push(shorten);

    expect(
      sut.execute({
        shortCode: shorten.short_code,
      }),
    ).rejects.toThrow(GoneError);
  });
});
