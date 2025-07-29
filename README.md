# TokScrape

**TokScrape: A lightweight Node.js library for efficiently extracting TikTok video URLs.**

This project provides a TikTok video scraper that can be used as a Node.js library.

## Features

- Scrape TikTok video URLs from a specified username.
- Specify the number of videos to fetch.
- Usable as a standalone Node.js library.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/x0d7x/tiktok-scraper.git
   cd tiktok-scraper
   ```
2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   # or bun install
   ```

## Usage as a Library

You can import and use the `scrapeVideos` function directly in your Node.js projects.

```typescript
import { scrapeVideos } from './src'; // Adjust path as needed based on your project structure

async function getTikTokData() {
  try {
    // Scrape 5 videos from the 'tiktok' username
    const videos = await scrapeVideos(5, 'div[data-e2e="user-post-item"]', 'tiktok');
    console.log(videos);
  } catch (error) {
    console.error('Error scraping videos:', error);
  }
}

getTikTokData();
```

### `scrapeVideos(numVideos?: number, videoCardSelector?: string, username?: string)`

- `numVideos` (optional): The number of videos to fetch. Defaults to 10 if not provided.
- `videoCardSelector` (optional): The CSS selector for a single video card. Defaults to `div[data-e2e="user-post-item"]`.
- `username` (optional): The TikTok username to scrape videos from (e.g., 'tiktok'). If not provided, it defaults to a generic TikTok page.
- **Returns**: A Promise that resolves to an array of objects, each containing `videoUrl` (string) for a TikTok video.

## Important Notes

- **TikTok Selectors**: The CSS selectors used in `src/scraper.ts` are placeholders. TikTok's website structure can change frequently, which may break the scraper. You will need to inspect TikTok's HTML to find the correct and up-to-date selectors for video cards.
- **Video URL Filtering**: The scraper now specifically looks for video links (`<a>` tags with `href` attributes containing `/video/`) where the video ID (the number after `/video/`) is 15 digits or longer. Video cards without such a link will be skipped.
- **Puzzle/CAPTCHA Solving**: When you run the scraper, a browser window will open. If TikTok presents a puzzle or CAPTCHA, you will need to solve it manually within 30 seconds. **Do not close this browser window**, as it will be used for the actual scraping after the wait period.
- **Rate Limiting**: Be mindful of TikTok's rate limiting policies. Excessive requests may lead to your IP being temporarily or permanently blocked.
