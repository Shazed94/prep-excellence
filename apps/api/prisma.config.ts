import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: path.join("prisma", "schema"),
	migrations: {
		path: "prisma/migrations",
		seed: "tsx ./src/utils/seed.ts",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
