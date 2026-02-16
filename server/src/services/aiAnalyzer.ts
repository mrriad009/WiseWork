
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export const analyzeResume = async (resumeText: string, linkedinUrl?: string) => {
    if (!resumeText) {
        throw new Error("No resume text provided for analysis.");
    }

    const prompt = `
    You are a Senior Technical Recruiter. Your task is to extract and analyze information with 100% FATUAL ACCURACY.
    
    CRITICAL INSTRUCTIONS:
    1. DO NOT HALLUCINATE. Only use information explicitly present in the provided Resume or LinkedIn Profile.
    2. If information is missing (e.g., years of experience not clear), provide your best conservative estimate based ONLY on the dates provided.
    3. If no CV is provided and only a LinkedIn URL is given, acknowledge that you are analyzing based on the profile context you have available.
    
    SOURCE DATA:
    ${linkedinUrl ? `TARGET LINKEDIN PROFILE: ${linkedinUrl}` : ''}
    ${resumeText !== "LinkedIn Profile Analysis Request" ? `RESUME CONTENT:\n"""\n${resumeText}\n"""` : 'NOTICE: No CV provided.'}
    
    OUTPUT REQUIREMENTS:
    - CATEGORIZE skills strictly (Technical, Soft, Tools).
    - Provide an EXECUTIVE SUMMARY (30-50 words) that describes the candidate's actual professional identity.
    - DECISION logic must be based on the depth of evidence found in the text.
    
    JSON FORMAT (MANDATORY):
    {
        "score": number,
        "detailed_scores": {
            "technical_depth": number,
            "leadership": number,
            "domain_expertise": number,
            "communication": number
        },
        "executive_summary": "string",
        "skills": {
            "technical": ["string"],
            "soft": ["string"],
            "tools": ["string"]
        },
        "experience": {
            "total_years": number,
            "key_industries": ["string"],
            "seniority_level": "string"
        },
        "strengths": ["string"],
        "weaknesses": ["string"],
        "linkedin_insights": {
            "profile_quality": "High" | "Medium" | "Low",
            "synergy_report": "string"
        },
        "recommendation": {
            "decision": "Hire" | "Consider" | "Reject",
            "justification": "string"
        }
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Strict JSON cleaning
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error analyzing candidate with AI:", error);
        throw new Error("Analysis engine failed to process the request.");
    }
};
