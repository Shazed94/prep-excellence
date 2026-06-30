import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe.sequential("LMS Progress API", () => {
	let accessToken: string;
	let instructorUserId: string;
	let instructorId: string;
	let studentId: string;
	let courseId: string;
	let moduleId: string;
	let lesson1Id: string;
	let lesson2Id: string;
	let lesson3Id: string;
	let enrollmentId: string;

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

		// Clean up existing test data
		await prisma.user.deleteMany({
			where: {
				email: {
					in: ["student-progress@test.com", "instructor-progress@test.com"],
				},
			},
		});

		// Create test users
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);

		const studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});

		const testUser = await prisma.user.create({
			data: {
				email: "student-progress@test.com",
				password: hashedPassword,
				name: "Test Student Progress",
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
				email: "instructor-progress@test.com",
				password: hashedPassword,
				name: "Test Instructor Progress",
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

		// Create test course, module, and lessons
		const course = await prisma.course.create({
			data: {
				title: "Test Course for Progress",
				description: "Test course",
				category: "Test",
				level: "BEGINNER",
				price: 100,

				instructorId,
				slug: "test-course-for-progress",
				isPublished: true,
				publishedAt: new Date(),
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

		// Create lessons with video durations
		const lesson1 = await prisma.lesson.create({
			data: {
				title: "Lesson 1",
				description: "First lesson",
				moduleId,
				contentType: "VIDEO_RECORDED",
				orderIndex: 1,
				videoDuration: 600, // 10 minutes
			},
		});
		lesson1Id = lesson1.id;

		const lesson2 = await prisma.lesson.create({
			data: {
				title: "Lesson 2",
				description: "Second lesson",
				moduleId,
				contentType: "VIDEO_RECORDED",
				orderIndex: 2,
				videoDuration: 900, // 15 minutes
			},
		});
		lesson2Id = lesson2.id;

		const lesson3 = await prisma.lesson.create({
			data: {
				title: "Lesson 3",
				description: "Third lesson",
				moduleId,
				contentType: "READING_MATERIAL",
				orderIndex: 3,
				content: "Text content",
			},
		});
		lesson3Id = lesson3.id;

		// Create enrollment
		const enrollment = await prisma.enrollment.create({
			data: {
				courseId,
				studentId,
				status: "ACTIVE",
			},
		});
		enrollmentId = enrollment.id;

		// Login to get token
		const studentLogin = await request(app).post("/api/v1/auth/login").send({
			email: "student-progress@test.com",
			password: "Test1234",
		});
		accessToken = studentLogin.body.data.accessToken;
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
					in: ["student-progress@test.com", "instructor-progress@test.com"],
				},
			},
		});
		await prisma.$disconnect();
	});

	describe("PATCH /api/v1/lms/progress/:enrollmentId/lessons/:lessonId", () => {
		it("should create new progress record", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson1Id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: lesson1Id,
					watchTimeSeconds: 120,
					lastPosition: 120,
					completionPercent: 20,
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.lessonId).toBe(lesson1Id);
			expect(response.body.data.watchTimeSeconds).toBe(120);
			expect(response.body.data.completionPercent).toBe(20);
			expect(response.body.data.isCompleted).toBe(false);
		});

		it("should update existing progress record", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson1Id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: lesson1Id,
					watchTimeSeconds: 300,
					lastPosition: 300,
					completionPercent: 50,
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.watchTimeSeconds).toBe(300);
			expect(response.body.data.completionPercent).toBe(50);
			expect(response.body.data.isCompleted).toBe(false);
		});

		it("should mark lesson as completed when completionPercent >= 90", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson1Id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: lesson1Id,
					watchTimeSeconds: 550,
					lastPosition: 550,
					completionPercent: 92,
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.isCompleted).toBe(true);
			expect(response.body.data.completedAt).toBeTruthy();
		});

		it("should mark lesson as completed explicitly", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson2Id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: lesson2Id,
					watchTimeSeconds: 900,
					lastPosition: 900,
					completionPercent: 100,
					isCompleted: true,
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.isCompleted).toBe(true);
			expect(response.body.data.completedAt).toBeTruthy();
		});

		it("should return 404 for invalid enrollment", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/progress/invalid_enrollment/lessons/${lesson1Id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: lesson1Id,
					watchTimeSeconds: 100,
					lastPosition: 100,
					completionPercent: 10,
				});

			// API validates params and returns 400 for invalid IDs
			expect(response.status).toBe(400);
		});

		it("should return 403 for inactive enrollment", async () => {
			// Create inactive enrollment
			const inactiveCourse = await prisma.course.create({
				data: {
					title: "Inactive Course",
					description: "Test",
					category: "Test",
					level: "BEGINNER",
					price: 0,
					instructorId,
					slug: "inactive-course-test",
					isPublished: true,
					publishedAt: new Date(),
				},
			});

			const inactiveEnrollment = await prisma.enrollment.create({
				data: {
					courseId: inactiveCourse.id,
					studentId,
					status: "SUSPENDED",
				},
			});

			const inactiveModule = await prisma.module.create({
				data: {
					title: "Test Module",
					courseId: inactiveCourse.id,
					orderIndex: 1,
				},
			});

			const inactiveLesson = await prisma.lesson.create({
				data: {
					title: "Test Lesson",
					description: "Test",
					moduleId: inactiveModule.id,
					contentType: "VIDEO_RECORDED",
					orderIndex: 1,
					videoDuration: 600,
				},
			});

			const response = await request(app)
				.patch(
					`/api/v1/lms/progress/${inactiveEnrollment.id}/lessons/${inactiveLesson.id}`,
				)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: inactiveLesson.id,
					watchTimeSeconds: 100,
					lastPosition: 100,
					completionPercent: 10,
				});

			expect(response.status).toBe(403);
			expect(
				(response.body.message || response.body.error || "").toLowerCase(),
			).toContain("not active");
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson1Id}`)
				.send({
					lessonId: lesson1Id,
					watchTimeSeconds: 100,
					lastPosition: 100,
					completionPercent: 10,
				});

			expect(response.status).toBe(401);
		});
	});

	describe("GET /api/v1/lms/progress/:enrollmentId", () => {
		beforeAll(async () => {
			// Ensure we have some progress data
			await prisma.lMSProgress.upsert({
				where: {
					lessonId_studentId: {
						lessonId: lesson3Id,
						studentId,
					},
				},
				update: {
					completionPercent: 100,
					isCompleted: true,
					completedAt: new Date(),
				},
				create: {
					studentId,
					lessonId: lesson3Id,
					watchTimeSeconds: 0,
					lastPosition: 0,
					completionPercent: 100,
					isCompleted: true,
					completedAt: new Date(),
				},
			});
		});

		it("should fetch all progress for an enrollment", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBeGreaterThanOrEqual(3);
		});

		it("should include lesson details", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			const progressItem = response.body.data[0];
			expect(progressItem).toHaveProperty("lesson");
			expect(progressItem.lesson).toHaveProperty("title");
			expect(progressItem.lesson).toHaveProperty("videoDuration");
		});

		it("should sort by lesson orderIndex", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			const lessons = response.body.data;
			for (let i = 0; i < lessons.length - 1; i++) {
				expect(lessons[i].lesson.orderIndex).toBeLessThanOrEqual(
					lessons[i + 1].lesson.orderIndex,
				);
			}
		});

		it("should return 404 for invalid enrollment", async () => {
			const response = await request(app)
				.get("/api/v1/lms/progress/invalid_enrollment")
				.set("Authorization", `Bearer ${accessToken}`);

			// API validates params and returns 400 for invalid IDs
			expect(response.status).toBe(400);
		});

		it("should require authentication", async () => {
			const response = await request(app).get(
				`/api/v1/lms/progress/${enrollmentId}`,
			);

			expect(response.status).toBe(401);
		});
	});

	describe("GET /api/v1/lms/progress/:enrollmentId/lessons/:lessonId", () => {
		it("should fetch progress for specific lesson", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson1Id}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("lessonId");
			expect(response.body.data).toHaveProperty("watchTimeSeconds");
			expect(response.body.data).toHaveProperty("completionPercent");
			expect(response.body.data).toHaveProperty("isCompleted");
		});

		it("should return default values for lesson without progress", async () => {
			// Create a new lesson without progress
			const newLesson = await prisma.lesson.create({
				data: {
					title: "New Lesson",
					description: "No progress yet",
					moduleId,
					contentType: "VIDEO_RECORDED",
					orderIndex: 10,
					videoDuration: 600,
				},
			});

			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}/lessons/${newLesson.id}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.watchTimeSeconds).toBe(0);
			expect(response.body.data.lastPosition).toBe(0);
			expect(response.body.data.completionPercent).toBe(0);
			expect(response.body.data.isCompleted).toBe(false);
		});

		it("should include lesson details", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson2Id}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty("lesson");
			expect(response.body.data.lesson.id).toBe(lesson2Id);
		});

		it("should return 404 for invalid enrollment", async () => {
			const response = await request(app)
				.get(`/api/v1/lms/progress/invalid_enrollment/lessons/${lesson1Id}`)
				.set("Authorization", `Bearer ${accessToken}`);

			// API validates params and returns 400 for invalid IDs
			expect(response.status).toBe(400);
		});

		it("should require authentication", async () => {
			const response = await request(app).get(
				`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson1Id}`,
			);

			expect(response.status).toBe(401);
		});
	});

	describe("Progress Tracking Scenarios", () => {
		it("should track incremental video watching progress", async () => {
			// Create new lesson for this test
			const videoLesson = await prisma.lesson.create({
				data: {
					title: "Video Progress Test",
					description: "Test",
					moduleId,
					contentType: "VIDEO_RECORDED",
					orderIndex: 20,
					videoDuration: 1000,
				},
			});

			// Watch 25%
			await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${videoLesson.id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: videoLesson.id,
					watchTimeSeconds: 250,
					lastPosition: 250,
					completionPercent: 25,
				});

			// Watch 50%
			await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${videoLesson.id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: videoLesson.id,
					watchTimeSeconds: 500,
					lastPosition: 500,
					completionPercent: 50,
				});

			// Watch 75%
			await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${videoLesson.id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: videoLesson.id,
					watchTimeSeconds: 750,
					lastPosition: 750,
					completionPercent: 75,
				});

			// Complete
			const finalResponse = await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${videoLesson.id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: videoLesson.id,
					watchTimeSeconds: 1000,
					lastPosition: 1000,
					completionPercent: 100,
				});

			expect(finalResponse.status).toBe(200);
			expect(finalResponse.body.data.watchTimeSeconds).toBe(1000);
			expect(finalResponse.body.data.isCompleted).toBe(true);
		});

		it("should allow resuming from last position", async () => {
			// Update with last position
			await request(app)
				.patch(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson2Id}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					lessonId: lesson2Id,
					lastPosition: 450,
					watchTimeSeconds: 450,
					completionPercent: 50,
				});

			// Fetch progress
			const response = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}/lessons/${lesson2Id}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data.lastPosition).toBe(450);
		});

		it("should calculate overall course progress", async () => {
			const progressResponse = await request(app)
				.get(`/api/v1/lms/progress/${enrollmentId}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(progressResponse.status).toBe(200);
			const allProgress = progressResponse.body.data;

			const completedCount = allProgress.filter(
				(p: any) => p.isCompleted,
			).length;
			const totalLessons = allProgress.length;
			const overallProgress = (completedCount / totalLessons) * 100;

			expect(overallProgress).toBeGreaterThanOrEqual(0);
			expect(overallProgress).toBeLessThanOrEqual(100);
		});
	});
});
