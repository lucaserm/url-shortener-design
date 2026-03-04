import { db } from "../../db";

await db.execute(`
  CREATE TABLE IF NOT EXISTS urls (
    short_code text PRIMARY KEY,
    long_url text,
    created_at timestamp,
    expires_at timestamp
  )
`);
console.log("Table 'urls' created or already exists.");
