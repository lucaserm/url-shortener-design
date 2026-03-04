import type { AfterResponseHandler } from "elysia";

import { requestCounter as promRequestCounter } from "@/lib/prom-client";

export const requestCounterPlugin: AfterResponseHandler = ({
  path,
  set,
  request,
}) => {
  promRequestCounter.inc({
    method: request.method,
    route: path,
    status: String(set.status),
  });
};
