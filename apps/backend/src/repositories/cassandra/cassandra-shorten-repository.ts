import { db } from "@/db";
import type {
  CreateShortenProps,
  ShortenRepository,
} from "../shorten-repository";

export class CassandraShortenRepository implements ShortenRepository {
  async create({ short_code, url, expires_at }: CreateShortenProps) {
    const createdAt = new Date();

    await db.execute(
      `INSERT INTO urls (short_code, long_url, created_at, expires_at)
             VALUES (?, ?, ?, ?)`,
      [short_code, url, createdAt, expires_at ?? null],
      { prepare: true },
    );

    return {
      short_code,
      long_url: url,
      created_at: createdAt,
      expires_at: expires_at ?? null,
      click_count: 0,
      last_accessed_at: null,
    };
  }

  async findByShortCode(shortCode: string) {
    const [urlResult, analyticsResult] = await Promise.all([
      db.execute(
        `SELECT * FROM urls WHERE short_code = ?`,
        [shortCode],
        { prepare: true },
      ),
      db.execute(
        `SELECT click_count FROM url_analytics WHERE short_code = ?`,
        [shortCode],
        { prepare: true },
      ),
    ]);

    const response = urlResult?.rows[0];

    if (!response) {
      return null;
    }

    const clickCount = analyticsResult?.rows[0]?.click_count?.toInt?.() ?? 0;

    return {
      short_code: response.short_code,
      long_url: response.long_url,
      created_at: response.created_at,
      expires_at: response.expires_at ?? null,
      click_count: clickCount,
      last_accessed_at: response.last_accessed_at ?? null,
    };
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    await Promise.all([
      db.execute(
        `UPDATE url_analytics SET click_count = click_count + 1 WHERE short_code = ?`,
        [shortCode],
        { prepare: true },
      ),
      db.execute(
        `UPDATE urls SET last_accessed_at = ? WHERE short_code = ?`,
        [new Date(), shortCode],
        { prepare: true },
      ),
    ]);
  }
}
