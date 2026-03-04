import Elysia from "elysia";

import { makeGetShortenByShortCodeUseCase } from "@/use-cases/_factories/make-get-shorten-by-short-code-use-case";

export const redirectByCodeRoute = new Elysia().get(
  "/:short_code",
  async ({ params, redirect }) => {
    const { short_code } = params;

    const useCase = makeGetShortenByShortCodeUseCase();
    const { shorten } = await useCase.execute({ shortCode: short_code });

    return redirect(shorten.long_url, 301);
  },
);
