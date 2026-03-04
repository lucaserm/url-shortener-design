import Elysia from "elysia";
import client from "prom-client";

export const metricsRoute = new Elysia().get(
  "/metrics",
  () => client.register.metrics(),
  {
    detail: {
      tags: ["Metrics", "Utilities"],
      summary: "Prometheus Metrics",
      description: "Lists all Prometheus metrics for the application",
    },
  },
);
