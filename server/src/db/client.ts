import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function connectionString(): string | undefined {
  return process.env.DATABASE_URL?.trim();
}

/** True when `DATABASE_URL` is set (after `loadEnv` has run). */
export function isDbConfigured(): boolean {
  return Boolean(connectionString());
}

/**
 * Neon SQL client — lazily created on first use so `DATABASE_URL` is read
 * after dotenv has loaded (avoids empty env at module load).
 */
export function getSql(): ReturnType<typeof neon> | null {
  const url = connectionString();
  if (!url) return null;
  if (!_sql) {
    _sql = neon(url);
  }
  return _sql;
}
