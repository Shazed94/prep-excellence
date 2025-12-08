import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import app from "@/app";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";

describe("Guidance API – Basic CRUD & Validation Tests (No Permission Tests)", () => {
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

	let token: string;
	let createdId: string;

	beforeAll(async () => {
		// Ensure admin exists / login to get token
		const adminLogin = await request(app)
			.post("/api/v1/auth/login")
			.send({
				email: process.env.ADMIN_EMAIL || "admin@gmail.com",
				password: process.env.ADMIN_PASSWORD || "admin@1234",
			});

		expect(adminLogin.status).toBe(200);
		token = adminLogin.body.data.accessToken;
	});

	// -------------------------------------------------------------------------
	// CREATE (Public route — No auth needed)
	// -------------------------------------------------------------------------
	describe("POST /api/v1/guidance", () => {
		it("should create guidance", async () => {
			const res = await request(app)
				.post("/api/v1/guidance")
				.send(fakeGuidanceData)
				.expect(201);

			expect(res.body.success).toBe(true);
			createdId = res.body.data.id;
		});

		it("should fail with missing body", async () => {
			const res = await request(app)
				.post("/api/v1/guidance")
				.send({})
				.expect(400);

			expect(res.body.success).toBe(false);
		});
	});

	// -------------------------------------------------------------------------
	// GET ALL (Requires token but no permission checks)
	// -------------------------------------------------------------------------
	describe("GET /api/v1/guidance", () => {
		it("should reject missing token", async () => {
			await request(app).get("/api/v1/guidance?page=1&limit=10").expect(401);
		});

		it("should get guidance list with token", async () => {
			const res = await request(app)
				.get("/api/v1/guidance?page=1&limit=10")
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should return cached response", async () => {
			const mock = vi.spyOn(cached, "get").mockResolvedValue(
				JSON.stringify({
					data: [],
					pagination: { page: 1, total: 1, totalPages: 1 },
				}),
			);

			const res = await request(app)
				.get("/api/v1/guidance?page=1&limit=10")
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			expect(res.body.message).toContain("from cache");
			mock.mockRestore();
		});
	});

	// -------------------------------------------------------------------------
	// GET BY ID
	// -------------------------------------------------------------------------
	describe("GET /api/v1/guidance/:id", () => {
		it("should fail invalid Cuid", async () => {
			await request(app)
				.get("/api/v1/guidance/invalid-id")
				.set("Authorization", `Bearer ${token}`)
				.expect(400);
		});

		it("should get guidance by ID", async () => {
			const res = await request(app)
				.get(`/api/v1/guidance/${createdId}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			expect(res.body.data.id).toBe(createdId);
		});

		it("should return 404 when not found", async () => {
			await request(app)
				.get("/api/v1/guidance/cjo5g5k1h0000qrmj6b09999")
				.set("Authorization", `Bearer ${token}`)
				.expect(404);
		});
	});

	// -------------------------------------------------------------------------
	// UPDATE (Token only)
	// -------------------------------------------------------------------------
	describe("PUT /api/v1/guidance/:id", () => {
		it("should update guidance with token", async () => {
			const res = await request(app)
				.put(`/api/v1/guidance/${createdId}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ ...fakeGuidanceData, firstName: "UpdatedName" })
				.expect(200);

			expect(res.body.data.firstName).toBe("UpdatedName");
		});
	});

	// -------------------------------------------------------------------------
	// DELETE (Token only)
	// -------------------------------------------------------------------------
	describe("DELETE /api/v1/guidance/:id", () => {
		it("should delete guidance with token", async () => {
			const res = await request(app)
				.delete(`/api/v1/guidance/${createdId}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			expect(res.body.success).toBe(true);
		});
	});

	// -------------------------------------------------------------------------
	// CLEANUP
	// -------------------------------------------------------------------------
	afterAll(async () => {
		await prisma.$disconnect();
	});
});
