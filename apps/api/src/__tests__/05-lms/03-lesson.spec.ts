import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe.sequential("LMS Lesson API", () => {
	let instructorAccessToken: string;
	let instructorUserId: string;
	let instructorId: string;
	let studentId: string;
	let courseId: string;
	let moduleId: string;
	let lessonId: string;

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

		// Ensure instructor role has lesson delete permission used by tests
		await prisma.permission.upsert({
			where: { codeName: "LMSLesson.delete" },
			update: {},
			create: {
				codeName: "LMSLesson.delete",
				moduleName: "LMSLesson",
				label: "Delete LMS Lesson",
			},
		});

		await prisma.role.update({
			where: { id: instructorRole.id },
			data: {
				permissions: {
					connect: { codeName: "LMSLesson.delete" },
				},
			},
		});

		// Clean up existing test data
		await prisma.user.deleteMany({});

		// Create test users
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);

		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});

		const testUser = await prisma.user.create({
			data: {
				email: "student-lesson@test.com",
				password: hashedPassword,
				name: "Test Student Lesson",
				roleId: studentRole!.id,
				isVerified: true,
				isActive: true,
			},
		});

		const student = await prisma.student.create({
			data: {
				userId: testUser.id,
				grade: "10",
			},
		});
		studentId = student.id;

		// Create instructor user
		const instructorUser = await prisma.user.create({
			data: {
				email: "instructor-lesson@test.com",
				password: hashedPassword,
				name: "Test Instructor Lesson",
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

		// Create test course and module
		const course = await prisma.course.create({
			data: {
				title: "Test Course for Lessons",
				description: "Test course",
				category: "Test",
				level: "BEGINNER",
				price: 100,

				instructorId,
				slug: "test-course-for-lessons",
			},
		});
		courseId = course.id;

		const module = await prisma.module.create({
			data: {
				title: "Test Module",
				description: "Test module",
				courseId,
				orderIndex: 1,
			},
		});
		moduleId = module.id;

		// Login to get tokens
		const instructorLogin = await request(app).post("/api/v1/auth/login").send({
			email: "instructor-lesson@test.com",
			password: "Test1234",
		});
		instructorAccessToken = instructorLogin.body.data.accessToken;
	});

	afterAll(async () => {
		// Clean up test data in correct order
		await prisma.enrollment.deleteMany({
			where: { course: { instructorId } },
		});
		await prisma.course.deleteMany({
			where: { instructorId },
		});
		await prisma.teacher.deleteMany({
			where: { userId: instructorUserId },
		});
		await prisma.student.deleteMany({
			where: { id: studentId },
		});
		await prisma.user.deleteMany({
			where: {
				email: {
					in: ["student-lesson@test.com", "instructor-lesson@test.com"],
				},
			},
		});
		await prisma.$disconnect();
	});

	describe("POST /api/v1/lms/modules/:id/lessons", () => {
		it("should create a new lesson", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Introduction to Variables",
					description: "Learn about variables",
					contentType: "VIDEO_RECORDED",
					orderIndex: 1,
					videoDuration: 600,
				});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.title).toBe("Introduction to Variables");
			expect(response.body.data.moduleId).toBe(moduleId);

			lessonId = response.body.data.id;
		});

		it("should create a text-based lesson", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Reading Material",
					description: "Text-based lesson",
					contentType: "READING_MATERIAL",
					content: "This is the lesson content",
					orderIndex: 2,
				});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data.contentType).toBe("READING_MATERIAL");
			expect(response.body.data.content).toBe("This is the lesson content");
		});

		it("should validate required fields", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					description: "Missing title",
				});

			expect(response.status).toBe(400);
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/modules/${moduleId}/lessons`)
				.send({
					title: "Unauthorized Lesson",
					contentType: "VIDEO",
					orderIndex: 3,
				});

			expect(response.status).toBe(401);
		});
	});

	describe("GET /api/v1/lms/modules/:id/lessons", () => {
		beforeAll(async () => {
			// Create additional lessons for testing
			await prisma.lesson.createMany({
				data: [
					{
						title: "Advanced Concepts",
						description: "Advanced lesson",
						moduleId,
						contentType: "VIDEO_RECORDED",
						orderIndex: 3,
						videoDuration: 900,
					},
					{
						title: "Practice Exercises",
						description: "Practice lesson",
						moduleId,
						contentType: "READING_MATERIAL",
						content: "Practice content",
						orderIndex: 4,
					},
				],
			});
		});

		it("should fetch all lessons for a module", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.query({ sortBy: "orderIndex" });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBeGreaterThanOrEqual(4);
		});

		it("should support pagination", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.query({ page: 1, limit: 2 });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.length).toBeLessThanOrEqual(2);
			expect(response.body.pagination).toHaveProperty("total");
		});

		it("should sort by orderIndex by default", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.query({ sortBy: "orderIndex" });

			expect(response.status).toBe(200);
			const lessons = response.body.data;
			for (let i = 0; i < lessons.length - 1; i++) {
				expect(lessons[i].orderIndex).toBeLessThanOrEqual(
					lessons[i + 1].orderIndex,
				);
			}
		});

		it("should filter by contentType", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.query({ filters: JSON.stringify({ contentType: "VIDEO_RECORDED" }) });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			const lessons = response.body.data;
			lessons.forEach((lesson: any) => {
				expect(lesson.contentType).toBe("VIDEO_RECORDED");
			});
		});

		it("should support search", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.query({ search: "Variables" });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.length).toBeGreaterThan(0);
		});

		it("should show unlock status when studentId provided", async () => {
			// Create enrollment for student
			await prisma.enrollment.create({
				data: {
					courseId,
					studentId,
					status: "ACTIVE",
				},
			});

			const response = await request(app)
				.get(`/api/v1/lms/modules/${moduleId}/lessons`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.query({ filters: JSON.stringify({ studentId }) });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data[0]).toHaveProperty("isUnlocked");
		});
	});

	describe("PATCH /api/v1/lms/lessons/:id", () => {
		it("should update a lesson", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/lessons/${lessonId}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					title: "Updated Variables Lesson",
					description: "Updated description",
					videoDuration: 700,
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.title).toBe("Updated Variables Lesson");
			expect(response.body.data.videoDuration).toBe(700);
		});

		it("should update content for text lessons", async () => {
			// Create a text lesson to update
			const textLesson = await prisma.lesson.create({
				data: {
					title: "Text Lesson to Update",
					description: "Test",
					moduleId,
					contentType: "READING_MATERIAL",
					content: "Original content",
					orderIndex: 10,
				},
			});

			const response = await request(app)
				.patch(`/api/v1/lms/lessons/${textLesson.id}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					content: "Updated content",
				});

			expect(response.status).toBe(200);
			expect(response.body.data.content).toBe("Updated content");
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/lessons/${lessonId}`)
				.send({
					title: "Unauthorized Update",
				});

			expect(response.status).toBe(401);
		});
	});

	describe("POST /api/v1/lms/lessons/:id/thumbnail/select", () => {
		it("should select a thumbnail from options", async () => {
			// First, set up thumbnail options
			await prisma.lesson.update({
				where: { id: lessonId },
				data: {
					thumbnailOptions: [
						{
							id: "thumb_1",
							url: "lessons/test/thumb_1.jpg",
							timestamp: 5,
						},
						{
							id: "thumb_2",
							url: "lessons/test/thumb_2.jpg",
							timestamp: 10,
						},
					],
				},
			});

			const response = await request(app)
				.post(`/api/v1/lms/lessons/${lessonId}/thumbnail/select`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					thumbnailId: "thumb_1",
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.thumbnailUrl).toContain("thumb_1.jpg");

			// Verify thumbnail was set
			const updated = await prisma.lesson.findUnique({
				where: { id: lessonId },
			});
			expect(updated?.thumbnailUrl).toBe("lessons/test/thumb_1.jpg");
		});

		it("should return 400 when no thumbnail options available", async () => {
			// Create a lesson without thumbnail options
			const lesson = await prisma.lesson.create({
				data: {
					title: "Lesson without Thumbnails",
					description: "Test",
					moduleId,
					contentType: "VIDEO_RECORDED",
					orderIndex: 20,
				},
			});

			const response = await request(app)
				.post(`/api/v1/lms/lessons/${lesson.id}/thumbnail/select`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					thumbnailId: "thumb_1",
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain("No thumbnail options");
		});

		it("should return 400 for invalid thumbnail ID", async () => {
			// Re-create thumbnail options to test invalid ID path
			await prisma.lesson.update({
				where: { id: lessonId },
				data: {
					thumbnailOptions: [
						{
							id: "tmp_thumb",
							url: "lessons/test/tmp_thumb.jpg",
							timestamp: 1,
						},
					],
				},
			});

			const response = await request(app)
				.post(`/api/v1/lms/lessons/${lessonId}/thumbnail/select`)
				.set("Authorization", `Bearer ${instructorAccessToken}`)
				.send({
					thumbnailId: "invalid_id",
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain("Invalid thumbnail ID");
		});
	});

	describe("DELETE /api/v1/lms/lessons/:id", () => {
		it("should delete a lesson", async () => {
			// Create a lesson to delete
			const lessonToDelete = await prisma.lesson.create({
				data: {
					title: "Lesson to Delete",
					description: "Will be deleted",
					moduleId,
					contentType: "READING_MATERIAL",
					content: "Content",
					orderIndex: 99,
				},
			});

			const response = await request(app)
				.delete(`/api/v1/lms/lessons/${lessonToDelete.id}`)
				.set("Authorization", `Bearer ${instructorAccessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);

			// Verify deletion
			const deleted = await prisma.lesson.findUnique({
				where: { id: lessonToDelete.id },
			});
			expect(deleted).toBeNull();
		});

		it("should require authentication", async () => {
			const response = await request(app).delete(
				`/api/v1/lms/lessons/${lessonId}`,
			);

			expect(response.status).toBe(401);
		});
	});
});
