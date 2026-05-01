import { User } from "src/lib/db/queries/users";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";

export async function follow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length != 1){
        throw new Error("Invalid number of arguments: URL required");
    }
    const feedIdName = await getFeedByURL(args[0]);
    if (!feedIdName) {
        throw new Error("Feed does not exist for provided URL");
    }

    const feedFollow = await createFeedFollow(feedIdName.feedId, user.id);
    
    console.log(
        `Feed Name: ${feedFollow.feedName}\n`
        + `Current User: ${feedFollow.userName}\n`
    );
}