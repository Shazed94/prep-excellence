import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "json-summary"],
			exclude: [
				"node_modules/",
				"dist/",
				".output/",
				"tests/",
				"**/*.test.{ts,tsx}",
				"**/*.spec.{ts,tsx}",
				"**/types/",
				"**/*.config.{ts,js}",
				"**/routeTree.gen.ts",
			],
			include: ["src/**/*.{ts,tsx}"],
		},
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
	},

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
