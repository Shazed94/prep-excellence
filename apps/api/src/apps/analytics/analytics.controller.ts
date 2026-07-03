import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Dashboard summary endpoints.
 *
 * These replace the client-side stat computation the overview pages currently
 * do across several requests. Additive — the frontend can adopt them to reduce
 * load. All counts are scoped to the authenticated teacher/student.
 */

/** GET /teacher/analytics/summary */
export const teacherSummary = asyncHandler(
	async (req: Request, res: Response) => {
		const teacherId = req.user?.teacher?.id;
		if (!teacherId) throw new AppError("Teacher profile not found", 404);

		const sessionScope = {
			teacherAvailability: { profile: { teacherId } },
		} as const;

		const [
			lmsCourseCount,
			coachingCourseCount,
			upcomingSessions,
			completedSessions,
			profile,
		] = await Promise.all([
			prisma.course.count({ where: { courseType: "LMS", teacherId } }),
			prisma.course.count({ where: { courseType: "COACHING", teacherId } }),
			prisma.oneToOneSession.count({
				where: {
					...sessionScope,
					status: { in: ["SCHEDULED", "IN_PROGRESS"] },
				},
			}),
			prisma.oneToOneSession.count({
				where: { ...sessionScope, status: "COMPLETED" },
			}),
			prisma.teacherProfile.findUnique({
				where: { teacherId },
				select: { rating: true, totalReviews: true },
			}),
		]);

		return res.json({
			success: true,
			data: {
				lmsCourseCount,
				coachingCourseCount,
				upcomingSessions,
				completedSessions,
				avgRating: profile?.rating ?? 0,
				totalReviews: profile?.totalReviews ?? 0,
			},
		});
	},
);

/** GET /student/analytics/summary */
export const studentSummary = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = req.user?.student?.id;
		if (!studentId) throw new AppError("Student profile not found", 404);

		const [
			activeLmsEnrollments,
			activeCoachingEnrollments,
			upcomingSessions,
			completedSessions,
			attempts,
		] = await Promise.all([
			prisma.enrollment.count({
				where: { studentId, status: "ACTIVE", course: { courseType: "LMS" } },
			}),
			prisma.enrollment.count({
				where: {
					studentId,
					status: "ACTIVE",
					course: { courseType: "COACHING" },
				},
			}),
			prisma.oneToOneSession.count({
				where: { studentId, status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
			}),
			prisma.oneToOneSession.count({
				where: { studentId, status: "COMPLETED" },
			}),
			prisma.studentSATAttempt.findMany({
				where: { studentId, status: "COMPLETED" },
				select: { totalScore: true },
			}),
		]);

		const satAttempts = attempts.length;
		const avgSatScore = satAttempts
			? Math.round(
					attempts.reduce((sum, a) => sum + (a.totalScore ?? 0), 0) /
						satAttempts,
				)
			: 0;

		return res.json({
			success: true,
			data: {
				activeLmsEnrollments,
				activeCoachingEnrollments,
				upcomingSessions,
				completedSessions,
				satAttempts,
				avgSatScore,
			},
		});
	},
);
