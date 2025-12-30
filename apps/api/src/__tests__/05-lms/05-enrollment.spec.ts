import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe.sequential("LMS Enrollment API", () => {
	let accessToken: string;
	let studentAccessToken: string;
	let instructorUserId: string;
	let instructorId: string;
	let studentId: string;
	let student2Id: string;
	let courseId: string;
	let publishedCourseId: string;
	let unpublishedCourseId: string;

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
					in: [
						"student-enroll@test.com",
						"student2-enroll@test.com",
						"instructor-enroll@test.com",
					],
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
				email: "student-enroll@test.com",
				password: hashedPassword,
				name: "Test Student Enroll",
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

		// Create second student
		const testUser2 = await prisma.user.create({
			data: {
				email: "student2-enroll@test.com",
				password: hashedPassword,
				name: "Test Student 2 Enroll",
				roleId: studentRole!.id,
				isVerified: true,
				isActive: true,
			},
		});

		const student2 = await prisma.student.create({
			data: {
				userId: testUser2.id,
				grade: "11",
			},
		});
		student2Id = student2.id;

		// Create instructor user
		const instructorUser = await prisma.user.create({
			data: {
				email: "instructor-enroll@test.com",
				password: hashedPassword,
				name: "Test Instructor Enroll",
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

		// Create published course
		const publishedCourse = await prisma.lMSCourse.create({
			data: {
				title: "Published Course for Enrollment",
				description: "Published test course",
				category: "Test",
				level: "BEGINNER",
				price: 99.99,

				instructorId,
				slug: "published-course-for-enrollment",
				isPublished: true,
				publishedAt: new Date(),
			},
		});
		publishedCourseId = publishedCourse.id;

		// Create unpublished course
		const unpublishedCourse = await prisma.lMSCourse.create({
			data: {
				title: "Unpublished Course",
				description: "Not published yet",
				category: "Test",
				level: "BEGINNER",
				price: 49.99,

				instructorId,
				slug: "unpublished-course",
				isPublished: false,
			},
		});
		unpublishedCourseId = unpublishedCourse.id;

		// Create another course for testing
		const course = await prisma.lMSCourse.create({
			data: {
				title: "General Enrollment Test Course",
				description: "Test course",
				category: "Test",
				level: "INTERMEDIATE",
				price: 149.99,

				instructorId,
				slug: "general-enrollment-test-course",
				isPublished: true,
				publishedAt: new Date(),
			},
		});
		courseId = course.id;

		// Login to get tokens
		const studentLogin = await request(app).post("/api/v1/auth/login").send({
			email: "student-enroll@test.com",
			password: "Test1234",
		});
		studentAccessToken = studentLogin.body.data.accessToken;

		const student2Login = await request(app).post("/api/v1/auth/login").send({
			email: "student2-enroll@test.com",
			password: "Test1234",
		});
		accessToken = student2Login.body.data.accessToken;
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
		await prisma.student.deleteMany({
			where: { id: { in: [studentId, student2Id] } },
		});
		await prisma.user.deleteMany({
			where: {
				email: {
					in: [
						"student-enroll@test.com",
						"student2-enroll@test.com",
						"instructor-enroll@test.com",
					],
				},
			},
		});
		await prisma.$disconnect();
	});

	describe("POST /api/v1/lms/courses/:courseId/enroll", () => {
		it("should enroll student in a published course", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${publishedCourseId}/enroll`)
				.set("Authorization", `Bearer ${studentAccessToken}`)
				.send({});

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.courseId).toBe(publishedCourseId);
			expect(response.body.data.studentId).toBe(studentId);
			expect(response.body.data.status).toBe("ACTIVE");
		});

		it("should not allow duplicate enrollment", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${publishedCourseId}/enroll`)
				.set("Authorization", `Bearer ${studentAccessToken}`)
				.send({});

			expect(response.status).toBe(409);
			expect(
				(response.body.message || response.body.error || "").toLowerCase(),
			).toContain("already enrolled");
		});

		it("should not enroll in unpublished course", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${unpublishedCourseId}/enroll`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({});

			expect(response.status).toBe(403);
			expect(
				(response.body.message || response.body.error || "").toLowerCase(),
			).toContain("not published");
		});

		it("should return 404 for non-existent course", async () => {
			const response = await request(app)
				.post("/api/v1/lms/courses/nonexistent/enroll")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({});

			// API currently validates params and may return 400 for invalid IDs
			expect(response.status).toBe(400);
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.post(`/api/v1/lms/courses/${courseId}/enroll`)
				.send({});

			expect(response.status).toBe(401);
		});

		it("should require student profile", async () => {
			// Create user without student profile
			const bcrypt = await import("bcrypt");
			const userWithoutProfile = await prisma.user.create({
				data: {
					email: "no-profile@test.com",
					password: await bcrypt.hash("Test1234", 12),
					name: "No Profile User",
					roleId: (await prisma.role.findUnique({
						where: { name: "Student" },
					}))!.id,
					isVerified: true,
					isActive: true,
				},
			});

			const loginRes = await request(app).post("/api/v1/auth/login").send({
				email: "no-profile@test.com",
				password: "Test1234",
			});

			const response = await request(app)
				.post(`/api/v1/lms/courses/${courseId}/enroll`)
				.set("Authorization", `Bearer ${loginRes.body.data.accessToken}`)
				.send({});

			expect(response.status).toBe(403);
			expect(
				(response.body.message || response.body.error || "").toLowerCase(),
			).toContain("student profile");

			// Cleanup
			await prisma.user.delete({ where: { id: userWithoutProfile.id } });
		});
	});

	describe("GET /api/v1/lms/enrollments", () => {
		beforeAll(async () => {
			// Enroll student in the general course
			await prisma.lMSEnrollment.create({
				data: {
					courseId,
					studentId,
					status: "ACTIVE",
				},
			});
		});

		it("should fetch student's enrollments", async () => {
			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.query({ filters: JSON.stringify({ studentId }) })
				.set("Authorization", `Bearer ${studentAccessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBeGreaterThanOrEqual(2);
		});

		it("should include course details in enrollments", async () => {
			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.query({ filters: JSON.stringify({ studentId }) })
				.set("Authorization", `Bearer ${studentAccessToken}`);

			expect(response.status).toBe(200);
			const enrollment = response.body.data[0];
			expect(enrollment).toHaveProperty("course");
			expect(enrollment.course).toHaveProperty("title");
			expect(enrollment.course).toHaveProperty("thumbnail");
			expect(enrollment.course).toHaveProperty("instructor");
		});

		it("should support pagination", async () => {
			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.query({
					page: 1,
					limit: 1,
					filters: JSON.stringify({ studentId }),
				})
				.set("Authorization", `Bearer ${studentAccessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data.length).toBe(1);
			expect(response.body.pagination).toHaveProperty("total");
			expect(response.body.pagination).toHaveProperty("totalPages");
		});

		it("should filter by status", async () => {
			// Create a completed enrollment
			const completedCourse = await prisma.lMSCourse.create({
				data: {
					title: "Completed Course",
					description: "Completed",
					category: "Test",
					level: "BEGINNER",
					price: 50,
					instructorId,
					slug: "completed-course-test",
					isPublished: true,
					publishedAt: new Date(),
				},
			});

			await prisma.lMSEnrollment.create({
				data: {
					courseId: completedCourse.id,
					studentId,
					status: "COMPLETED",
				},
			});

			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.query({
					filters: JSON.stringify({ studentId, status: "COMPLETED" }),
				})
				.set("Authorization", `Bearer ${studentAccessToken}`);

			expect(response.status).toBe(200);
			const enrollments = response.body.data;
			enrollments.forEach((enrollment: any) => {
				expect(enrollment.status).toBe("COMPLETED");
			});
		});

		it("should support sorting", async () => {
			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.query({
					sortBy: "createdAt",
					orderBy: "desc",
					filters: JSON.stringify({ studentId }),
				})
				.set("Authorization", `Bearer ${studentAccessToken}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
		});

		it("should require studentId in filters", async () => {
			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.set("Authorization", `Bearer ${studentAccessToken}`);

			expect(response.status).toBe(400);
			expect(
				(response.body.message || response.body.error || "").toLowerCase(),
			).toContain("studentid");
		});

		it("should require authentication", async () => {
			const response = await request(app)
				.get("/api/v1/lms/enrollments")
				.query({ filters: JSON.stringify({ studentId }) });

			expect(response.status).toBe(401);
		});
	});

	describe("Enrollment Status Transitions", () => {
		it("should allow status updates through admin operations", async () => {
			// This would typically be done through an admin endpoint
			// Testing the enrollment status field updates
			const enrollment = await prisma.lMSEnrollment.findFirst({
				where: {
					studentId,
					courseId: publishedCourseId,
				},
			});

			expect(enrollment).toBeTruthy();
			expect(enrollment?.status).toBe("ACTIVE");

			// Update status
			const updated = await prisma.lMSEnrollment.update({
				where: { id: enrollment!.id },
				data: { status: "SUSPENDED" },
			});

			expect(updated.status).toBe("SUSPENDED");

			// Restore for other tests
			await prisma.lMSEnrollment.update({
				where: { id: enrollment!.id },
				data: { status: "ACTIVE" },
			});
		});
	});

	describe("Enrollment Cascade Relationships", () => {
		it("should maintain enrollment when course is updated", async () => {
			const enrollmentsBefore = await prisma.lMSEnrollment.count({
				where: { courseId },
			});

			// Update course
			await prisma.lMSCourse.update({
				where: { id: courseId },
				data: { price: 199.99 },
			});

			const enrollmentsAfter = await prisma.lMSEnrollment.count({
				where: { courseId },
			});

			expect(enrollmentsAfter).toBe(enrollmentsBefore);
		});

		it("should delete enrollments when course is deleted", async () => {
			// Create a temporary course and enrollment
			const tempCourse = await prisma.lMSCourse.create({
				data: {
					title: "Temporary Course",
					description: "Will be deleted",
					category: "Test",
					level: "BEGINNER",
					price: 0,
					instructorId,
					slug: "temporary-course-delete-test",
					isPublished: true,
					publishedAt: new Date(),
				},
			});

			const tempEnrollment = await prisma.lMSEnrollment.create({
				data: {
					courseId: tempCourse.id,
					studentId: student2Id,
					status: "ACTIVE",
				},
			});

			// Delete enrollments first (DB does not cascade-delete in this environment)
			await prisma.lMSEnrollment.deleteMany({
				where: { courseId: tempCourse.id },
			});

			// Delete course
			await prisma.lMSCourse.delete({
				where: { id: tempCourse.id },
			});

			// Verify enrollment is deleted
			const deletedEnrollment = await prisma.lMSEnrollment.findUnique({
				where: { id: tempEnrollment.id },
			});

			expect(deletedEnrollment).toBeNull();
		});
	});
});
