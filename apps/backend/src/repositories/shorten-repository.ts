import type { Shorten } from "@/schemas/shorten";

export interface CreateShortenProps {
  short_code: string;
  url: string;
  expires_at?: Date | null;
}

export interface ShortenRepository {
  create(props: CreateShortenProps): Promise<Shorten>;
  findByShortCode(shortCode: string): Promise<Shorten | null>;
  incrementClickCount(shortCode: string): Promise<void>;
}
