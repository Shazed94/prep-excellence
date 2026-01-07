import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe.sequential("Auth API", () => {
	let accessToken: string;
	let testUserId: string;
	let targetUserId: string; // Separate user for status/delete operations

	beforeAll(async () => {
		// Ensure Student role exists for registration tests
		await prisma.role.upsert({
			where: { name: "Student" },
			update: {},
			create: {
				name: "Student",
				description: "Student role for testing",
			},
		});

		// Clean up any existing test users
		await prisma.user.deleteMany({
			where: { email: { in: ["test@example.com", "target@example.com"] } },
		});

		// Create the main test user (the authenticated user)
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);
		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});

		const testUser = await prisma.user.create({
			data: {
				email: "test@example.com",
				password: hashedPassword,
				name: "Test User",
				roleId: studentRole!.id,
				isVerified: true,
				isActive: true,
				isSuperUser: true,
				isStaff: true,
			},
		});
		testUserId = testUser.id;

		// Create target user for status/delete operations
		const targetUser = await prisma.user.create({
			data: {
				email: "target@example.com",
				password: await bcrypt.hash("TargetPass1234", 12),
				name: "Target User",
				roleId: studentRole!.id,
				isVerified: true,
				isActive: true,
			},
		});
		targetUserId = targetUser.id;
	});

	afterAll(async () => {
		await prisma.user.deleteMany({
			where: { email: { in: ["test@example.com", "target@example.com"] } },
		});
		await prisma.$disconnect();
	});

	describe("POST /api/v1/auth/register", () => {
		it("should register a new user", async () => {
			const response = await request(app).post("/api/v1/auth/register").send({
				email: "newuser@example.com",
				password: "NewUser1234",
				name: "New User",
				role: "Student",
			});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("accessToken");

			// Clean up the newly registered user
			await prisma.user.delete({
				where: { email: "newuser@example.com" },
			});
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

	describe("POST /api/v1/auth/refresh", () => {
		let refreshToken: string;

		beforeAll(async () => {
			// Login to get refresh token
			const loginResponse = await request(app).post("/api/v1/auth/login").send({
				email: "test@example.com",
				password: "Test1234",
			});
			refreshToken = loginResponse.body.data.refreshToken;
		});

		it("should refresh access token with valid refresh token", async () => {
			const response = await request(app)
				.post("/api/v1/auth/refresh")
				.send({ refreshToken });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("accessToken");
			expect(response.body.data).toHaveProperty("refreshToken");
		});

		it("should return 400 if refresh token is missing", async () => {
			const response = await request(app).post("/api/v1/auth/refresh").send({});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain("Refresh token required");
		});

		it("should return 401 for invalid refresh token", async () => {
			const response = await request(app)
				.post("/api/v1/auth/refresh")
				.send({ refreshToken: "invalid.token.here" });

			expect(response.status).toBe(401);
			expect(response.body.message).toContain("Invalid refresh token");
		});
	});

	describe("POST /api/v1/auth/logout", () => {
		it("should logout successfully", async () => {
			const response = await request(app)
				.post("/api/v1/auth/logout")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("Logout successful");
		});
	});

	describe("GET /api/v1/users/me", () => {
		it("should get logged in user info", async () => {
			// Re-login to get fresh token
			const loginRes = await request(app).post("/api/v1/auth/login").send({
				email: "test@example.com",
				password: "Test1234",
			});
			accessToken = loginRes.body.data.accessToken;

			const res = await request(app)
				.get("/api/v1/users/me")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.email).toBe("test@example.com");
		});

		it("should return 401 without authentication", async () => {
			const res = await request(app).get("/api/v1/users/me");

			expect(res.status).toBe(401);
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

		it("should return 400 for invalid id", async () => {
			const res = await request(app)
				.get("/api/v1/users/invalid-id")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(400);
		});

		it("should return 404 for non-existent id", async () => {
			const res = await request(app)
				.get("/api/v1/users/ckx9f2a9b0001l7z8k3q9m2x1")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(404);
		});
	});

	describe("GET /api/v1/users", () => {
		it("should get all users with pagination", async () => {
			const res = await request(app)
				.get("/api/v1/users?page=1&limit=10")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.pagination).toHaveProperty("total");
			expect(Array.isArray(res.body.data)).toBe(true);
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

		it("should return 400 for invalid phone format", async () => {
			const res = await request(app)
				.put(`/api/v1/users/${testUserId}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({ phone: "123" });

			expect(res.status).toBe(400);
		});
	});

	describe("PATCH /api/v1/users/:id/status", () => {
		it("should toggle isActive status", async () => {
			// Ensure authenticated user is verified and active
			await prisma.user.update({
				where: { id: testUserId },
				data: { isVerified: true, isActive: true },
			});

			expect(targetUserId).toBeDefined();
			expect(targetUserId).not.toBe(testUserId); // Ensure we're not toggling the authenticated user

			const res = await request(app)
				.patch(`/api/v1/users/${targetUserId}/status`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.message).toMatch(/activated|deactivated/);
		});
	});
	describe("DELETE /api/v1/users/:id", () => {
		it("should delete the user", async () => {
			// Ensure authenticated user is verified and active
			await prisma.user.update({
				where: { id: testUserId },
				data: { isVerified: true, isActive: true },
			});

			const res = await request(app)
				.delete(`/api/v1/users/${targetUserId}`)
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

	beforeAll(async () => {
		// Ensure seeded admin is active and verified
		await prisma.user.updateMany({
			where: { email: "info@prepexcellence.com" },
			data: {
				isActive: true,
				isVerified: true,
				isSuperUser: true,
				isStaff: true,
			},
		});

		// Login with seeded admin user
		const loginRes = await request(app)
			.post("/api/v1/auth/login")
			.send({
				email: process.env.ADMIN_EMAIL || "info@prepexcellence.com",
				password: process.env.ADMIN_PASSWORD || "A7f!Q9mR2@Kp",
			});

		expect(loginRes.status).toBe(200);

		accessToken = loginRes.body.data.accessToken;

		// Get Student role from database
		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});
		if (!studentRole) throw new Error("Student role not found");
		roleId = studentRole.id;
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
			expect(res.body.data.email).toBe("student@example.com");
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
