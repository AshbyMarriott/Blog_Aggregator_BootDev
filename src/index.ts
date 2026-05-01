import { setUser, readConfig } from "./config.js";
import { CommandsRegistry, CommandHandler, registerCommand,
     handlerLogin, runCommand, register, reset, users, addFeed, feeds,
     follow, following,
     unfollow
     } from "./command_handler.js";
import { agg } from "./commands/aggregate.js"
import { middlewareLoggedIn } from "./middleware.js";
import { browse } from "./commands/browse.js";

async function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", register);
    registerCommand(registry, "reset", reset);
    registerCommand(registry, "users", users);
    registerCommand(registry, "agg", agg);
    registerCommand(registry, "addfeed", middlewareLoggedIn(addFeed));
    registerCommand(registry, "feeds", feeds);
    registerCommand(registry, "follow", middlewareLoggedIn(follow));
    registerCommand(registry, "following", middlewareLoggedIn(following));
    registerCommand(registry, "unfollow", middlewareLoggedIn(unfollow));
    registerCommand(registry, "browse", middlewareLoggedIn(browse));

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