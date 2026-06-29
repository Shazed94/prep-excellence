import type { POINT_SOURCE } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";

export interface AddPointsInput {
	studentId: string;
	courseId?: string;
	source: POINT_SOURCE;
	points: number;
	description?: string;
	referenceId?: string;
	referenceType?: string;
}

export interface PointBalance {
	totalPoints: number;
	pointsBySource: Record<string, number>;
}

class PointService {
	/**
	 * Add points to a student's account.
	 */
	async addPoints(input: AddPointsInput) {
		const transaction = await prisma.pointTransaction.create({
			data: {
				points: input.points,
				source: input.source as any,
				description: input.description,
				referenceId: input.referenceId,
				referenceType: input.referenceType,
				studentId: input.studentId,
				courseId: input.courseId,
			},
		});

		return transaction;
	}

	/**
	 * Get point balance for a student.
	 */
	async getBalance(studentId: string): Promise<PointBalance> {
		const transactions = await prisma.pointTransaction.findMany({
			where: { studentId },
		});

		const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);

		const pointsBySource: Record<string, number> = {};
		for (const t of transactions) {
			const key = t.source;
			pointsBySource[key] = (pointsBySource[key] || 0) + t.points;
		}

		return { totalPoints, pointsBySource };
	}

	/**
	 * Get point transactions for a student.
	 */
	async getTransactions(
		studentId: string,
		options?: {
			source?: POINT_SOURCE;
			courseId?: string;
			limit?: number;
			page?: number;
		},
	) {
		const { source, courseId, limit = 20, page = 1 } = options || {};
		const skip = (page - 1) * limit;

		const where: any = { studentId };
		if (source) where.source = source;
		if (courseId) where.courseId = courseId;

		const [data, total] = await Promise.all([
			prisma.pointTransaction.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.pointTransaction.count({ where }),
		]);

		return { data, total, page, limit };
	}

	/**
	 * Award points for completing a lesson.
	 */
	async awardLessonPoints(
		studentId: string,
		courseId: string,
		lessonId: string,
	) {
		return this.addPoints({
			studentId,
			courseId,
			source: "COURSE_COMPLETION" as any,
			points: 10,
			description: "Lesson completed",
			referenceId: lessonId,
			referenceType: "lesson",
		});
	}

	/**
	 * Award points for completing a course.
	 */
	async awardCourseCompletionPoints(studentId: string, courseId: string) {
		return this.addPoints({
			studentId,
			courseId,
			source: "COURSE_COMPLETION" as any,
			points: 100,
			description: "Course completed",
			referenceId: courseId,
			referenceType: "course",
		});
	}

	/**
	 * Award points for exam performance.
	 */
	async awardExamPoints(
		studentId: string,
		courseId: string,
		examId: string,
		score: number,
	) {
		// Award points based on score percentage
		const points = Math.max(0, Math.floor(score / 10)); // 0-10 points based on score
		return this.addPoints({
			studentId,
			courseId,
			source: "EXAM" as any,
			points,
			description: `Exam score: ${score}%`,
			referenceId: examId,
			referenceType: "exam",
		});
	}

	/**
	 * Award points for assignment submission.
	 */
	async awardAssignmentPoints(
		studentId: string,
		courseId: string,
		assignmentId: string,
		score: number,
	) {
		const points = Math.max(0, Math.floor(score / 10));
		return this.addPoints({
			studentId,
			courseId,
			source: "ASSIGNMENT" as any,
			points,
			description: `Assignment score: ${score}%`,
			referenceId: assignmentId,
			referenceType: "assignment",
		});
	}

	/**
	 * Award points for attendance.
	 */
	async awardAttendancePoints(
		studentId: string,
		courseId: string,
		scheduledClassId: string,
	) {
		return this.addPoints({
			studentId,
			courseId,
			source: "ATTENDANCE" as any,
			points: 5,
			description: "Class attendance",
			referenceId: scheduledClassId,
			referenceType: "scheduled_class",
		});
	}
}

export const pointService = new PointService();
