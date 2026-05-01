import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "../lib/db/queries/users";

export async function browse(cmdName: string, user: User, ...args: string[]): Promise<void> {   
    let limit: number;
    const parsed = Number.parseInt(args[0]);
    if (Number.isNaN(parsed) || parsed <= 0) {
        limit = 2;
    } else {
        limit = parsed;
    }

    const posts = await getPostsForUser(user, limit);
    console.log(`Found ${posts.length} posts for ${user.name}`);
    for (let post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}:`);
        console.log(`--- ${post.title} ---`);
        console.log(`\t${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`======================================`);
    }
}