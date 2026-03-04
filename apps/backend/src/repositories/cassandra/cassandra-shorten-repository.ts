import { db } from "@/db";
import type { ShortenRepository } from "../shorten-repository";

export class CassandraShortenRepository implements ShortenRepository {
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
