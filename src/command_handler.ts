import { setUser, readConfig, Config } from "./config.js";
import { createUser, getUser, deleteUsers, getUsers } from "./lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("Invalid input, arguments required");
    }
    const userCheck = await getUser(args[0]);
    if (!userCheck) {
        throw new Error("User does not exist");
    }
    setUser(args[0]);
    console.log("User has been set");
}

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

export async function register(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length != 1) {
        throw new Error("Invalid number of arguments");
    }
    const userCheck = await getUser(args[0]);
    if (userCheck) {
        throw new Error("User already exists");
    }
    const user = await createUser(args[0]);
    setUser(user.name);
    console.log(`User ${user.name} has been set`);
    console.log(user);
}

export async function reset(cmdName: string, ...args: string[]): Promise<void> {
    try {
        await deleteUsers();
    } catch (err) {
        console.log((err as Error).message);
        process.exit(1);
    }
    process.exit(0);
}

export async function users(cmdName: string, ...args: string[]): Promise<void> {
    const users = await getUsers();
    const currentUser = readConfig().currentUserName;
    for (let user of users) {
        let userString = user.name;
        if (user.name === currentUser) {
            userString += " (current)";
        }
        console.log(userString);
    }
}
