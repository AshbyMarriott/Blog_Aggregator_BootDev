import { getFeedsWithUsername } from "src/lib/db/queries/feeds";

export async function feeds(cmdName: string, ...args: string[]): Promise<void> {
    const feedsWithUsername = await getFeedsWithUsername();
    let printStr = '';
    for (let feedObj of feedsWithUsername) {
        printStr += `Feed Name: ${feedObj.feedName}\n`
            + `Feed URL: ${feedObj.feedURL}\n`
            + `User: ${feedObj.userName}\n\n`;
    }
    console.log(printStr);
}