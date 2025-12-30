import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		env: loadEnv("test", process.cwd(), ""),
		globalSetup: ["./src/__tests__/setup/globalSetup.ts"],
		globalTeardown: ["./src/__tests__/setup/globalTeardown.ts"],
		fileParallelism: false,
		sequence: { shuffle: false },
		include: ["src/__tests__/05-lms/04-quiz.spec.ts"],
		exclude: ["src/__tests__/setup/**"],
		setupFiles: ["./vitest.setup.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
