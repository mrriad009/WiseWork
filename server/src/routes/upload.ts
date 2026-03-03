
import express from 'express';
import multer from 'multer';
import { parseFile } from '../services/fileParser.js';
import { analyzeResume } from '../services/aiAnalyzer.js';
import { scrapeLinkedIn } from '../services/linkedinScraper.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/resume', upload.array('resumes', 5), async (req, res) => {
    try {
        const files = (req as any).files || [];
        const { linkedinUrl, candidateName } = req.body;

        if (files.length === 0 && !linkedinUrl) {
            return res.status(400).json({ error: 'Provide at least a Resume or a LinkedIn URL.' });
        }

        // Pre-fetch linkedin data if URL provided
        let linkedinData = null;
        if (linkedinUrl) {
            linkedinData = await scrapeLinkedIn(linkedinUrl);
        }

        const results = await Promise.all(
            files.length > 0 ?
                files.map(async (file: any) => {
                    try {
                        const text = await parseFile(file);
                        // Blend the file text and scraped text
                        const fullText = linkedinData ? `${text}\n\nLINKEDIN SCRAPED DATA:\n${linkedinData}` : text;

                        const analysis = await analyzeResume(fullText, linkedinUrl);
                        return { fileName: file.originalname, candidateName, ...analysis };
                    } catch (error) {
                        console.error(`Error processing file ${file.originalname}:`, error);
                        return { fileName: file.originalname, candidateName, error: 'Failed' };
                    } finally {
                        fs.unlinkSync(file.path);
                    }
                }) : [
                    // Handle LinkedIn-only analysis if no file is provided
                    (async () => {
                        try {
                            const fullText = linkedinData ? `LINKEDIN SCRAPED DATA:\n${linkedinData}` : "No resume provided.";
                            const analysis = await analyzeResume(fullText, linkedinUrl);
                            return { fileName: "LinkedIn Profile", candidateName, ...analysis };
                        } catch (error) {
                            return { fileName: "LinkedIn Profile", candidateName, error: 'Failed' };
                        }
                    })()
                ]
        );

        res.json({ results });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
