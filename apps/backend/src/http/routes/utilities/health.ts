import Elysia from "elysia";

import { db } from "../../../db";

export const healthRoute = new Elysia().get(
  "/health",
  async ({ set }) => {
    const startedAt = Date.now();

    try {
      await db.execute("SELECT release_version FROM system.local", [], {
        prepare: true,
      });

      const latency = Date.now() - startedAt;

      if (latency > 200) {
        return {
          status: "degraded",
          database: "slow",
          latency: `${latency}ms`,
        };
      }

      return {
        status: "ok",
        database: "up",
        latency: `${latency}ms`,
      };
    } catch (error) {
      set.status = 503;
      return {
        status: "error",
        database: "down",
        message: error instanceof Error ? error.message : "unknown",
      };
    }
  },
  {
    detail: {
      tags: ["Utilities", "Health"],
      summary: "Health Check",
      description: "Check the health of the application and its dependencies.",
    },
  },
);
