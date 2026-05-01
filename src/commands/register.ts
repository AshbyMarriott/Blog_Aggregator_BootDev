import { createUser, getUser } from "src/lib/db/queries/users";
import { setUser } from "src/config";

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