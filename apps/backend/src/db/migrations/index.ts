export async function runMigrations() {
  await import("./001_create_keyspace.mjs");
  await import("./002_create_urls_table.mjs");
}