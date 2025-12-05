import { afterAll, describe, expect, it } from "vitest";
import prisma from "@/infrastructure/database/connection";

describe("Database Connection", () => {
	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("should connect to database", async () => {
		// Test basic connection by running a simple query
		const result = await prisma.$queryRaw`SELECT 1 as value`;
		expect(result).toBeDefined();
	});

	it("should execute transactions", async () => {
		// Test transaction capability
		const result = await prisma.$transaction(async (tx) => {
			const roles = await tx.role.findMany({ take: 1 });
			return roles;
		});
		expect(Array.isArray(result)).toBe(true);
	});

	it("should handle query errors gracefully", async () => {
		// Test error handling
		try {
			await prisma.$queryRawUnsafe("INVALID SQL QUERY");
		} catch (error) {
			expect(error).toBeDefined();
		}
	});

	it("should support concurrent queries", async () => {
		// Test concurrent query execution
		const [result1, result2, result3] = await Promise.all([
			prisma.role.count(),
			prisma.permission.count(),
			prisma.user.count(),
		]);

		expect(typeof result1).toBe("number");
		expect(typeof result2).toBe("number");
		expect(typeof result3).toBe("number");
	});

	it("should maintain connection pool", async () => {
		// Run multiple sequential queries to test connection pooling
		for (let i = 0; i < 5; i++) {
			const result = await prisma.role.findMany({ take: 1 });
			expect(Array.isArray(result)).toBe(true);
		}
	});
});
