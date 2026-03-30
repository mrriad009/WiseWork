import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeLinkedIn = async (url: string): Promise<string | null> => {
  if (!url.includes("linkedin.com/in/")) {
    return null;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 10000,
    });

    const html = response.data as string;
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr("content") || "";
    const description = $('meta[property="og:description"]').attr("content") || "";

    const extractedText = `${title}\n${description}`;

    return extractedText.trim() ? extractedText : null;
  } catch (error) {
    console.warn(`Failed to scrape LinkedIn profile ${url}:`, (error as Error).message);
    return "LinkedIn Profile Analysis Requested: Attempt to access public metadata failed due to platform restrictions. Analysis will rely primarily on provided CV data.";
  }
};
