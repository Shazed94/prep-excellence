import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe.sequential("LMS Module API", () => {
	let instructorAccessToken: string;
	let instructorUserId: string;
	let instructorId: string;
	let courseId: string;
	let moduleId: string;

	beforeAll(async () => {
		// Create roles
		await prisma.role.upsert({
			where: { name: "Student" },
			update: {},
			create: { name: "Student", description: "Student role" },
		});

		const instructorRole = await prisma.role.upsert({
			where: { name: "Instructor" },
			update: {},
			create: { name: "Instructor", description: "Instructor role" },
		});

		// Add LMS permissions to instructor role
		const permissions = await prisma.permission.findMany({
			where: {
				OR: [
					{ codeName: { startsWith: "LMSCourse" } },
					{ codeName: { startsWith: "LMSModule" } },
					{ codeName: { startsWith: "LMSLesson" } },
					{ codeName: { startsWith: "LMSQuiz" } },
				],
			},
		});
		if (permissions.length > 0) {
			await prisma.role.update({
				where: { id: instructorRole.id },
				data: {
					permissions: {
						connect: permissions.map((p) => ({ id: p.id })),
					},
				},
			});
		}

		// Clean up existing test data
		await prisma.user.deleteMany({
			where: {
				email: { in: ["student-mod@test.com", "instructor-mod@test.com"] },
			},
		});

		// Create test users
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);

		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});

		await prisma.user.create({
			data: {
				email: "student-mod@test.com",
				password: hashedPassword,
				name: "Test Student Module",
				roleId: studentRole!.id,
				isVerified: true,
				isActive: true,
			},
		});

		// Create instructor user
		const instructorUser = await prisma.user.create({
			data: {
				email: "instructor-mod@test.com",
				password: hashedPassword,
				name: "Test Instructor Module",
				roleId: instructorRole.id,
				isVerified: true,
				isActive: true,
				isStaff: true,
			},
		});
		instructorUserId = instructorUser.id;

		// Create instructor profile
		const instructor = await prisma.teacher.create({
			data: {
				userId: instructorUserId,
				bio: "Test instructor bio",
			},
		});
		instructorId = instructor.id;

		// Create test course
		const course = await prisma.lMSCourse.create({
			data: {
				title: "Test Course for Modules",
				description: "Test course",
				category: "Test",
				level: "BEGINNER",
				price: 100,

				instructorId,
				slug: "test-course-for-modules",
			},
		});
		courseId = course.id;

		// Login to get tokens
		const instructorLogin = await request(app).post("/api/v1/auth/login").send({
			email: "instructor-mod@test.com",
			password: "Test1234",
		});
		instructorAccessToken = instructorLogin.body.data.accessToken;
	});

	afterAll(async () => {
		// Clean up test data in correct order
		await prisma.lMSEnrollment.deleteMany({
			where: { course: { instructorId } },
		});
		await prisma.lMSCourse.deleteMany({
			where: { instructorId },
		});
		await prisma.teacher.deleteMany({
			where: { userId: instructorUserId },
		});
		await prisma.user.deleteMany({
			where: {
				email: { in: ["student-mod@test.com", "instructor-mod@test.com"] },
			},
		});
		await prisma.$disconnect();
	});

	describe("POST /api/v1/lms/courses/:courseId/modules", () => {
		it("should create a new module", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${courseId}/modules`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Introduction Module",
					description: "First module of the course",
					orderIndex: 1,
					courseId,
				});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.title).toBe("Introduction Module");
			expect(response.body.data.courseId).toBe(courseId);

			moduleId = response.body.data.id;
		});

		it("should validate required fields", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${courseId}/modules`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					description: "Missing title",
					courseId,
				});

			expect(response.status).toBe(500);
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${courseId}/modules`)
				.send({
					title: "Unauthorized Module",
					orderIndex: 2,
				});

			expect(response.status).toBe(401);
		});
	});

	describe("GET /api/v1/lms/courses/:courseId/modules", () => {
		beforeAll(async () => {
			// Create additional modules for testing
			await prisma.lMSModule.createMany({
				data: [
					{
						title: "Advanced Topics",
						description: "Advanced module",
						courseId,
						orderIndex: 2,
					},
					{
						title: "Final Module",
						description: "Last module",
						courseId,
						orderIndex: 3,
					},
				],
			});
		});

		it("should fetch all modules for a course", async () => {
			const response = await request(app).get(
				`/api/v1/lms/courses/${courseId}/modules`,
			);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBeGreaterThanOrEqual(2);
		});

		it("should support pagination", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/courses/${courseId}/modules`)
				.query({ page: 1, limit: 2 });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.length).toBeLessThanOrEqual(2);
			expect(response.body.pagination).toHaveProperty("total");
			expect(response.body.pagination).toHaveProperty("totalPages");
		});

		it("should include lessons and quizzes", async () => {
			const response = await request(app).get(
				`/api/v1/lms/courses/${courseId}/modules`,
			);

			expect(response.status).toBe(200);
			expect(response.body.data[0]).toHaveProperty("lessons");
			expect(response.body.data[0]).toHaveProperty("quizzes");
		});

		it("should support search", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/courses/${courseId}/modules`)
				.query({ search: "Module" });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.length).toBeGreaterThan(0);
		});

		it("should return modules with valid data structure", async () => {
			const response = await request(app).get(
				`/api/v1/lms/courses/${courseId}/modules`,
			);

			expect(response.status).toBe(200);
			const modules = response.body.data;
			expect(modules.length).toBeGreaterThan(0);
			// Verify each module has required properties
			modules.forEach((module: any) => {
				expect(module).toHaveProperty("id");
				expect(module).toHaveProperty("title");
				expect(module).toHaveProperty("orderIndex");
				expect(module).toHaveProperty("courseId");
			});
		});
	});

	describe("PATCH /api/v1/lms/modules/:id", () => {
		it("should update a module", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/modules/${moduleId}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Updated Introduction Module",
					description: "Updated description",
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.title).toBe("Updated Introduction Module");
			expect(response.body.data.description).toBe("Updated description");
		});

		it("should update orderIndex", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/modules/${moduleId}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					orderIndex: 10,
				});

			expect(response.status).toBe(200);
			expect(response.body.data.orderIndex).toBe(10);
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/modules/${moduleId}`)
				.send({
					title: "Unauthorized Update",
				});

			expect(response.status).toBe(401);
		});
	});

	describe("DELETE /api/v1/lms/modules/:id", () => {
		it("should delete a module", async () => {
			// Create a module to delete
			const moduleToDelete = await prisma.lMSModule.create({
				data: {
					title: "Module to Delete",
					description: "Will be deleted",
					courseId,
					orderIndex: 99,
				},
			});

			const response = await request(app)
				.delete(`/api/v1/lms/modules/${moduleToDelete.id}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);

			// Verify deletion
			const deleted = await prisma.lMSModule.findUnique({
				where: { id: moduleToDelete.id },
			});
			expect(deleted).toBeNull();
		});

		it("should require authentication", async () => {
			const response = await request(app).delete(
				`/api/v1/lms/modules/${moduleId}`,
			);

			expect(response.status).toBe(401);
		});
	});
});
