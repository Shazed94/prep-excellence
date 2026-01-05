import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe("Teacher, Parent, and System User APIs", () => {
	let accessToken: string;
	let teacherId: string;
	let parentId: string;
	let systemUserId: string;
	let teacherRoleId: string;
	let parentRoleId: string;

	beforeAll(async () => {
		// Ensure seeded admin is active and verified
		await prisma.user.updateMany({
			where: { email: "admin@gmail.com" },
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
				email: process.env.ADMIN_EMAIL || "admin@gmail.com",
				password: process.env.ADMIN_PASSWORD || "admin@1234",
			});

		expect(loginRes.status).toBe(200);
		accessToken = loginRes.body.data.accessToken;

		// Get Teacher and Parent role IDs
		const teacherRole = await prisma.role.findUnique({
			where: { name: "Teacher" },
		});
		const parentRole = await prisma.role.findUnique({
			where: { name: "Parent" },
		});

		if (!teacherRole) {
			const created = await prisma.role.create({
				data: {
					name: "Teacher",
					description: "Teacher role for testing",
				},
			});
			teacherRoleId = created.id;
		} else {
			teacherRoleId = teacherRole.id;
		}

		if (!parentRole) {
			const created = await prisma.role.create({
				data: {
					name: "Parent",
					description: "Parent role for testing",
				},
			});
			parentRoleId = created.id;
		} else {
			parentRoleId = parentRole.id;
		}

		// Get or create Staff role (required for system users)
		const staffRole = await prisma.role.findUnique({
			where: { name: "Staff" },
		});

		if (!staffRole) {
			await prisma.role.create({
				data: {
					name: "Staff",
					description: "Staff role for system users",
				},
			});
		}
	});

	afterAll(async () => {
		// Clean up test data
		if (teacherId) {
			await prisma.teacher.delete({ where: { id: teacherId } }).catch(() => {});
		}
		if (parentId) {
			await prisma.parent.delete({ where: { id: parentId } }).catch(() => {});
		}
		if (systemUserId) {
			await prisma.systemUser
				.delete({ where: { id: systemUserId } })
				.catch(() => {});
		}

		// Clean up test users
		await prisma.user.deleteMany({
			where: {
				email: {
					in: [
						"teacher@example.com",
						"parent@example.com",
						"sysuser@example.com",
					],
				},
			},
		});

		await prisma.$disconnect();
	});

	// ============================================
	// TEACHER API TESTS
	// ============================================
	describe("Teacher API", () => {
		describe("POST /api/v1/teachers", () => {
			it("should create a new teacher", async () => {
				const response = await request(app)
					.post("/api/v1/teachers")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Test Teacher",
						email: "teacher@example.com",
						password: "Teacher1234",
						roleId: teacherRoleId,
						phone: "01712345678",
						qualifications: "PhD in Computer Science",
						experienceYears: 5,
						subjects: ["Math", "Physics"],
						certifications: ["Teaching Certificate"],
						bio: "Experienced teacher with 5 years of teaching",
					});

				expect(response.status).toBe(201);
				expect(response.body.success).toBe(true);
				teacherId = response.body.data;
			});

			it("should fail if email already exists", async () => {
				const response = await request(app)
					.post("/api/v1/teachers")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Duplicate Teacher",
						email: "teacher@example.com",
						password: "Teacher1234",
						roleId: teacherRoleId,
						phone: "01700000000",
					});

				expect(response.status).toBe(409);
			});

			it("should fail with missing required fields", async () => {
				const response = await request(app)
					.post("/api/v1/teachers")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Incomplete Teacher",
						// missing email and password
					});

				expect(response.status).toBe(400);
			});
		});

		describe("GET /api/v1/teachers", () => {
			it("should get all teachers with pagination", async () => {
				const res = await request(app)
					.get("/api/v1/teachers?page=1&limit=10")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.pagination).toHaveProperty("total");
				expect(Array.isArray(res.body.data)).toBe(true);
				expect(res.body.data.length).toBeGreaterThanOrEqual(1);
			});
		});

		describe("GET /api/v1/teachers/:id", () => {
			it("should get teacher by id", async () => {
				const res = await request(app)
					.get(`/api/v1/teachers/${teacherId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.email).toBe("teacher@example.com");
			});

			it("should return 400 for invalid UUID", async () => {
				const res = await request(app)
					.get("/api/v1/teachers/invalid-id")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(400);
			});

			it("should return 404 for non-existent teacher", async () => {
				const res = await request(app)
					.get("/api/v1/teachers/ckx9f2a9b0001l7z8k3q9m2x1")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(404);
			});
		});

		describe("PUT /api/v1/teachers/:id", () => {
			it("should update teacher data", async () => {
				const res = await request(app)
					.put(`/api/v1/teachers/${teacherId}`)
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						qualifications: "Updated PhD in Computer Science",
						experienceYears: 6,
						bio: "Updated bio with 6 years experience",
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
			});

			it("should return 404 for non-existent teacher", async () => {
				const res = await request(app)
					.put("/api/v1/teachers/ckx9f2a9b0001l7z8k3q9m2x1")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						experienceYears: 10,
					});

				expect(res.status).toBe(404);
			});
		});

		describe("DELETE /api/v1/teachers/:id", () => {
			it("should delete the teacher", async () => {
				const res = await request(app)
					.delete(`/api/v1/teachers/${teacherId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toContain("deleted successfully");

				// Verify deletion
				const getRes = await request(app)
					.get(`/api/v1/teachers/${teacherId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(getRes.status).toBe(404);
			});
		});
	});

	// ============================================
	// PARENT API TESTS
	// ============================================
	describe("Parent API", () => {
		describe("POST /api/v1/parents", () => {
			it("should create a new parent", async () => {
				const response = await request(app)
					.post("/api/v1/parents")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Test Parent",
						email: "parent@example.com",
						password: "Parent1234",
						roleId: parentRoleId,
						phone: "01812345678",
						contactNumber: "01812345678",
						relation: "FATHER",
					});

				expect(response.status).toBe(201);
				expect(response.body.success).toBe(true);
				parentId = response.body.data;
			});

			it("should fail if email already exists", async () => {
				const response = await request(app)
					.post("/api/v1/parents")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Duplicate Parent",
						email: "parent@example.com",
						password: "Parent1234",
						roleId: parentRoleId,
						phone: "01700000000",
					});

				expect(response.status).toBe(409);
			});
		});

		describe("GET /api/v1/parents", () => {
			it("should get all parents with pagination", async () => {
				const res = await request(app)
					.get("/api/v1/parents?page=1&limit=10")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.pagination).toHaveProperty("total");
				expect(Array.isArray(res.body.data)).toBe(true);
			});
		});

		describe("GET /api/v1/parents/:id", () => {
			it("should get parent by id", async () => {
				const res = await request(app)
					.get(`/api/v1/parents/${parentId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.email).toBe("parent@example.com");
			});

			it("should return 400 for invalid UUID", async () => {
				const res = await request(app)
					.get("/api/v1/parents/invalid-id")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(400);
			});
		});

		describe("PUT /api/v1/parents/:id", () => {
			it("should update parent data", async () => {
				const res = await request(app)
					.put(`/api/v1/parents/${parentId}`)
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						contactNumber: "01899999999",
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
			});
		});

		describe("DELETE /api/v1/parents/:id", () => {
			it("should delete the parent", async () => {
				const res = await request(app)
					.delete(`/api/v1/parents/${parentId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toContain("deleted successfully");
			});
		});
	});

	// ============================================
	// SYSTEM USER API TESTS
	// ============================================
	describe("System User API", () => {
		describe("POST /api/v1/system-users", () => {
			it("should create a new system user", async () => {
				const response = await request(app)
					.post("/api/v1/system-users")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Test System User",
						email: "sysuser@example.com",
						password: "SysUser1234",
						phone: "01912345678",
						jobTitle: "DEVELOPER",
						department: "IT",
					});

				expect(response.status).toBe(201);
				expect(response.body.success).toBe(true);
				systemUserId = response.body.data;
			});

			it("should fail if email already exists", async () => {
				const response = await request(app)
					.post("/api/v1/system-users")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Duplicate System User",
						email: "sysuser@example.com",
						password: "SysUser1234",
						phone: "01700000000",
						jobTitle: "ADMIN",
						department: "HR",
					});

				expect(response.status).toBe(409);
			});

			it("should fail with invalid job title", async () => {
				const response = await request(app)
					.post("/api/v1/system-users")
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						name: "Invalid System User",
						email: "invalid@example.com",
						password: "SysUser1234",
						phone: "01700000000",
						jobTitle: "INVALID_JOB",
						department: "IT",
					});

				expect(response.status).toBe(400);
			});
		});

		describe("GET /api/v1/system-users", () => {
			it("should get all system users with pagination", async () => {
				const res = await request(app)
					.get("/api/v1/system-users?page=1&limit=10")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.pagination).toHaveProperty("total");
				expect(Array.isArray(res.body.data)).toBe(true);
			});
		});

		describe("GET /api/v1/system-users/:id", () => {
			it("should get system user by id", async () => {
				const res = await request(app)
					.get(`/api/v1/system-users/${systemUserId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.email).toBe("sysuser@example.com");
			});

			it("should return 400 for invalid UUID", async () => {
				const res = await request(app)
					.get("/api/v1/system-users/invalid-id")
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(400);
			});
		});

		describe("PUT /api/v1/system-users/:id", () => {
			it("should update system user data", async () => {
				const res = await request(app)
					.put(`/api/v1/system-users/${systemUserId}`)
					.set("Authorization", `Bearer ${accessToken}`)
					.send({
						jobTitle: "MANAGER",
						department: "OPERATIONS",
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
			});
		});

		describe("DELETE /api/v1/system-users/:id", () => {
			it("should delete the system user", async () => {
				const res = await request(app)
					.delete(`/api/v1/system-users/${systemUserId}`)
					.set("Authorization", `Bearer ${accessToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toContain("deleted successfully");
			});
		});
	});
});
