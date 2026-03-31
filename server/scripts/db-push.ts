/**
 * Apply server/db/schema.sql to Neon (like "db push" for this repo).
 * Requires DATABASE_URL in server/.env
 *
 *   cd server && npm run db:push
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));
const serverRoot = join(here, "..");

dotenv.config({ path: join(serverRoot, ".env") });

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set. Add your Neon connection string to server/.env");
  process.exit(1);
}

const schemaPath = join(serverRoot, "db", "schema.sql");
let raw = readFileSync(schemaPath, "utf8");

raw = raw
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");

const statements = raw
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

if (statements.length === 0) {
  console.error("No SQL statements found in", schemaPath);
  process.exit(1);
}

const sql = neon(url);

for (const stmt of statements) {
  const ddl = stmt.endsWith(";") ? stmt : `${stmt};`;
  console.log("[db:push]", ddl.split("\n")[0]!.slice(0, 72) + (ddl.length > 72 ? "…" : ""));
  await sql.query(ddl, []);
}

console.log("[db:push] OK —", statements.length, "statement(s) applied.");
