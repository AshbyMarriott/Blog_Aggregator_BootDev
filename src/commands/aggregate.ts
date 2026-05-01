import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";
import { fetchFeed } from "src/lib/rss";


export async function agg(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length != 1) {
        throw new Error("Invalid number of arguments: time between requests string required (1s, 1m, 1h, etc)");
    }
    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);
    
    const handleError = (err: unknown) => { 
        console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
    }
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
          console.log("Shutting down feed aggregator...");
          clearInterval(interval);
          resolve();
        });
      });
}

export async function scrapeFeeds() {
    const feedToFetch = await getNextFeedToFetch();
    await markFeedFetched(feedToFetch.id);
    const feed = await fetchFeed(feedToFetch.url);

    function parseDate(dateStr: string | undefined): Date | null {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    }

    for (let item of feed.items) {
        const itemPubDate = parseDate(item.pubDate);

        await createPost( {
            title: item.title,
            url: item.link,
            description: item.description,
            publishedAt: itemPubDate,
            feedId: feedToFetch.id
        });
    }

    console.log(`Feed ${feedToFetch.name} fetched, ${feed.items.length} posts saved.`);
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error("No matching duration string");
    }
    console.log(match);
    const durationNum = Number(match[1]);
    switch (match[2]) {
        case 'ms':
            return durationNum;
        case 's':
            return 1000 * durationNum;
        case 'm':
            return 60000 * durationNum;
        case 'h':
            return 3600000 * durationNum;
        default:
            throw new Error("Failed to parse duration string");
    }
}