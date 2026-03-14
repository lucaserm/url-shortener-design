import Elysia from "elysia";
import { z } from "zod";

import { makeGetShortenByShortCodeUseCase } from "@/use-cases/_factories/make-get-shorten-by-short-code-use-case";

const redirectByCodeParams = z.object({
  short_code: z.string(),
});

export const redirectByCodeRoute = new Elysia().get(
  "/:short_code",
  async ({ params, redirect }) => {
    const { short_code } = params;

    const useCase = makeGetShortenByShortCodeUseCase();
    const { shorten } = await useCase.execute({ shortCode: short_code });

    return redirect(shorten.long_url, 301);
  },
  {
    params: redirectByCodeParams,
    detail: {
      tags: ["Shorten"],
      summary: "Redirect by short code",
      description:
        "Receive a short code and redirect to the original URL associated with it",
    },
  },
);
