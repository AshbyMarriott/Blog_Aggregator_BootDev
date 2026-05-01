import { db } from "../";
import { feedFollows, posts, feeds } from "../schema";
import { getFeedFollowsForUser } from "./feedFollows";
import { User } from "./users";
import { eq, desc } from "drizzle-orm";

export type SelectPost = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export async function createPost( post: InsertPost ) 
{
    const [result] = await db.insert(posts).values({
        title: post.title,
        url: post.url,
        description: post.description,
        publishedAt: post.publishedAt,
        feedId: post.feedId
    }).onConflictDoNothing().returning();
    return result;
}

export async function getPostsForUser(user: User, numPosts: number) {
    const postsForUser = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedId: posts.feedId,
            feedName: feeds.name
        })
        .from(posts)
        .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
        .innerJoin(feeds, eq(feeds.id, posts.feedId))
        .where(eq(feedFollows.userId, user.id))
        .orderBy(desc(posts.publishedAt))
        .limit(numPosts);
    return postsForUser;
}