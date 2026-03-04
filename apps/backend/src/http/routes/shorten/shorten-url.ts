import Elysia from "elysia";
import z from "zod";

import { db } from "@/db";
import { generateShortCode } from "@/utils/generate-short-code";

export const shortenUrlRoute = new Elysia().post(
  "/shorten",
  async ({ status, body }) => {
    const { url } = body;

    const short_code = generateShortCode();

    await db.execute(
      `INSERT INTO urls (short_code, long_url, created_at)
             VALUES (?, ?, ?)`,
      [short_code, url, new Date()],
      { prepare: true },
    );

    const response = {
      short_url: `http://localhost:3000/${short_code}`,
      short_code,
    };

    return status(201, response);
  },
  {
    body: z.object({
      url: z.url(),
    }),
    response: {
      201: z.object({ short_url: z.string(), short_code: z.string() }),
    },
  },
);
