import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";

import { InMemoryShortenRepository } from "@/repositories/in-memory/in-memory-shorten-repositoy";
import { FakeRateLimiterService } from "@/services/fake/fake-rate-limiter-service";
import { TooManyRequestsError } from "@/errors/http/too-many-requests-error";

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
    expect(response).toHaveProperty("expires_at");
    expect(response.expires_at).toBeNull();

    const createdShorten = shortenRepository.items[0];
    expect(createdShorten).toBeDefined();
  });

  it("should create a shorten with expiration", async () => {
    const response = await sut.execute({
      url: faker.internet.url(),
      expires_in_days: 30,
    });

    expect(response.expires_at).toBeInstanceOf(Date);

    const expectedMs = 30 * 24 * 60 * 60 * 1000;
    const diff = response.expires_at!.getTime() - Date.now();
    expect(diff).toBeGreaterThan(expectedMs - 1000);
    expect(diff).toBeLessThan(expectedMs + 1000);
  });

  it("should create a shorten without expiration when expires_in_days is null", async () => {
    const response = await sut.execute({
      url: faker.internet.url(),
      expires_in_days: null,
    });

    expect(response.expires_at).toBeNull();

    const createdShorten = shortenRepository.items[0];
    expect(createdShorten.expires_at).toBeNull();
  });
});

describe("use case: create shorten (with rate limiting)", () => {
  let rateLimiter: FakeRateLimiterService;

  beforeEach(() => {
    shortenRepository = new InMemoryShortenRepository();
    rateLimiter = new FakeRateLimiterService();
    sut = new CreateShortenUseCase(shortenRepository, rateLimiter);
  });

  it("should create shorten when not rate limited", async () => {
    rateLimiter.setLimited(false);

    const response = await sut.execute({
      url: faker.internet.url(),
      clientIp: "127.0.0.1",
    });

    expect(response).toHaveProperty("short_url");
    expect(shortenRepository.items).toHaveLength(1);
  });

  it("should throw TooManyRequestsError when rate limited", async () => {
    rateLimiter.setLimited(true);

    await expect(
      sut.execute({
        url: faker.internet.url(),
        clientIp: "127.0.0.1",
      }),
    ).rejects.toThrow(TooManyRequestsError);

    expect(shortenRepository.items).toHaveLength(0);
  });
});
