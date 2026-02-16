
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    const apiKey = process.env.ZAI_API_KEY;

    if (!apiKey) {
        console.error("❌ ZAI_API_KEY is missing in .env file.");
        process.exit(1);
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://open.bigmodel.cn/api/paas/v4/"
    });

    try {
        console.log("🚀 Testing ZAi 4.7 Flash (GLM-4-Flash)...");
        const response = await client.chat.completions.create({
            model: "glm-4.7",
            messages: [{ role: "user", content: "Say hello and identify yourself." }],
        });

        console.log("✨ Response:");
        console.log(response.choices[0]?.message?.content || 'No response content');
    } catch (error) {
        console.error("❌ Error with ZAi:", error);
    }
};

run();
