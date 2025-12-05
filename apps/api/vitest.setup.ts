import { beforeAll } from "vitest";

beforeAll(async () => {
	// Set NODE_ENV to test to ensure test database is used
	process.env.NODE_ENV = "test";
});
