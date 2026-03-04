import { db } from "../../db";

await db.execute(`
  CREATE KEYSPACE IF NOT EXISTS shortener
  WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  };
`);

await db.execute(`USE shortener`);

console.log("Keyspace 'shortener' created or already exists.");
