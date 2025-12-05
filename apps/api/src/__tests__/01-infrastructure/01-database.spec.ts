import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prisma from "@/infrastructure/database/connection";

describe.sequential("Database Connection", () => {
	beforeAll(async () => {
		// Ensure test database connection is working
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("should connect to the database successfully", async () => {
		const result = await prisma.$queryRaw`SELECT 1 as value`;
		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
	});

	it("should have correct database name in test environment", async () => {
		const result = await prisma.$queryRaw<Array<{ current_database: string }>>`
            SELECT current_database()
        `;
		expect(result[0].current_database).toContain("test");
	});

	it("should be able to query users table", async () => {
		const users = await prisma.user.findMany({ take: 1 });
		expect(Array.isArray(users)).toBe(true);
	});

	it("should be able to query roles table", async () => {
		const roles = await prisma.role.findMany({ take: 1 });
		expect(Array.isArray(roles)).toBe(true);
	});

	it("should be able to query permissions table", async () => {
		const permissions = await prisma.permission.findMany({ take: 1 });
		expect(Array.isArray(permissions)).toBe(true);
	});
});
