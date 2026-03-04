import { db } from "@/db";
import type {
  CreateShortenProps,
  ShortenRepository,
} from "../shorten-repository";

export class CassandraShortenRepository implements ShortenRepository {
  async create({ short_code, url }: CreateShortenProps) {
    const createdAt = new Date();

    await db.execute(
      `INSERT INTO urls (short_code, long_url, created_at)
             VALUES (?, ?, ?)`,
      [short_code, url, createdAt],
      { prepare: true },
    );

    return {
      short_code,
      long_url: url,
      created_at: createdAt,
    };
  }

  async findByShortCode(shortCode: string) {
    const result = await db.execute(
      `SELECT * FROM urls WHERE short_code = ?`,
      [shortCode],
      { prepare: true },
    );

    const response = result?.rows[0];

    if (!response) {
      return null;
    }

    return {
      short_code: response.short_code,
      long_url: response.long_url,
      created_at: response.created_at,
      expires_at: response.expires_at,
    };
  }
}
