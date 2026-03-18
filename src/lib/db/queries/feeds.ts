import { db } from "..";
import { feeds, users } from "../schema";
import { User } from "./users";
import { eq } from "drizzle-orm";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId}).returning();
    return result;
}

export async function getFeedsWithUsername() {
    const results = await db
        .select({
            feedName: feeds.name,
            feedURL: feeds.url,
            userName: users.name
        })
        .from(feeds)
        .leftJoin(users, eq(feeds.userId, users.id));
    return results;
}

export function printFeed(feed: Feed, user: User) {
    let printStr = `Feed:\n\tID: ${feed.id}\n\tName: ${feed.name}`
        + `\n\tURL: ${feed.url}\n\tUser ID: ${feed.userId}`
        + `\n\tCreated: ${feed.createdAt}\n\tUpdated: ${feed.updatedAt}`
        + `\n\nUser:\n\tID: ${user.id}\n\tName: ${user.name}`
        + `\n\tCreated: ${user.createdAt}\n\tUpdated: ${user.updatedAt}`;
    console.log(printStr);
}