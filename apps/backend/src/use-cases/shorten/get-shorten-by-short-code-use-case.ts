import { GoneError } from "@/errors/http/gone-error";
import { NotFoundError } from "@/errors/http/not-found-error";
import type { ShortenRepository } from "@/repositories/shorten-repository";
import type { Shorten } from "@/schemas/shorten";
import type { CacheService } from "@/services/cache-service";

interface GetShortenByShortCodeRequest {
  shortCode: string;
}

interface GetShortenByShortCodeResponse {
  shorten: Shorten;
}

export class GetShortenByShortCodeUseCase {
  constructor(
    private shortenRepository: ShortenRepository,
    private cacheService?: CacheService,
  ) {}

  async execute({
    shortCode,
  }: GetShortenByShortCodeRequest): Promise<GetShortenByShortCodeResponse> {
    // Check cache first
    if (this.cacheService) {
      const cached = await this.cacheService.get(shortCode);
      if (cached) {
        const parsed = JSON.parse(cached) as Shorten;
        const expiresAt = parsed.expires_at ? new Date(parsed.expires_at) : null;

        if (expiresAt && expiresAt < new Date()) {
          this.cacheService.del(shortCode).catch(() => {});
          throw new GoneError("Shorten has expired");
        }

        this.shortenRepository.incrementClickCount(shortCode).catch(() => {});
        return { shorten: { ...parsed, expires_at: expiresAt } };
      }
    }

    const shorten = await this.shortenRepository.findByShortCode(shortCode);

    if (!shorten) {
      throw new NotFoundError("Shorten not found");
    }

    if (shorten.expires_at && shorten.expires_at < new Date()) {
      throw new GoneError("Shorten has expired");
    }

    // Populate cache
    if (this.cacheService) {
      const ttlSeconds = shorten.expires_at
        ? Math.floor((shorten.expires_at.getTime() - Date.now()) / 1000)
        : undefined;

      this.cacheService
        .set(shortCode, JSON.stringify(shorten), ttlSeconds)
        .catch(() => {});
    }

    // Fire-and-forget: don't block redirect on analytics write
    this.shortenRepository.incrementClickCount(shortCode).catch(() => {});

    return {
      shorten,
    };
  }
}
