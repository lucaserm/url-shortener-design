import type { Shorten } from "@/schemas/shorten";

import type {
  CreateShortenProps,
  ShortenRepository,
} from "../shorten-repository";

export class InMemoryShortenRepository implements ShortenRepository {
  items: Shorten[] = [];

  async create({ short_code, url, expires_at }: CreateShortenProps): Promise<Shorten> {
    const shorten = {
      short_code,
      long_url: url,
      created_at: new Date(),
      expires_at: expires_at ?? null,
      click_count: 0,
      last_accessed_at: null,
    };

    this.items.push(shorten);

    return shorten;
  }

  async findByShortCode(shortCode: string): Promise<Shorten | null> {
    const shorten = this.items.find((item) => item.short_code === shortCode);
    return shorten || null;
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    const shorten = this.items.find((item) => item.short_code === shortCode);
    if (shorten) {
      shorten.click_count = (shorten.click_count ?? 0) + 1;
      shorten.last_accessed_at = new Date();
    }
  }
}
