import { cors } from "@elysiajs/cors";
import Elysia from "elysia";

import { env } from "@/env";
import { errorHandlerPlugin } from "@/http/plugins/error-handler-plugin";
import { openapiPlugin } from "@/http/plugins/openapi-plugin";
import { requestCounterPlugin } from "@/http/plugins/request-counter-plugin";
import { shortenRoutes } from "@/http/routes/shorten/routes";
import { utilitiesRoutes } from "@/http/routes/utilities/routes";

export const app = new Elysia()
  /// Plugins
  .onError(errorHandlerPlugin())
  .onAfterResponse(requestCounterPlugin)
  .use(cors({ origin: env.WEB_URL }))
  .use(openapiPlugin)

  /// Routes
  .get("/", () => ({ status: "Ok" }))
  .use(utilitiesRoutes)
  .use(shortenRoutes);
