import { CommandHandler, getCurrentUser, UserCommandHandler } from "./command_handler";
import { getUser } from "./lib/db/queries/users";

export function middlewareLoggedIn (handler: UserCommandHandler) {
    return async (cmdName: string, ...args: string[]) => {
        const currentUser = await getCurrentUser();
        await handler(cmdName, currentUser, ...args);
    }
}