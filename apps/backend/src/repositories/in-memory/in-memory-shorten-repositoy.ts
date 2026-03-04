import type { Shorten } from "@/schemas/shorten";

import type {
  CreateShortenProps,
  ShortenRepository,
} from "../shorten-repository";

export class InMemoryShortenRepository implements ShortenRepository {
  items: Shorten[] = [];

  async create({ short_code, url }: CreateShortenProps): Promise<Shorten> {
    const shorten = {
      short_code,
      long_url: url,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };

    this.items.push(shorten);

    return shorten;
  }

  async findByShortCode(shortCode: string): Promise<Shorten | null> {
    const shorten = this.items.find((item) => item.short_code === shortCode);
    return shorten || null;
  }
}
