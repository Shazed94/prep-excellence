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
		fileParallelism: false, // Run test files sequentially to avoid database conflicts
		sequence: {
			// Ensure tests run in alphabetical order (01-infrastructure, 02-utils, 03-middleware, 04-apps)
			shuffle: false,
		},
		include: ["src/__tests__/**/*.spec.ts"],
		exclude: ["src/__tests__/setup/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "json-summary"],
			exclude: [
				"node_modules/",
				"dist/",
				"tests/",
				"**/*.test.ts",
				"**/*.spec.ts",
				"**/types/",
				"src/__tests__/",
			],
		},
		setupFiles: ["./vitest.setup.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@config": path.resolve(__dirname, "./src/config"),
			"@middleware": path.resolve(__dirname, "./src/middleware"),
			"@services": path.resolve(__dirname, "./src/services"),
			"@repositories": path.resolve(__dirname, "./src/repositories"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@types": path.resolve(__dirname, "./src/types"),
		},
	},
});
