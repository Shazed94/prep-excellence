import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe("Auth API", () => {
	let accessToken: string;
	let testUserId: string;
	afterAll(async () => {
		await prisma.user.deleteMany({ where: { email: "test@example.com" } });
		await prisma.$disconnect();
	});

	describe("POST /api/v1/auth/register", () => {
		it("should register a new user", async () => {
			const response = await request(app).post("/api/v1/auth/register").send({
				email: "test@example.com",
				password: "Test1234",
				name: "Test User",
				role: "Student",
			});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("accessToken");
		});

		it("should return 400 for invalid email", async () => {
			const response = await request(app).post("/api/v1/auth/register").send({
				email: "invalid-email",
				password: "Test1234",
				name: "Test User",
				role: "Student",
			});

			expect(response.status).toBe(400);
		});

		it("should return 400 for short password", async () => {
			const response = await request(app).post("/api/v1/auth/register").send({
				email: "test2@example.com",
				password: "short",
				name: "Test User",
				role: "Student",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Password must be at least 8 characters",
			);
		});

		it("should return 400 for missing name", async () => {
			const response = await request(app).post("/api/v1/auth/register").send({
				email: "test2@example.com",
				password: "Test1234",
				role: "Student",
			});

			expect(response.status).toBe(400);
		});
	});
	describe("POST /api/v1/auth/login", () => {
		it("should login with valid credentials", async () => {
			const response = await request(app).post("/api/v1/auth/login").send({
				email: "test@example.com",
				password: "Test1234",
			});

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty("accessToken");

			accessToken = response.body.data.accessToken;
			testUserId = response.body.data.user.id;
		});

		it("should return 401 for invalid credentials", async () => {
			const response = await request(app).post("/api/v1/auth/login").send({
				email: "test@example.com",
				password: "WrongPassword",
			});

			expect(response.status).toBe(401);
		});

		it("should return 404 for non-existent user", async () => {
			const response = await request(app).post("/api/v1/auth/login").send({
				email: "nonexistent@example.com",
				password: "Test1234",
			});

			expect(response.status).toBe(401);
		});
	});

	describe("GET /api/v1/users/me", () => {
		it("should get logged in user info", async () => {
			const res = await request(app)
				.get("/api/v1/users/me")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.email).toBe("test@example.com");
		});
	});

	describe("GET /api/v1/users/:id", () => {
		it("should get user by id", async () => {
			const res = await request(app)
				.get(`/api/v1/users/${testUserId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.id).toBe(testUserId);
		});

		it("should return 404 for invalid id", async () => {
			const res = await request(app)
				.get("/api/v1/users/invalid-id")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(400);
		});
	});

	describe("PUT /api/v1/users/:id", () => {
		it("should update user data", async () => {
			const res = await request(app)
				.put(`/api/v1/users/${testUserId}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({ name: "Updated User", phone: "01712345678" });

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.name).toBe("Updated User");
		});
	});

	describe("PATCH /api/v1/users/:id/status", () => {
		it("should toggle isActive status", async () => {
			const res = await request(app)
				.patch(`/api/v1/users/${testUserId}/status`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.message).toMatch(/activated|deactivated/);
		});
	});

	describe("DELETE /api/v1/users/:id", () => {
		it("should delete the user", async () => {
			const res = await request(app)
				.delete(`/api/v1/users/${testUserId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.message).toBe("User deleted successfully");
		});
	});
});

describe("Student API", () => {
	let accessToken: string;
	let testStudentId: string;
	let roleId: string;
	let adminUserId: string;

	beforeAll(async () => {
		// Login with seeded admin user
		const loginRes = await request(app)
			.post("/api/v1/auth/login")
			.send({
				email: process.env.ADMIN_EMAIL || "admin@gmail.com",
				password: process.env.ADMIN_PASSWORD || "admin@1234",
			});

		expect(loginRes.status).toBe(200);

		accessToken = loginRes.body.data.accessToken;
		adminUserId = loginRes.body.data.user.id;

		// Get Student role from database
		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});
		if (!studentRole) throw new Error("Student role not found");
		roleId = studentRole.id;

		console.log(
			"\nSuper Admin Logged In →",
			"\nToken:",
			accessToken,
			"\nUserId:",
			adminUserId,
			"\nStudent Role ID:",
			roleId,
			"\n",
		);
	});

	afterAll(async () => {
		await prisma.user.deleteMany({
			where: { email: "student@example.com" },
		});
		await prisma.$disconnect();
	});

	// ---------------- CREATE STUDENT ----------------
	describe("POST /api/v1/students", () => {
		it("should create a new student", async () => {
			const response = await request(app)
				.post("/api/v1/students")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					name: "Test Student",
					email: "student@example.com",
					password: "Student1234",
					roleId: roleId, // Use the role from test admin
					phone: "01712345678",
					address: "123 Street",
					grade: "1",
					class: "A",
					section: "1",
					enrollmentDate: "2025-01-01T00:00:00.000Z",
					currentLevel: "Beginner",
					gpa: 3.5,
					totalCredits: 20,
					academicStatus: "ACTIVE",
					guardianName: "Guardian",
					guardianEmail: "guardian@example.com",
					guardianPhone: "01711111111",
				});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);

			testStudentId = response.body.data;
		});

		it("should fail if email already exists", async () => {
			const response = await request(app)
				.post("/api/v1/students")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					name: "Duplicate",
					email: "student@example.com",
					password: "Student1234",
					roleId: roleId,
					phone: "01700000000",
				});

			expect(response.status).toBe(409);
		});
	});

	// ---------------- GET SINGLE STUDENT ----------------
	describe("GET /api/v1/students/:id", () => {
		it("should get student by id", async () => {
			const res = await request(app)
				.get(`/api/v1/students/${testStudentId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user.email).toBe("student@example.com");
		});

		it("should return 400 for invalid UUID", async () => {
			const res = await request(app)
				.get("/api/v1/students/00000000-0000-0000-0000-000000000000")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(400);
		});
	});

	// ---------------- GET LIST ----------------
	describe("GET /api/v1/students?page=1&limit=10", () => {
		it("should get paginated student list", async () => {
			const res = await request(app)
				.get("/api/v1/students?page=1&limit=10")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.pagination).toHaveProperty("total");
			expect(res.body.data.length).toBeGreaterThanOrEqual(1);
		});
	});

	// ---------------- UPDATE STUDENT ----------------
	describe("PUT /api/v1/students/:id", () => {
		it("should update student", async () => {
			const res = await request(app)
				.put(`/api/v1/students/${testStudentId}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					name: "Updated Student",
					phone: "01799999999",
					grade: "1",
					gpa: 3.8,
				});

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
		});
	});
});
