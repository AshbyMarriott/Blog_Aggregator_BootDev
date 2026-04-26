import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";

export async function agg(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length != 1) {
        throw new Error("Invalid number of arguments: time between requests string required (1s, 1m, 1h, etc)");
    }
    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);
    
    const handleError = (err: unknown) => { 
        console.error(err);
        process.exit(1);
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

    for (let item of feed.items) {
        console.log(item.title);
    }
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