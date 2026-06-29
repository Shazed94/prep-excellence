import type { POINT_SOURCE } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";

class LeaderboardService {
	/**
	 * Get or create a leaderboard for a course.
	 */
	async getOrCreateCourseLeaderboard(courseId: string) {
		let leaderboard = await prisma.leaderboard.findUnique({
			where: {
				type_courseId: {
					type: "COURSE_WISE" as any,
					courseId,
				},
			},
		});

		if (!leaderboard) {
			const course = await prisma.course.findUnique({
				where: { id: courseId },
				select: { title: true },
			});

			leaderboard = await prisma.leaderboard.create({
				data: {
					type: "COURSE_WISE" as any,
					name: `${course?.title || "Course"} Leaderboard`,
					courseId,
				},
			});
		}

		return leaderboard;
	}

	/**
	 * Get the global leaderboard.
	 */
	async getOrCreateGlobalLeaderboard() {
		let leaderboard = await prisma.leaderboard.findUnique({
			where: {
				type_courseId: {
					type: "GLOBAL" as any,
					courseId: null as any,
				},
			},
		});

		if (!leaderboard) {
			leaderboard = await prisma.leaderboard.create({
				data: {
					type: "GLOBAL" as any,
					name: "Global Leaderboard",
					courseId: null,
				},
			});
		}

		return leaderboard;
	}

	/**
	 * Update or create an entry for a student on a leaderboard.
	 */
	async upsertEntry(
		leaderboardId: string,
		studentId: string,
		points: {
			quizScore?: number;
			examScore?: number;
			assignmentScore?: number;
			attendancePoints?: number;
			bonusPoints?: number;
		},
	) {
		const totalPoints =
			(points.quizScore || 0) +
			(points.examScore || 0) +
			(points.assignmentScore || 0) +
			(points.attendancePoints || 0) +
			(points.bonusPoints || 0);

		// Get existing entry
		const existing = await prisma.leaderboardEntry.findUnique({
			where: {
				leaderboardId_studentId: { leaderboardId, studentId },
			},
		});

		let entry: object;
		if (existing) {
			entry = await prisma.leaderboardEntry.update({
				where: { id: existing.id },
				data: {
					totalPoints,
					quizScore: existing.quizScore + (points.quizScore || 0),
					examScore: existing.examScore + (points.examScore || 0),
					assignmentScore:
						existing.assignmentScore + (points.assignmentScore || 0),
					attendancePoints:
						existing.attendancePoints + (points.attendancePoints || 0),
					bonusPoints: existing.bonusPoints + (points.bonusPoints || 0),
				},
			});
		} else {
			entry = await prisma.leaderboardEntry.create({
				data: {
					leaderboardId,
					studentId,
					totalPoints,
					...points,
				},
			});
		}

		// Recalculate ranks for this leaderboard
		await this.recalculateRanks(leaderboardId);

		return entry;
	}

	/**
	 * Recalculate ranks for a leaderboard.
	 */
	async recalculateRanks(leaderboardId: string) {
		const entries = await prisma.leaderboardEntry.findMany({
			where: { leaderboardId },
			orderBy: { totalPoints: "desc" },
		});

		const updates = entries.map((entry, index) =>
			prisma.leaderboardEntry.update({
				where: { id: entry.id },
				data: { rank: index + 1 },
			}),
		);

		await prisma.$transaction(updates);
	}

	/**
	 * Get leaderboard with entries.
	 */
	async getLeaderboard(leaderboardId: string, limit: number = 50) {
		return prisma.leaderboard.findUnique({
			where: { id: leaderboardId },
			include: {
				entries: {
					orderBy: { rank: "asc" },
					take: limit,
					include: {
						student: {
							include: {
								user: { select: { name: true, email: true, image: true } },
							},
						},
					},
				},
			},
		});
	}

	/**
	 * Get course leaderboard.
	 */
	async getCourseLeaderboard(courseId: string, limit: number = 50) {
		const leaderboard = await this.getOrCreateCourseLeaderboard(courseId);
		return this.getLeaderboard(leaderboard.id, limit);
	}

	/**
	 * Get student rank in a course leaderboard.
	 */
	async getStudentRank(courseId: string, studentId: string) {
		const leaderboard = await this.getOrCreateCourseLeaderboard(courseId);
		const entry = await prisma.leaderboardEntry.findUnique({
			where: {
				leaderboardId_studentId: {
					leaderboardId: leaderboard.id,
					studentId,
				},
			},
		});

		if (!entry) return null;

		return { rank: entry.rank, totalPoints: entry.totalPoints };
	}

	/**
	 * Add points to a student's leaderboard entry from a specific source.
	 */
	async addPointsFromSource(input: {
		courseId: string;
		studentId: string;
		source: POINT_SOURCE;
		points: number;
		description?: string;
		referenceId?: string;
		referenceType?: string;
	}) {
		const {
			courseId,
			studentId,
			source,
			points,
			description,
			referenceId,
			referenceType,
		} = input;

		// Create point transaction
		await prisma.pointTransaction.create({
			data: {
				points,
				source: source as any,
				description,
				referenceId,
				referenceType,
				studentId,
				courseId,
			},
		});

		// Update leaderboard entry
		const leaderboard = await this.getOrCreateCourseLeaderboard(courseId);
		const pointField = this.getPointFieldForSource(source);

		await this.upsertEntry(leaderboard.id, studentId, {
			[pointField]: points,
		});

		// Also update global leaderboard
		const globalLeaderboard = await this.getOrCreateGlobalLeaderboard();
		await this.upsertEntry(globalLeaderboard.id, studentId, {
			[pointField]: points,
		});
	}

	private getPointFieldForSource(
		source: POINT_SOURCE,
	):
		| "quizScore"
		| "examScore"
		| "assignmentScore"
		| "attendancePoints"
		| "bonusPoints" {
		switch (source) {
			case "QUIZ":
				return "quizScore";
			case "EXAM":
				return "examScore";
			case "ASSIGNMENT":
				return "assignmentScore";
			case "ATTENDANCE":
				return "attendancePoints";
			case "COURSE_COMPLETION":
			case "BONUS":
				return "bonusPoints";
			default:
				return "bonusPoints";
		}
	}
}

export const leaderboardService = new LeaderboardService();
