import prisma from "@/infrastructure/database/connection";

export interface UpdateLessonProgressInput {
	lessonId: string;
	studentId: string;
	watchTimeSeconds?: number;
	lastPosition?: number;
	completionPercent?: number;
	isCompleted?: boolean;
	liveClassWatched?: boolean;
	liveClassWatchTime?: number;
	examCompleted?: boolean;
	examScore?: number;
	examPassed?: boolean;
	assignmentCompleted?: boolean;
	assignmentScore?: number;
	assignmentPassed?: boolean;
}

export interface LessonProgressResponse {
	lessonProgress: any;
	courseProgress: any;
}

class ProgressService {
	/**
	 * Update lesson progress for a student.
	 * Also recalculates and updates the parent CourseProgress.
	 */
	async updateLessonProgress(
		input: UpdateLessonProgressInput,
	): Promise<LessonProgressResponse> {
		const { lessonId, studentId, ...progressData } = input;

		// Get the lesson to find its module and course
		const lesson = await prisma.lesson.findUnique({
			where: { id: lessonId },
			include: {
				courseModule: {
					include: { course: true },
				},
			},
		});

		if (!lesson) {
			throw new Error("Lesson not found");
		}

		const courseId = lesson.courseModule.courseId;

		// Find or create lesson progress
		const lessonProgress = await prisma.lessonProgress.upsert({
			where: {
				lessonId_studentId: { lessonId, studentId },
			},
			create: {
				lessonId,
				studentId,
				courseProgressId: undefined, // Will link below
				...progressData,
				completedAt: progressData.isCompleted ? new Date() : undefined,
			},
			update: {
				...progressData,
				completedAt: progressData.isCompleted ? new Date() : undefined,
			},
		});

		// Link to course progress
		const courseProgress = await this.recalculateCourseProgress(
			courseId,
			studentId,
		);

		// Link lesson progress to course progress if not already
		if (!lessonProgress.courseProgressId) {
			await prisma.lessonProgress.update({
				where: { id: lessonProgress.id },
				data: { courseProgressId: courseProgress.id },
			});
		}

		// Update last activity in course progress
		await prisma.courseProgress.update({
			where: { id: courseProgress.id },
			data: {
				lastActivityAt: new Date(),
				lastLessonId: lessonId,
			},
		});

		return {
			lessonProgress,
			courseProgress,
		};
	}

	/**
	 * Recalculate aggregate CourseProgress from all LessonProgress records.
	 */
	async recalculateCourseProgress(courseId: string, studentId: string) {
		// Get the course progress record
		let courseProgress = await prisma.courseProgress.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
			include: {
				lessonProgresses: true,
			},
		});

		if (!courseProgress) {
			// Create if not exists
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

			courseProgress = await prisma.courseProgress.create({
				data: {
					courseId,
					studentId,
					totalModules,
					totalLessons,
					startedAt: new Date(),
				},
				include: { lessonProgresses: true },
			});
		}

		// Get all lesson progresses for this student in this course
		const lessonProgresses = await prisma.lessonProgress.findMany({
			where: {
				studentId,
				lesson: {
					courseModule: { courseId },
				},
			},
		});

		// Get all lessons and modules for the course
		const courseModules = await prisma.courseModule.findMany({
			where: { courseId, isActive: true },
			include: {
				lessons: {
					where: { isActive: true, isPublished: true },
					select: { id: true },
				},
			},
			orderBy: { orderIndex: "asc" },
		});

		const totalLessons = courseModules.reduce(
			(sum, m) => sum + m.lessons.length,
			0,
		);
		const totalModules = courseModules.length;

		// Calculate completed counts
		const completedLessonIds = new Set(
			lessonProgresses.filter((lp) => lp.isCompleted).map((lp) => lp.lessonId),
		);

		const completedLessons = completedLessonIds.size;

		// A module is completed when all its lessons are completed
		const completedModules = courseModules.filter((m) =>
			m.lessons.every((l) => completedLessonIds.has(l.id)),
		).length;

		// Calculate progress percentage
		const progressPercent =
			totalLessons > 0
				? Math.round((completedLessons / totalLessons) * 100)
				: 0;

		// Aggregate time tracking
		const totalWatchTimeSeconds = lessonProgresses.reduce(
			(sum, lp) => sum + (lp.watchTimeSeconds || 0),
			0,
		);
		const totalLiveClassWatchTime = lessonProgresses.reduce(
			(sum, lp) => sum + (lp.liveClassWatchTime || 0),
			0,
		);

		// Aggregate scores
		const examScores = lessonProgresses
			.filter((lp) => lp.examScore != null)
			.map((lp) => lp.examScore!);
		const assignmentScores = lessonProgresses
			.filter((lp) => lp.assignmentScore != null)
			.map((lp) => lp.assignmentScore!);

		const averageExamScore =
			examScores.length > 0
				? Math.round(
						examScores.reduce((sum, s) => sum + s, 0) / examScores.length,
					)
				: 0;

		const averageAssignmentScore =
			assignmentScores.length > 0
				? Math.round(
						assignmentScores.reduce((sum, s) => sum + s, 0) /
							assignmentScores.length,
					)
				: 0;

		const isCompleted = progressPercent >= 100;

		// Update course progress
		const updated = await prisma.courseProgress.update({
			where: { id: courseProgress.id },
			data: {
				progressPercent,
				completedLessons,
				totalLessons,
				completedModules,
				totalModules,
				totalWatchTimeSeconds,
				totalLiveClassWatchTime,
				averageExamScore,
				averageAssignmentScore,
				isCompleted,
				completedAt:
					isCompleted && !courseProgress.completedAt ? new Date() : undefined,
				lastActivityAt: new Date(),
			},
		});

		return updated;
	}

	/**
	 * Get course progress for a student.
	 */
	async getCourseProgress(courseId: string, studentId: string) {
		const courseProgress = await prisma.courseProgress.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
			include: {
				lessonProgresses: {
					include: {
						lesson: {
							select: {
								id: true,
								title: true,
								orderIndex: true,
								lessonType: true,
							},
						},
					},
					orderBy: { updatedAt: "desc" },
				},
			},
		});

		if (!courseProgress) {
			return null;
		}

		return courseProgress;
	}

	/**
	 * Get lesson progress for a student.
	 */
	async getLessonProgress(lessonId: string, studentId: string) {
		return prisma.lessonProgress.findUnique({
			where: { lessonId_studentId: { lessonId, studentId } },
		});
	}

	/**
	 * Get all lesson progresses for a course for a student.
	 */
	async getLessonProgressesForCourse(courseId: string, studentId: string) {
		return prisma.lessonProgress.findMany({
			where: {
				studentId,
				lesson: {
					courseModule: { courseId },
				},
			},
			include: {
				lesson: {
					select: {
						id: true,
						title: true,
						orderIndex: true,
						lessonType: true,
					},
				},
			},
			orderBy: {
				lesson: { orderIndex: "asc" },
			},
		});
	}
}

export const progressService = new ProgressService();
