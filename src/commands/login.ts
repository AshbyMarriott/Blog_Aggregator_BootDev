import { getUser } from "src/lib/db/queries/users";
import { setUser } from "src/config";

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