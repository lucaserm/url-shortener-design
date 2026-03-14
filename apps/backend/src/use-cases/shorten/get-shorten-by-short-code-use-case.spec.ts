import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";

import { makeShorten } from "@test/factories/make-shorten";
import { NotFoundError } from "@/errors/http/not-found-error";
import { InMemoryShortenRepository } from "@/repositories/in-memory/in-memory-shorten-repositoy";
import { FakeCacheService } from "@/services/fake/fake-cache-service";

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
      expires_at: new Date(Date.now() - 1000),
    });

    shortenRepository.items.push(shorten);

    expect(
      sut.execute({
        shortCode: shorten.short_code,
      }),
    ).rejects.toThrow(GoneError);
  });

  it("should return shorten when expires_at is null (never expires)", async () => {
    const shorten = makeShorten({ expires_at: null });
    shortenRepository.items.push(shorten);

    const response = await sut.execute({
      shortCode: shorten.short_code,
    });

    expect(response.shorten.short_code).toBe(shorten.short_code);
  });

  it("should increment click count on successful lookup", async () => {
    const shorten = makeShorten();
    shortenRepository.items.push(shorten);

    await sut.execute({ shortCode: shorten.short_code });

    await new Promise((r) => setTimeout(r, 10));

    const updated = shortenRepository.items[0];
    expect(updated.click_count).toBe(1);
    expect(updated.last_accessed_at).toBeInstanceOf(Date);
  });

  it("should increment click count multiple times", async () => {
    const shorten = makeShorten();
    shortenRepository.items.push(shorten);

    await sut.execute({ shortCode: shorten.short_code });
    await sut.execute({ shortCode: shorten.short_code });
    await sut.execute({ shortCode: shorten.short_code });

    await new Promise((r) => setTimeout(r, 10));

    const updated = shortenRepository.items[0];
    expect(updated.click_count).toBe(3);
  });

  it("should not increment click count when shorten is expired", async () => {
    const shorten = makeShorten({
      expires_at: new Date(Date.now() - 1000),
    });
    shortenRepository.items.push(shorten);

    expect(
      sut.execute({ shortCode: shorten.short_code }),
    ).rejects.toThrow(GoneError);

    await new Promise((r) => setTimeout(r, 10));

    const updated = shortenRepository.items[0];
    expect(updated.click_count).toBe(0);
  });
});

describe("use case: get shorten by short code (with cache)", () => {
  let cacheService: FakeCacheService;

  beforeEach(() => {
    shortenRepository = new InMemoryShortenRepository();
    cacheService = new FakeCacheService();
    sut = new GetShortenByShortCodeUseCase(shortenRepository, cacheService);
  });

  it("should populate cache on first lookup (cache miss)", async () => {
    const shorten = makeShorten();
    shortenRepository.items.push(shorten);

    await sut.execute({ shortCode: shorten.short_code });

    const cached = await cacheService.get(shorten.short_code);
    expect(cached).not.toBeNull();

    const parsed = JSON.parse(cached!);
    expect(parsed.short_code).toBe(shorten.short_code);
    expect(parsed.long_url).toBe(shorten.long_url);
  });

  it("should return from cache on second lookup (cache hit)", async () => {
    const shorten = makeShorten();
    shortenRepository.items.push(shorten);

    // First call: cache miss, populates cache
    await sut.execute({ shortCode: shorten.short_code });

    // Remove from repository to prove second call uses cache
    shortenRepository.items = [];

    // Second call: cache hit
    const response = await sut.execute({ shortCode: shorten.short_code });
    expect(response.shorten.short_code).toBe(shorten.short_code);
  });

  it("should throw GoneError and delete cache for expired cached entry", async () => {
    const shorten = makeShorten({
      expires_at: new Date(Date.now() - 1000),
    });

    // Manually put expired entry in cache
    await cacheService.set(shorten.short_code, JSON.stringify(shorten));

    await expect(
      sut.execute({ shortCode: shorten.short_code }),
    ).rejects.toThrow(GoneError);

    // Wait for fire-and-forget cache delete
    await new Promise((r) => setTimeout(r, 10));

    const cached = await cacheService.get(shorten.short_code);
    expect(cached).toBeNull();
  });
});
