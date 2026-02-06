import { setUser, readConfig } from "./config.js";

function main() {
    setUser("Ashby");
    console.log(readConfig());
}


main();