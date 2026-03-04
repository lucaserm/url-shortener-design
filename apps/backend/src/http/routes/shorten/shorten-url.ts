import Elysia from "elysia";
import z from "zod";

import { makeCreateShortenUseCase } from "@/use-cases/_factories/make-create-shorten-use-case";

const shortenUrlBody = z.object({
  url: z.url(),
});

const shortenUrlResponse = z.object({
  short_url: z.string(),
  short_code: z.string(),
});

export const shortenUrlRoute = new Elysia().post(
  "/shorten",
  async ({ status, body }) => {
    const { url } = body;

    const useCase = makeCreateShortenUseCase();
    const { short_code, short_url } = await useCase.execute({ url });

    return status(201, { short_code, short_url });
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
