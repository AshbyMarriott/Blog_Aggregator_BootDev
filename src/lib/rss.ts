import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string) {
    const request = new Request(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
        }
    });
    const response = await fetch(request);
    const responseStr = await response.text();
    const parser = new XMLParser();
    const responseObj = parser.parse(responseStr);

    const fields = ["title", "link", "description"] as const;
    type ChannelKey = (typeof fields)[number];
    const channel: Record<ChannelKey, string> = {
        title: '',
        link: '',
        description: ''
    };
    
    if (!("channel" in responseObj.rss)) {
        throw new Error("channel field not found in response");
    }
    for (const field of fields) {
        const val = responseObj.rss?.channel?.[field];
        if (typeof val !== "string" || val.trim() === ""){
            throw new Error(`${field} value is invalid`);
        }
        channel[field] = val;
    }

    
    type Item = {
        title: string;
        link: string;
        description: string;
        pubDate: string;
    }

    const ITEM_KEYS = ["title", "link", "description", "pubDate"] as const;
    type ItemKey = typeof ITEM_KEYS[number];

    const items: Item[] = [];

    function isValidRawItem(x: unknown): x is Item {
        if (typeof x !== "object" || x === null) {
            return false;
        }
        return ITEM_KEYS.every((k) => k in x && typeof (x as any)[k] === "string" && (x as any)[k].length > 0);
    }

    const raw = responseObj.rss.channel.item;
    const rawItems = Array.isArray(raw)? raw: [raw];

    for (const ri of rawItems) {
        if (!isValidRawItem(ri)){
           continue;
        }
        items.push({
            title: ri.title,
            link: ri.link,
            description: ri.description,
            pubDate: ri.pubDate,
        });
    }

    return {channel, items};
}