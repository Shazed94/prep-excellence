import type { COURSE_TYPE, ENROLLMENT_STATUS } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";

export interface EnrollStudentInput {
	courseId: string;
	studentId: string;
	orderId?: string;
	courseType: COURSE_TYPE;
}

export interface EnrollmentFilter {
	studentId?: string;
	courseId?: string;
	status?: ENROLLMENT_STATUS;
	page?: number;
	limit?: number;
	courseType?: COURSE_TYPE;
}

class EnrollmentService {
	/**
	 * Enroll a student in a course.
	 * Works for both LMS and Coaching enrollments.
	 */
	async enroll(input: EnrollStudentInput) {
		const existing = await prisma.enrollment.findUnique({
			where: {
				courseId_studentId: {
					courseId: input.courseId,
					studentId: input.studentId,
				},
			},
		});

		if (existing) {
			if (existing.status === "ACTIVE") {
				throw new Error("Student is already enrolled in this course");
			}
			// Reactivate if previously cancelled/suspended
			return prisma.enrollment.update({
				where: { id: existing.id },
				data: { status: "ACTIVE", enrolledAt: new Date() },
				include: { course: true, student: true },
			});
		}

		const enrollment = await prisma.enrollment.create({
			data: {
				courseId: input.courseId,
				studentId: input.studentId,
				orderId: input.orderId,
				status: "ACTIVE",
			},
			include: { course: true, student: true },
		});

		// Initialize course progress
		await this.initializeCourseProgress(input.courseId, input.studentId);

		return enrollment;
	}

	/**
	 * Initialize a CourseProgress record when a student enrolls.
	 */
	private async initializeCourseProgress(courseId: string, studentId: string) {
		const totalModules = await prisma.courseModule.count({
			where: { courseId, isActive: true },
		});

		const totalLessons = await prisma.lesson.count({
			where: {
				courseModule: { courseId },
				isActive: true,
				isPublished: true,
			},
		});

		await prisma.courseProgress.create({
			data: {
				courseId,
				studentId,
				totalModules,
				totalLessons,
				startedAt: new Date(),
			},
		});
	}

	/**
	 * List enrollments with filtering.
	 */
	async list(filter: EnrollmentFilter) {
		const { studentId, courseId, status, page = 1, limit = 10 } = filter;
		const skip = (page - 1) * limit;

		const where: any = {};
		if (studentId) where.studentId = studentId;
		if (courseId) where.courseId = courseId;
		if (status) where.status = status;

		const [data, total] = await Promise.all([
			prisma.enrollment.findMany({
				where,
				include: {
					course: {
						select: {
							id: true,
							title: true,
							slug: true,
							thumbnail: true,
							courseType: true,
						},
					},
					student: {
						include: {
							user: { select: { name: true, email: true, image: true } },
						},
					},
				},
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.enrollment.count({ where }),
		]);

		return { data, total, page, limit };
	}

	/**
	 * Update enrollment status.
	 */
	async updateStatus(id: string, status: ENROLLMENT_STATUS) {
		return prisma.enrollment.update({
			where: { id },
			data: { status },
		});
	}

	/**
	 * Get a single enrollment by composite key.
	 */
	async getByCourseAndStudent(courseId: string, studentId: string) {
		return prisma.enrollment.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
			include: {
				course: true,
				student: { include: { user: true } },
			},
		});
	}

	/**
	 * Get enrollment by ID.
	 */
	async getById(id: string) {
		return prisma.enrollment.findUnique({
			where: { id },
			include: {
				course: true,
				student: { include: { user: true } },
			},
		});
	}

	/**
	 * Check if a student is enrolled in a course.
	 */
	async isEnrolled(courseId: string, studentId: string): Promise<boolean> {
		const enrollment = await prisma.enrollment.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
			select: { id: true, status: true },
		});
		return enrollment?.status === "ACTIVE";
	}

	/**
	 * Cancel enrollment.
	 */
	async cancel(courseId: string, studentId: string) {
		return prisma.enrollment.update({
			where: { courseId_studentId: { courseId, studentId } },
			data: { status: "CANCELLED" },
		});
	}

	/**
	 * Count active enrollments for a course.
	 */
	async countByCourse(courseId: string): Promise<number> {
		return prisma.enrollment.count({
			where: { courseId, status: "ACTIVE" },
		});
	}
}

export const enrollmentService = new EnrollmentService();
