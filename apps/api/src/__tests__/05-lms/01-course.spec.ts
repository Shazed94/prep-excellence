import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe.sequential("LMS Course API", () => {
	let instructorAccessToken: string;
	let instructorUserId: string;
	let instructorId: string;
	let courseId: string;
	let publishedCourseId: string;

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
				email: { in: ["student@test.com", "instructor@test.com"] },
			},
		});

		// Create test student user
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);
		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});

		await prisma.user.create({
			data: {
				email: "student@test.com",
				password: hashedPassword,
				name: "Test Student",
				roleId: studentRole!.id,
				isVerified: true,
				isActive: true,
			},
		});

		// Create test instructor user
		const instructorUser = await prisma.user.create({
			data: {
				email: "instructor@test.com",
				password: hashedPassword,
				name: "Test Instructor",
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

		// Login to get tokens
		const instructorLogin = await request(app).post("/api/v1/auth/login").send({
			email: "instructor@test.com",
			password: "Test1234",
		});
		instructorAccessToken = instructorLogin.body.data.accessToken;
	});

	afterAll(async () => {
		// Clean up test data in correct order to avoid foreign key violations
		await prisma.enrollment.deleteMany({
			where: { course: { instructorId } },
		});
		await prisma.course.deleteMany({
			where: { instructorId },
		});
		await prisma.teacher.deleteMany({
			where: { userId: instructorUserId },
		});
		await prisma.user.deleteMany({
			where: { email: { in: ["student@test.com", "instructor@test.com"] } },
		});
		await prisma.$disconnect();
	});

	describe("POST /api/v1/lms/courses", () => {
		it("should create a new course", async () => {
			const response = await request(app)
				.post("/api/v1/lms/courses")
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Introduction to Programming",
					description: "Learn programming from scratch",
					category: "Programming",
					level: "BEGINNER",
					price: 99.99,
					whatYouLearn: ["Programming basics", "Problem solving"],
					instructorId,
				});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.title).toBe("Introduction to Programming");
			expect(response.body.data.slug).toBe("introduction-to-programming");

			courseId = response.body.data.id;
		});

		it("should not create course with duplicate title", async () => {
			const response = await request(app)
				.post("/api/v1/lms/courses")
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Introduction to Programming",
					description: "Duplicate course",
					category: "Programming",
					level: "BEGINNER",
					price: 99.99,
					whatYouLearn: ["Duplicate content"],
					instructorId,
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain("already exists");
		});

		it("should validate required fields", async () => {
			const response = await request(app)
				.post("/api/v1/lms/courses")
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					description: "Missing title",
				});

			expect(response.status).toBe(400);
		});
	});

	describe("GET /api/v1/lms/courses", () => {
		it("should fetch all courses with pagination", async () => {
			const response = await request(app)
				.get("/api/v1/lms/courses")
				.query({ page: 1, limit: 10 });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.pagination).toHaveProperty("total");
			expect(response.body.pagination).toHaveProperty("page");
		});

		it("should support search functionality", async () => {
			const response = await request(app)
				.get("/api/v1/lms/courses")
				.query({ search: "Programming" });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.length).toBeGreaterThan(0);
		});

		it("should support sorting", async () => {
			const response = await request(app)
				.get("/api/v1/lms/courses")
				.query({ sortBy: "createdAt", orderBy: "desc" });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
		});
	});

	describe("GET /api/v1/lms/courses/:id", () => {
		it("should fetch a single course by id", async () => {
			const response = await request(app).get(
				`/api/v1/lms/courses/${courseId}`,
			);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.id).toBe(courseId);
			expect(response.body.data).toHaveProperty("modules");
			expect(response.body.data).toHaveProperty("reviews");
		});

		it("should return 404 for non-existent course", async () => {
			const response = await request(app).get(
				"/api/v1/lms/courses/c0000000000000000000000a",
			);

			expect(response.status).toBe(404);
		});
	});

	describe("PATCH /api/v1/lms/courses/:id", () => {
		it("should update a course", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/courses/${courseId}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Updated Programming Course",
					price: 149.99,
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.title).toBe("Updated Programming Course");
			expect(response.body.data.price).toBe("149.99");
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/courses/${courseId}`)
				.send({
					title: "Unauthorized Update",
				});

			expect(response.status).toBe(401);
		});
	});

	describe("PATCH /api/v1/lms/courses/:id/publish", () => {
		beforeAll(async () => {
			// Create a separate course for publishing tests
			const course = await prisma.course.create({
				data: {
					title: "Course to Publish",
					description: "Test course for publishing",
					category: "Test",
					level: "BEGINNER",
					price: 50,
					instructorId,
					slug: "course-to-publish",
				},
			});
			publishedCourseId = course.id;
		});

		it("should publish a course", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/courses/${publishedCourseId}/publish`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({ isPublished: true });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.isPublished).toBe(true);
			expect(response.body.data.publishedAt).toBeTruthy();
		});

		it("should unpublish a course", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/courses/${publishedCourseId}/publish`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({ isPublished: false });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.isPublished).toBe(false);
			expect(response.body.data.publishedAt).toBeNull();
		});
	});

	describe("DELETE /api/v1/lms/courses/:id", () => {
		it("should delete a course", async () => {
			// Create a course to delete
			const courseToDelete = await prisma.course.create({
				data: {
					title: "Course to Delete",
					description: "Will be deleted",
					category: "Test",
					level: "BEGINNER",
					price: 0,
					instructorId,
					slug: "course-to-delete",
				},
			});

			const response = await request(app)
				.delete(`/api/v1/lms/courses/${courseToDelete.id}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);

			// Verify deletion
			const deleted = await prisma.course.findUnique({
				where: { id: courseToDelete.id },
			});
			expect(deleted).toBeNull();
		});

		it("should return 404 when deleting non-existent course", async () => {
			const response = await request(app)
				.delete("/api/v1/lms/courses/c0000000000000000000000a")
				.set("Authorization", `Bearer ${instructorAccessToken}`);

			expect(response.status).toBe(404);
		});
	});
});
