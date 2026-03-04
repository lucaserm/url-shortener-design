import type { Shorten } from "@/schemas/shorten";

export interface CreateShortenProps {
  short_code: string;
  url: string;
}

export interface ShortenRepository {
  create(props: CreateShortenProps): Promise<Shorten>;
  findByShortCode(shortCode: string): Promise<Shorten | null>;
}
