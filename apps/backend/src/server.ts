import { app } from "./app";
import { db } from "./db";
import { runMigrations } from "./db/migrations";
import { env } from "./env";

await db
  .connect()
  .catch(() => console.log("Failed to connect to the database"));

if (env.RUN_MIGRATIONS) {
  await runMigrations();
}

if (env.NODE_ENV === "development") {
  app.get("/short-codes", async () => {
    const result = await db.execute(`SELECT * FROM urls`, { prepare: true });
    return { urls: result.rows };
  });
}

app.listen({ port: env.PORT, hostname: "0.0.0.0" }, ({ url }) => {
  const metricsUrl = new URL("/metrics", url);

  console.log(`🚀 HTTP server running at ${url}`);
  console.log(`📊 Metrics available at ${metricsUrl.toString()}`);
});
