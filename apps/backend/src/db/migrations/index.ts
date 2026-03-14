export async function runMigrations() {
  await import("./001_create_keyspace.mjs");
  await import("./002_create_urls_table.mjs");
  await import("./003_create_analytics_table.mjs");
  await import("./004_add_last_accessed_at.mjs");
}
