import Elysia from "elysia";

import { healthRoute } from "./health";
import { metricsRoute } from "./metrics";

export const utilitiesRoutes = new Elysia().use(healthRoute).use(metricsRoute);
