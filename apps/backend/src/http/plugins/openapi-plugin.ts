import { openapi } from "@elysiajs/openapi";
import { z } from "zod";

import { env } from "@/env";

export function openapiPlugin() {
  return openapi({
    path: "/docs",
    specPath: "/docs/json",
    enabled: env.NODE_ENV !== "production",
    mapJsonSchema: {
      zod: z.toJSONSchema,
    },
  });
}
