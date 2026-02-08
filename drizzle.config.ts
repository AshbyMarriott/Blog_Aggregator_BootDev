import { defineConfig } from "drizzle-kit";
import { readConfig } from "./dist/config.js";

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/generated/",
    dialect: "postgresql",
    dbCredentials: {
        url: readConfig().connectionString
    },
});