import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("Invalid input, arguments required");
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
    cmdHandler(cmdName, ...args);
}
