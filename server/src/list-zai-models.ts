
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    const apiKey = process.env.ZAI_API_KEY;
    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://open.bigmodel.cn/api/paas/v4/"
    });

    try {
        console.log("Listing models...");
        const models = await client.models.list();
        console.log(JSON.stringify(models, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
};

run();
