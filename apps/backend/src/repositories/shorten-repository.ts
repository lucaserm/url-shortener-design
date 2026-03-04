import type { Shorten } from "@/schmeas/shorten";

export interface ShortenRepository {
  findByShortCode(shortCode: string): Promise<Shorten | null>;
}
