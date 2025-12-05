import { execSync } from "node:child_process";
import dotenv from "dotenv";
import cached from "../../infrastructure/cache/cache";

// Load environment variables
dotenv.config();

export default async function globalTeardown() {
	console.log("\n🧹 Starting test database cleanup...\n");

	// Disconnect from Redis
	try {
		await cached.disconnect();
		console.log("✅ Redis disconnected");
	} catch (error) {
		console.warn("⚠️  Redis disconnect failed:", error);
	}

	const DATABASE_TEST_URL = process.env.DATABASE_TEST_URL;

	if (!DATABASE_TEST_URL) {
		console.warn("⚠️  DATABASE_TEST_URL not found, skipping cleanup");
		return;
	}

	try {
		// Drop the test database
		console.log("🗑️  Dropping test database...");
		execSync("npx prisma migrate reset --force", {
			env: {
				...process.env,
				DATABASE_URL: DATABASE_TEST_URL,
				SKIP_SEED: "true",
			},
			stdio: "pipe",
		});
		console.log("\n✅ Test database cleanup complete!\n");
	} catch (error) {
		console.error("\n❌ Failed to cleanup test database:", error);
		// Don't throw - allow tests to complete even if cleanup fails
	}
}
