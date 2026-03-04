import { env } from "@/env";
import type { ShortenRepository } from "@/repositories/shorten-repository";
import { generateShortCode } from "@/utils/generate-short-code";

interface CreateShortenRequest {
  url: string;
}

interface CreateShortenResponse {
  short_url: string;
  short_code: string;
}

export class CreateShortenUseCase {
  constructor(private shortenRepository: ShortenRepository) {}

  async execute({ url }: CreateShortenRequest): Promise<CreateShortenResponse> {
    const short_code = generateShortCode();

    await this.shortenRepository.create({
      short_code,
      url: url,
    });


    return {
      short_url: `${env.API_URL}/${short_code}`,
      short_code,
    };
  }
}
