import { beforeAll } from "vitest";

beforeAll(() => {
	// Set NODE_ENV to test to ensure test database is used
	process.env.NODE_ENV = "test";

	// Ensure DATABASE_TEST_URL is set
	if (!process.env.DATABASE_TEST_URL) {
		throw new Error(
			"DATABASE_TEST_URL is not defined. Please add it to your .env file.",
		);
	}
});
