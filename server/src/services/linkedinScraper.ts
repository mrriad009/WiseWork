import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeLinkedIn = async (url: string): Promise<string | null> => {
    if (!url.includes('linkedin.com/in/')) {
        return null;
    }

    try {
        // We will try to fetch the public profile page. 
        // Note: LinkedIn heavily blocks automated scraping, 
        // so this is a basic metadata extractor for public profiles 
        // or acts as a placeholder for a real API like Proxycurl.
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            timeout: 10000 // 10 second timeout
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extracting common Open Graph metadata often exposed by LinkedIn public profiles
        const title = $('meta[property="og:title"]').attr('content') || '';
        const description = $('meta[property="og:description"]').attr('content') || '';

        let extractedText = `${title}\n${description}`;

        return extractedText.trim() ? extractedText : null;

    } catch (error) {
        console.warn(`Failed to scrape LinkedIn profile ${url}:`, (error as Error).message);
        // Fallback or placeholder text indicating failure
        return "LinkedIn Profile Analysis Requested: Attempt to access public metadata failed due to platform restrictions. Analysis will rely primarily on provided CV data.";
    }
};
