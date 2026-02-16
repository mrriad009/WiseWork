
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY is missing in .env file.");
        process.exit(1);
    }


    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });


    const prompt = process.argv[2] || "Hello, can you confirm you are working?";

    console.log(`\n🤖 Sending prompt to Gemini: "${prompt}"...\n`);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("✨ Response:\n");
        console.log(text);
    } catch (error) {
        console.error("❌ Error generating content:", error);
    }
};

run();
