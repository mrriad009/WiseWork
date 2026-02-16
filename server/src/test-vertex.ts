
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const location = process.env.GOOGLE_LOCATION || "us-central1";

    if (!projectId) {
        console.error("❌ Error: GOOGLE_PROJECT_ID is missing in .env file.");
        process.exit(1);
    }

    // Initialize Vertex AI
    // Note: It will automatically look for f:\Ai\server\google-credentials.json 
    // if GOOGLE_APPLICATION_CREDENTIALS is set in .env
    const vertexAI = new VertexAI({ project: projectId, location: location });
    const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = process.argv[2] || "Hello Vertex AI, are you active?";

    console.log(`\n🚀 Sending prompt to Vertex AI: "${prompt}"...\n`);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.candidates?.[0]?.content.parts[0]?.text || "No response text found.";
        console.log("✨ Vertex Response:\n");
        console.log(text);
    } catch (error) {
        console.error("❌ Error generating content with Vertex AI:", error);
    }
};

run();
