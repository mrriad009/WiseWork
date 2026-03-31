import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/** server/.env regardless of process cwd (PM2, scripts, etc.) */
const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(here, "..", ".env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn(`[loadEnv] No .env at ${envPath}`);
  dotenv.config();
}
