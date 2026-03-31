import express from "express";
import multer from "multer";
import fs from "fs";
import { parseFile } from "../services/fileParser.js";
import { analyzeResume } from "../services/aiAnalyzer.js";
import { scrapeLinkedIn } from "../services/linkedinScraper.js";
import { saveAnalysisRun } from "../services/analysisStore.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/resume", upload.array("resumes", 5), async (req, res) => {
  try {
    const files = (req as express.Request & { files?: Express.Multer.File[] }).files ?? [];
    const { linkedinUrl, candidateName } = req.body as {
      linkedinUrl?: string;
      candidateName?: string;
    };

    if (files.length === 0 && !linkedinUrl) {
      return res.status(400).json({ error: "Provide at least a Resume or a LinkedIn URL." });
    }

    let linkedinData: string | null = null;
    if (linkedinUrl) {
      linkedinData = await scrapeLinkedIn(linkedinUrl);
    }

    const results = await Promise.all(
      files.length > 0
        ? files.map(async (file) => {
            try {
              const text = await parseFile(file);
              const fullText = linkedinData ? `${text}\n\nLINKEDIN SCRAPED DATA:\n${linkedinData}` : text;

              const analysis = await analyzeResume(fullText, linkedinUrl);
              return { fileName: file.originalname, candidateName, ...analysis };
            } catch (error) {
              console.error(`Error processing file ${file.originalname}:`, error);
              return { fileName: file.originalname, candidateName, error: "Failed" };
            } finally {
              fs.unlinkSync(file.path);
            }
          })
        : [
            (async () => {
              try {
                const fullText = linkedinData ? `LINKEDIN SCRAPED DATA:\n${linkedinData}` : "No resume provided.";
                const analysis = await analyzeResume(fullText, linkedinUrl);
                return { fileName: "LinkedIn Profile", candidateName, ...analysis };
              } catch {
                return { fileName: "LinkedIn Profile", candidateName, error: "Failed" };
              }
            })(),
          ],
    );

    for (const row of results) {
      const err =
        row && typeof row === "object" && "error" in row && row.error != null
          ? String(row.error)
          : null;
      await saveAnalysisRun({
        candidateName: typeof row.candidateName === "string" ? row.candidateName : candidateName,
        linkedinUrl,
        fileName: typeof row.fileName === "string" ? row.fileName : undefined,
        result: err ? null : { ...(row as Record<string, unknown>) },
        error: err,
      });
    }

    res.json({ results });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
