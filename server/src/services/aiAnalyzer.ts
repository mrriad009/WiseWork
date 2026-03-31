import OpenAI from "openai";

const baseURL = (process.env.XAI_BASE_URL ?? "https://api.x.ai/v1").trim();
const model = (process.env.XAI_MODEL ?? "grok-3-mini").trim();

function xaiApiKey(): string {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "XAI_API_KEY is missing. Set it in server/.env (see .env.example). Do not pass an empty key — the OpenAI client would fall back to OPENAI_API_KEY.",
    );
  }
  return key;
}

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: xaiApiKey(),
      baseURL,
    });
  }
  return client;
}

export const analyzeResume = async (resumeText: string, linkedinUrl?: string) => {
  if (!resumeText) {
    throw new Error("No resume text provided for analysis.");
  }

  const prompt = `
    You are a Senior Technical Recruiter. Your task is to extract and analyze information with 100% FACTUAL ACCURACY.

    CRITICAL INSTRUCTIONS:
    1. DO NOT HALLUCINATE. Only use information explicitly present in the provided Resume or LinkedIn Profile.
    2. If information is missing (e.g., years of experience not clear), provide your best conservative estimate based ONLY on the dates provided.
    3. If no CV is provided and only a LinkedIn URL is given, acknowledge that you are analyzing based on the profile context you have available.

    SOURCE DATA:
    ${linkedinUrl ? `TARGET LINKEDIN PROFILE: ${linkedinUrl}` : ""}
    ${resumeText !== "LinkedIn Profile Analysis Request" ? `RESUME CONTENT:\n"""\n${resumeText}\n"""` : "NOTICE: No CV provided."}

    OUTPUT REQUIREMENTS:
    - CATEGORIZE skills strictly (Technical, Soft, Tools).
    - Extract cv_candidate_name: the candidate's FULL NAME exactly as shown on the CV or LinkedIn header (e.g. top of resume). If truly not present, use an empty string "".
    - Provide an EXECUTIVE SUMMARY (30-50 words) that describes the candidate's actual professional identity.
    - DECISION logic must be based on the depth of evidence found in the text.

    Respond with ONLY a single JSON object (no markdown fences, no extra text). Use this exact shape:
    {
        "cv_candidate_name": "string",
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
    const completion = await getClient().chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let text = completion.choices[0]?.message?.content ?? "";
    if (!text) {
      throw new Error("Empty model response");
    }

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text) as Record<string, unknown>;
  } catch (error) {
    console.error("Error analyzing candidate with AI:", error);
    throw new Error("Analysis engine failed to process the request.");
  }
};
