import "./loadEnv.js";
import express from "express";
import cors from "cors";
import { isDbConfigured } from "./db/client.js";
import uploadRouter from "./routes/upload.js";
import analysesRouter from "./routes/analyses.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", uploadRouter);
app.use("/api/analyses", analysesRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "WiseWork AI Backend is running",
    database: isDbConfigured() ? "configured" : "not configured (set DATABASE_URL in server/.env)",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (isDbConfigured()) {
    console.log("[db] DATABASE_URL is set — analysis runs will be saved to Neon");
  } else {
    console.log("[db] DATABASE_URL missing — add it to server/.env to persist analyses (see server/db/schema.sql)");
  }
});
