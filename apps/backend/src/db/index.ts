import { Client } from "cassandra-driver";
import { env } from "../env";

export const db = new Client({
  contactPoints: [env.CASSANDRA_HOST],
  localDataCenter: "datacenter1",
  keyspace: "shortener",
});
