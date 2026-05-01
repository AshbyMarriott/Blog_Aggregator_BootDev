import { getUsers } from "src/lib/db/queries/users";
import { readConfig } from "src/config";

export async function users(cmdName: string, ...args: string[]): Promise<void> {
    const users = await getUsers();
    const currentUser = readConfig().currentUserName;
    for (let user of users) {
        let userString = `* ${user.name}`;
        if (user.name === currentUser) {
            userString += " (current)";
        }
        console.log(userString);
    }
}