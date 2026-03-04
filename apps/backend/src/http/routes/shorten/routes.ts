import Elysia from "elysia";

import { redirectByCodeRoute } from "./redirect-by-code";
import { shortenUrlRoute } from "./shorten-url";

export const shortenRoutes = new Elysia()
  .use(shortenUrlRoute)
  .use(redirectByCodeRoute);
