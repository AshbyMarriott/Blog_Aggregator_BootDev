import { setUser, readConfig } from "./config.js";
import { CommandsRegistry, CommandHandler, registerCommand, handlerLogin, runCommand } from "./command_handler.js";

function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    const cmdArgs  = process.argv.slice(2);
    if (cmdArgs.length < 1) {
        console.log("Insufficient arguments");
        process.exit(1);
    }
    const cmd = cmdArgs[0];
    const args = cmdArgs.slice(1);
    try {
        runCommand(registry, cmd, ...args);
    } catch (err) {
        console.log((err as Error).message);
        process.exit(1);
    }
    
    console.log(readConfig());

}


main();