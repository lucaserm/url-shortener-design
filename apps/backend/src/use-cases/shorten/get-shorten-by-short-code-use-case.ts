import { NotFoundError } from "@/errors/http/not-found-error";
import type { ShortenRepository } from "@/repositories/shorten-repository";
import type { Shorten } from "@/schemas/shorten";

interface GetShortenByShortCodeRequest {
  shortCode: string;
}

interface GetShortenByShortCodeResponse {
  shorten: Shorten;
}

export class GetShortenByShortCodeUseCase {
  constructor(private shortenRepository: ShortenRepository) {}

  async execute({
    shortCode,
  }: GetShortenByShortCodeRequest): Promise<GetShortenByShortCodeResponse> {
    const shorten = await this.shortenRepository.findByShortCode(shortCode);

    if (!shorten) {
      throw new NotFoundError("Shorten not found");
    }

    return {
      shorten,
    };
  }
}
