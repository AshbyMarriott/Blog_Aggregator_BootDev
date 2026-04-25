import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { User } from "./users";
import { Feed, getFeedByURL } from "./feeds";
import { eq, and } from "drizzle-orm";

export type FeedFollow = typeof feedFollows.$inferSelect;

export async function createFeedFollow(feedId: string, userId: string) {

    const [newFeedFollow] = await db.insert(feedFollows).values({
        feedId: feedId,
        userId: userId
    }).returning();

    const [results] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            feedName: feeds.name,
            userName: users.name
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.id, newFeedFollow.id));
    return results;
}

export async function getFeedFollowsForUser(user: User) {
    const userFeedFollows = await db
        .select({
            feedFollow: feedFollows,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, user.id));
    return userFeedFollows.map((r) => ({ ...r, userName: user.name }));
}

export async function deleteFeedFollow(user: User, feedURL: string) {
    const feed = await getFeedByURL(feedURL);
    await db
        .delete(feedFollows)
        .where(
            and(
                eq(feedFollows.userId, user.id),
                eq(feedFollows.feedId, feed.feedId))
        );
}