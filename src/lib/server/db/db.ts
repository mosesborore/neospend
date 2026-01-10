import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "$env/dynamic/private";
import postgres from "pg";

import * as schema from "./schemas";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

let pool = new postgres.Pool({
  connectionString: env.DATABASE_URL,
  maxLifetimeSeconds: 300,
});
export const db = drizzle(pool, { schema: schema });
