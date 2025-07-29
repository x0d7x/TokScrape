// src/scraper.ts
import puppeteer from 'puppeteer';

/**
 * Scrapes TikTok videos and returns their URL.
 * @param numVideos The number of videos to fetch. Defaults to 10.
 * @param videoCardSelector The CSS selector for a single video card. Defaults to 'div[data-e2e="user-post-item"]'.
 * @returns A promise that resolves to an array of video URLs.
 */
export async function scrapeVideos(numVideos: number = 10, videoCardSelector: string = 'div[data-e2e="user-post-item"]'): Promise<{ videoUrl: string }[]> {
  let browser;
  try {
    // Step 1: Open browser for puzzle solving and subsequent scraping
    browser = await puppeteer.launch({ headless: false }); // Launch in non-headless mode for user interaction and persistent session
    const page = await browser.newPage();

    await page.goto('https://www.tiktok.com/@tiktok', { waitUntil: 'networkidle2', timeout: 60000 });

    console.log("\n\n================================================================================");
    console.log("A browser window has opened. Please solve any TikTok puzzle/CAPTCHA if it appears.");
    console.log("The scraper will wait for 30 seconds for you to complete this. DO NOT CLOSE THIS BROWSER WINDOW.");
    console.log("================================================================================\n\n");

    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds for user to solve puzzle

    // Continue scraping using the same page instance
    const videoData: { videoUrl: string }[] = [];
    let scrapedCount = 0;

    // Scroll and scrape until desired number of videos are fetched or no more videos are found
    while (scrapedCount < numVideos) {
      // IMPORTANT: You MUST update these CSS selectors to match the current TikTok HTML structure.
      // Use your browser's developer tools to inspect the TikTok page and find the correct selectors.

      // Selector for the video card container. This is now configurable.
      const videoElements = await page.$$(videoCardSelector);

      if (videoElements.length === 0) {
        console.log('No more video elements found or reached end of page.');
        break;
      }

      for (const videoElement of videoElements) {
        if (scrapedCount >= numVideos) break;

        try {
          // Find the video link within the card
          const videoLinkElement = await videoElement.$('a[href*="/video/"]');
          const videoUrl = videoLinkElement ? await page.evaluate(el => el.href, videoLinkElement) : null;

          // Check if the video URL matches the required pattern (e.g., /video/ followed by 15+ digits)
          const videoIdRegex = /\/video\/(\d{15,})/;
          if (!videoUrl || !videoIdRegex.test(videoUrl)) {
            console.warn('Skipping video card: No valid video URL found or ID is less than 15 digits.', videoUrl);
            continue; // Skip this video element if the URL doesn't match
          }

          videoData.push({
            videoUrl: videoUrl,
          });
          scrapedCount++;
        } catch (error) {
          console.warn('Could not scrape data for a video element:', error);
        }
      }

      // Scroll down to load more videos
      if (scrapedCount < numVideos) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(2000); // Wait for new content to load
      }
    }
    return videoData;
  } catch (error) {
    console.error('Error during scraping:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}