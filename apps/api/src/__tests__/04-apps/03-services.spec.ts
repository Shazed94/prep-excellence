import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import app from "@/app";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";

// Fake guidance data to reuse
const fakeGuidanceData = {
	firstName: "John",
	lastName: "Doe",
	email: "john@example.com",
	phone: "1234567890",
	stateRegion: "CA",
	country: "USA",
	studentGrade: "10",
	gpa: "4.0",
	takenSATACT: "YES",
	satActScore: "1500",
	extracurricular: "Football",
	targetColleges: "MIT, Harvard",
	questions: "Help me?",
	childDescription: "Very talented",
};

let createdId: string;

describe("Role & Permission Management API", () => {
	let superUserToken: string;

	beforeAll(async () => {
		const loginRes = await request(app)
			.post("/api/v1/auth/login")
			.send({
				email: process.env.ADMIN_EMAIL || "admin@gmail.com",
				password: process.env.ADMIN_PASSWORD || "admin@1234",
			});

		expect(loginRes.status).toBe(200);

		superUserToken = loginRes.body.data.accessToken;
	});

	describe("Role Management", () => {
		describe("POST /api/v1/guidance", () => {
			it("should create guidance", async () => {
				const res = await request(app)
					.post("/api/v1/guidance")
					.send(fakeGuidanceData)
					.expect(201);

				expect(res.body.success).toBe(true);
				expect(res.body.data.firstName).toBe("John");

				createdId = res.body.data.id;
			});

			it("should fail validation when data missing", async () => {
				const res = await request(app)
					.post("/api/v1/guidance")
					.send({})
					.expect(400);

				expect(res.body.success).toBe(false);
			});
		});

		describe("GET /api/v1/guidance", () => {
			it("should get paginated guidance list", async () => {
				const res = await request(app)
					.get("/api/v1/guidance?page=1&limit=10&sortBy=createdAt&orderBy=desc")
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(200);

				expect(res.body.success).toBe(true);
				expect(Array.isArray(res.body.data)).toBe(true);
			});

			it("should fetch from cache when available", async () => {
				vi.spyOn(cached, "get").mockResolvedValue(
					JSON.stringify({
						data: [],
						pagination: { page: 1, total: 1, totalPages: 1 },
					}),
				);

				const res = await request(app)
					.get("/api/v1/guidance?page=1&limit=10&sortBy=createdAt&orderBy=asc")
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(200);

				expect(res.body.message).toContain("from cache");
			});
		});

		describe("GET /api/v1/guidance/:id", () => {
			it("should get guidance by id", async () => {
				const res = await request(app)
					.get(`/api/v1/guidance/${createdId}`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(200);

				expect(res.body.success).toBe(true);
				expect(res.body.data.id).toBe(createdId);
			});

			it("should return 404 for invalid id", async () => {
				const res = await request(app)
					.get("/api/v1/guidance/invalid-id-123")
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(400); // Zod validation error

				expect(res.body.success).toBe(false);
			});

			it("should return 404 when guidance does not exist", async () => {
				const res = await request(app)
					.get("/api/v1/guidance/cjo5g5k1h0000qrmj6b0abcd")
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(404);

				expect(res.body.success).toBe(false);
			});
		});

		describe("PUT /api/v1/guidance/:id", () => {
			it("should update guidance", async () => {
				const res = await request(app)
					.put(`/api/v1/guidance/${createdId}`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({ ...fakeGuidanceData, firstName: "Updated" })
					.expect(200);

				expect(res.body.data.firstName).toBe("Updated");
			});

			it("should return 404 on update missing record", async () => {
				const res = await request(app)
					.put("/api/v1/guidance/cjo5g5k1h0000qrmj6b0abcd")
					.set("Authorization", `Bearer ${superUserToken}`)
					.send(fakeGuidanceData)
					.expect(404);

				expect(res.body.success).toBe(false);
			});
		});

		describe("DELETE /api/v1/guidance/:id", () => {
			it("should delete guidance", async () => {
				const res = await request(app)
					.delete(`/api/v1/guidance/${createdId}`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(200);

				expect(res.body.success).toBe(true);
			});

			it("should return 404 when deleting non-existing id", async () => {
				const res = await request(app)
					.delete(`/api/v1/guidance/c1h0000qr6b0abcd`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.expect(404);

				expect(res.body.success).toBe(false);
			});
		});
	});

	afterAll(() => {
		prisma.guidance.deleteMany().catch(() => {});
		prisma.role.deleteMany().catch(() => {});
		prisma.user
			.deleteMany({ where: { email: "user@test.com" } })
			.catch(() => {});
		prisma.$disconnect();
	});
});
