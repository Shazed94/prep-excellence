import { execSync } from "node:child_process";
import dotenv from "dotenv";
import cached from "../../infrastructure/cache/cache";

// Load environment variables
dotenv.config();

export default async function globalSetup() {
	console.log("\n🚀 Starting test database setup...\n");

	// Connect to Redis
	try {
		await cached.connect();
		console.log("✅ Redis connected\n");
	} catch (error) {
		console.warn(
			"⚠️  Redis connection failed (tests will run without cache):",
			error,
		);
	}

	const DATABASE_TEST_URL = process.env.DATABASE_TEST_URL;

	if (!DATABASE_TEST_URL) {
		throw new Error(
			"DATABASE_TEST_URL is not defined. Please add it to your .env file.",
		);
	}

	try {
		// 1. Reset the test database (drops and recreates schema)
		console.log("📦 Resetting test database...");
		execSync("npx prisma migrate reset --force", {
			env: {
				...process.env,
				DATABASE_URL: DATABASE_TEST_URL,
				SKIP_SEED: "true", // Skip automatic seeding
			},
			stdio: "pipe", // Suppress output
		});

		console.log("✅ Database reset complete");

		// 2. Run seed
		console.log("\n🌱 Seeding database...");
		execSync("npx tsx src/utils/seed.ts", {
			env: {
				...process.env,
				DATABASE_URL: DATABASE_TEST_URL,
			},
			stdio: "pipe",
		});

		console.log("✅ Database seeded");
		console.log("\n✅ Test database setup complete!\n");
	} catch (error) {
		console.error("\n❌ Failed to setup test database:", error);
		throw error;
	}
}
