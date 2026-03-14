import { db } from "../../db";

await db.execute(`
  CREATE TABLE IF NOT EXISTS url_analytics (
    short_code text PRIMARY KEY,
    click_count counter
  )
`);
console.log("Table 'url_analytics' created or already exists.");
