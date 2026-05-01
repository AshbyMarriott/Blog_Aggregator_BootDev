import { User } from "src/lib/db/queries/users";
import { getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";

export async function following(cmdName: string, user: User, ...args: string[]): Promise<void> {
    const userFeedFollows = await getFeedFollowsForUser(user);
    let printStr = `${user.name} Follows:`;
    for (let follow of userFeedFollows) {
        printStr += `\n\t${follow.feedName}`
    }
    printStr += "\n";
    console.log(printStr);
}