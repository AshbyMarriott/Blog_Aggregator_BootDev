import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName?: string;
}

export function setUser (userName: string) {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig (): Config {
    const configPath = getConfigFilePath();
    let configFile = fs.readFileSync(configPath, {encoding: "utf-8"});
    return validateConfig(configFile);

}

function getConfigFilePath() {
    return path.join(os.homedir(), "/.gatorconfig.json");
}

function writeConfig(cfg: Config) {
    const outputConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    };
    const configJson = JSON.stringify(outputConfig);
    fs.writeFileSync(getConfigFilePath(), configJson);
}

function validateConfig(file: any): Config {
    try {
        const configJson = JSON.parse(file);
        const configObj: Config = {
            dbUrl: configJson.db_url,
            currentUserName: configJson.current_user_name,
        };
        return configObj;
    } catch (err) {
        throw new Error("Invalid config JSON");
    }
}