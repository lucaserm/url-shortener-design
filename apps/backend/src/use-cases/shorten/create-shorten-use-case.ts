import { env } from "@/env";
import { TooManyRequestsError } from "@/errors/http/too-many-requests-error";
import type { ShortenRepository } from "@/repositories/shorten-repository";
import type { RateLimiterService } from "@/services/rate-limiter-service";
import { generateShortCode } from "@/utils/generate-short-code";

interface CreateShortenRequest {
  url: string;
  expires_in_days?: number | null;
  clientIp?: string;
}

interface CreateShortenResponse {
  short_url: string;
  expires_at: Date | null;
}

export class CreateShortenUseCase {
  constructor(
    private shortenRepository: ShortenRepository,
    private rateLimiterService?: RateLimiterService,
  ) {}

  async execute({
    url,
    expires_in_days,
    clientIp,
  }: CreateShortenRequest): Promise<CreateShortenResponse> {
    if (this.rateLimiterService && clientIp) {
      const isLimited = await this.rateLimiterService.isRateLimited(clientIp);
      if (isLimited) {
        throw new TooManyRequestsError();
      }
    }

    const short_code = generateShortCode();

    const expires_at = expires_in_days
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    const shorten = await this.shortenRepository.create({
      short_code,
      url,
      expires_at,
    });

    return {
      short_url: `${env.API_URL}/${short_code}`,
      expires_at: shorten.expires_at ?? null,
    };
  }
}
