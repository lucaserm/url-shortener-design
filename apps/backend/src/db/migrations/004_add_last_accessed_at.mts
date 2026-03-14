import { db } from "../../db";

await db.execute(`
  ALTER TABLE urls ADD last_accessed_at timestamp
`);
console.log("Column 'last_accessed_at' added to 'urls' table.");
