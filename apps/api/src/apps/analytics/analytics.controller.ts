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

/**
 * GET /teacher/students
 * Distinct students enrolled across the authenticated teacher's LMS + coaching
 * courses, each with the list of courses they're enrolled in.
 */
export const teacherStudents = asyncHandler(
	async (req: Request, res: Response) => {
		const teacherId = req.user?.teacher?.id;
		if (!teacherId) throw new AppError("Teacher profile not found", 404);

		const enrollments = await prisma.enrollment.findMany({
			where: { course: { teacherId } },
			include: {
				student: {
					include: {
						user: {
							select: { id: true, name: true, email: true, image: true },
						},
					},
				},
				course: { select: { id: true, title: true, courseType: true } },
			},
			orderBy: { createdAt: "desc" },
		});

		type StudentRow = {
			id: string;
			name: string;
			email: string;
			image: string | null;
			courses: {
				id: string;
				title: string;
				type: string;
				status: string;
			}[];
		};

		const byStudent = new Map<string, StudentRow>();
		for (const e of enrollments) {
			const s = e.student;
			if (!s) continue;
			if (!byStudent.has(s.id)) {
				byStudent.set(s.id, {
					id: s.id,
					name: s.user?.name ?? "Student",
					email: s.user?.email ?? "",
					image: s.user?.image ?? null,
					courses: [],
				});
			}
			byStudent.get(s.id)?.courses.push({
				id: e.course.id,
				title: e.course.title,
				type: e.course.courseType,
				status: e.status,
			});
		}

		const data = Array.from(byStudent.values()).map((s) => ({
			...s,
			courseCount: s.courses.length,
		}));

		return res.json({ success: true, data });
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
