import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let ccusageDb: ReturnType<typeof drizzle> | null = null;
let llmeterDb: ReturnType<typeof drizzle> | null = null;

export function getCCusageDb() {
  if (!ccusageDb) {
    const pool = new Pool({
      connectionString: process.env.CCUSAGE_DATABASE_URL,
      max: 5,
    });
    ccusageDb = drizzle({ client: pool });
  }
  return ccusageDb;
}

export function getLLMeterDb() {
  if (!llmeterDb) {
    const pool = new Pool({
      connectionString: process.env.LLMETER_DATABASE_URL,
      max: 5,
    });
    llmeterDb = drizzle({ client: pool });
  }
  return llmeterDb;
}
