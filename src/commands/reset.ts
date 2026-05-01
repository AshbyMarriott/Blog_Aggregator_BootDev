import { deleteUsers } from "src/lib/db/queries/users";

export async function reset(cmdName: string, ...args: string[]): Promise<void> {
    try {
        await deleteUsers();
    } catch (err) {
        console.log((err as Error).message);
        process.exit(1);
    }
    process.exit(0);
}