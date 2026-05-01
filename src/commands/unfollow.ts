import { User } from "src/lib/db/queries/users";
import { deleteFeedFollow } from "src/lib/db/queries/feedFollows";

export async function unfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length != 1) {
        throw new Error("Invalid number of arguments: URL required");
    }
    await deleteFeedFollow(user, args[0]);
}