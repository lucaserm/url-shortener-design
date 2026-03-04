import Elysia from "elysia";
import client from "prom-client";

export const metricsRoute = new Elysia().get(
  "/metrics",
  () => client.register.metrics(),
  {
    detail: {
      tags: ["Metrics"],
      summary: "Métricas do Prometheus",
      description: "Lista as métricas da aplicação para uso no Prometheus",
    },
  },
);
