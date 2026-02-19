import { setUser, readConfig } from "./config.js";
import { CommandsRegistry, CommandHandler, registerCommand,
     handlerLogin, runCommand, register, reset, users, agg
     } from "./command_handler.js";

async function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", register);
    registerCommand(registry, "reset", reset);
    registerCommand(registry, "users", users);
    registerCommand(registry, "agg", agg);
    const cmdArgs  = process.argv.slice(2);
    if (cmdArgs.length < 1) {
        console.log("Insufficient arguments");
        process.exit(1);
    }
    const cmd = cmdArgs[0];
    const args = cmdArgs.slice(1);
    try {
        await runCommand(registry, cmd, ...args);
    } catch (err) {
        console.log((err as Error).message);
        process.exit(1);
    }
    
    process.exit(0);

}


main();