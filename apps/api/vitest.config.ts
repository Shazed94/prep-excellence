import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
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
			],
		},
		include: ["src/**/*.{test,spec}.ts"],
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
