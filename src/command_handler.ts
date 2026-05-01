import { readConfig } from "./config.js";
import { User, getUser} from "./lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;


export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const cmdHandler = registry[cmdName];
    if (!cmdHandler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }
    return cmdHandler(cmdName, ...args);
}


export async function getCurrentUser() {
    const config = readConfig();
    if (!config.currentUserName){
        throw new Error("No user currently logged in. Use login or register commands to set current user.");
    }
    const currentUser = await getUser(config.currentUserName);
    if (!currentUser) {
        throw new Error("Error fetching current user from database");
    }
    return currentUser;
}