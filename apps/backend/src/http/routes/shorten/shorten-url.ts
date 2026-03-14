import Elysia from "elysia";
import z from "zod";

import { makeCreateShortenUseCase } from "@/use-cases/_factories/make-create-shorten-use-case";

const shortenUrlBody = z.object({
  url: z.url(),
  expires_in_days: z.number().int().positive().nullish(),
});

const shortenUrlResponse = z.object({
  short_url: z.string(),
  expires_at: z.string().nullish(),
});

export const shortenUrlRoute = new Elysia().post(
  "/shorten",
  async ({ status, body, request, server }) => {
    const { url, expires_in_days } = body;

    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp =
      forwarded?.split(",")[0]?.trim() ??
      server?.requestIP(request)?.address ??
      "unknown";

    const useCase = makeCreateShortenUseCase();
    const { short_url, expires_at } = await useCase.execute({
      url,
      expires_in_days,
      clientIp,
    });

    return status(201, {
      short_url,
      expires_at: expires_at?.toISOString() ?? null,
    });
  },
  {
    body: shortenUrlBody,
    response: {
      201: shortenUrlResponse,
    },
    detail: {
      tags: ["Shorten"],
      summary: "Shorten a URL",
      description: "Receive a URL and return the shortened version of it",
    },
  },
);
