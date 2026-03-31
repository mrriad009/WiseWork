import express from "express";
import { isDbConfigured } from "../db/client.js";
import { listRecentAnalysisRuns } from "../services/analysisStore.js";

const router = express.Router();

/** Recent saved runs from Neon */
router.get("/", async (req, res) => {
  if (!isDbConfigured()) {
    return res.json({ runs: [], databaseConfigured: false });
  }

  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const runs = await listRecentAnalysisRuns(Number.isFinite(limit) ? limit : 50);
    res.json({ runs, databaseConfigured: true });
  } catch (e) {
    console.error("[db] list analyses:", e);
    res.status(500).json({ error: "Failed to load analyses" });
  }
});

export default router;
