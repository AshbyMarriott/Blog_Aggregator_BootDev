import { createFeed, printFeed } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { User } from "src/lib/db/queries/users";

export async function addFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length != 2) {
        throw new Error("Invalid number of arguments. FeedName, URL required");
    }

    const feed = await createFeed(args[0], args[1], user.id);
    await createFeedFollow(feed.id, user.id);
    printFeed(feed, user);
}
