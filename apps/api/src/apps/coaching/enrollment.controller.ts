import {
	createCoachingSubmissionSchema,
	enrollInCoachingCourseSchema,
	gradeSubmissionSchema,
	recordAttendanceSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Enroll in Coaching Course
 * POST /api/coaching/courses/:courseId/enroll
 */
export const enrollInCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const validated = enrollInCoachingCourseSchema.parse(req.body);
		const { installmentSchedule } = validated;

		// Get studentId from authenticated user
		const studentId = req.user?.student?.id;
		if (!studentId) {
			throw new AppError("Student profile not found", 404);
		}

		// Check if course exists and is published
		const course = await prisma.coachingCourse.findUnique({
			where: { id: courseId },
		});

		if (!course) {
			throw new AppError("Course not found", 404);
		}

		if (!course.isPublished) {
			throw new AppError("Course is not published", 403);
		}

		// Check if student already enrolled
		const existingEnrollment = await prisma.coachingEnrollment.findFirst({
			where: {
				courseId,
				studentId,
			},
		});

		if (existingEnrollment) {
			throw new AppError("Already enrolled in this course", 409);
		}

		// Calculate total amount
		const totalAmount = installmentSchedule.reduce(
			(sum, inst) => sum + inst.amount,
			0,
		);

		// Create enrollment with payment plan
		const enrollment = await prisma.coachingEnrollment.create({
			data: {
				courseId,
				studentId,
				status: "ACTIVE",
				paymentPlan: {
					create: {
						totalAmount,
						remainingAmount: totalAmount,
						installments: installmentSchedule,
						totalInstallments: installmentSchedule.length,
						unlockedPercent: 0,
					},
				},
			},
			include: {
				course: {
					select: {
						title: true,
						thumbnail: true,
					},
				},
				paymentPlan: true,
			},
		});

		res.status(201).json({
			success: true,
			data: enrollment,
			message:
				"Enrollment created. Please complete first installment to activate.",
		});
	},
);

/**
 * Get Student's Enrollments
 * GET /api/coaching/enrollments
 */
export const getStudentEnrollments = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId } = req.query;

		if (!studentId) {
			throw new AppError("studentId is required", 400);
		}

		const enrollments = await prisma.coachingEnrollment.findMany({
			where: { studentId: studentId as string },
			include: {
				course: {
					select: {
						id: true,
						title: true,
						thumbnail: true,
						level: true,
						// here is issue
						// instructor: {
						// 	include: {
						// 		user: { select: { name: true, image: true } },
						// 	},
						// },
					},
				},
				paymentPlan: true,
			},
			orderBy: { enrolledAt: "desc" },
		});

		res.json({
			success: true,
			data: enrollments,
		});
	},
);

/**
 * Submit Assignment
 * POST /api/coaching/contents/:contentId/submissions
 */
export const submitAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const { contentId } = req.params;
		const validated = createCoachingSubmissionSchema.parse(req.body);

		// Get studentId from authenticated user
		const studentId = req.user?.student?.id;
		if (!studentId) {
			throw new AppError("Student profile not found", 404);
		}

		const content = await prisma.coachingContent.findUnique({
			where: { id: contentId },
		});

		if (!content || content.contentType !== "ASSIGNMENT") {
			throw new AppError("Invalid assignment content", 400);
		}

		// Check if submission already exists
		const existing = await prisma.coachingSubmission.findFirst({
			where: {
				contentId,
				studentId,
			},
		});

		if (existing) {
			throw new AppError("Assignment already submitted", 409);
		}

		const submission = await prisma.coachingSubmission.create({
			data: {
				contentId,
				studentId,
				textAnswer: validated.textAnswer,
				fileUrls: validated.fileUrls,
			},
		});

		res.status(201).json({
			success: true,
			data: submission,
		});
	},
);

/**
 * Grade Assignment Submission
 * PATCH /api/coaching/submissions/:id/grade
 */
export const gradeSubmission = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = gradeSubmissionSchema.parse(req.body);

		const submission = await prisma.coachingSubmission.update({
			where: { id },
			data: {
				score: validated.score,
				grade: validated.grade,
				feedback: validated.feedback,
				// status: "GRADED",
				gradedAt: new Date(),
			},
		});

		res.json({
			success: true,
			data: submission,
		});
	},
);

/**
 * Get Submissions for Content
 * GET /api/coaching/contents/:contentId/submissions
 */
export const getContentSubmissions = asyncHandler(
	async (req: Request, res: Response) => {
		const { contentId } = req.params;
		const { studentId } = req.query;

		const where: any = { contentId };
		if (studentId) {
			where.studentId = studentId;
		}

		const submissions = await prisma.coachingSubmission.findMany({
			where,
			include: {
				student: {
					include: {
						user: { select: { name: true, image: true } },
					},
				},
			},
			orderBy: { submittedAt: "desc" },
		});

		return res.json({
			success: true,
			data: submissions,
		});
	},
);

/**
 * Record Attendance for Live Session
 * POST /api/coaching/contents/:contentId/attendance
 */
export const recordAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { contentId } = req.params;
		const validated = recordAttendanceSchema.parse(req.body);

		const content = await prisma.coachingContent.findUnique({
			where: { id: contentId },
		});

		if (!content || content.contentType !== "VIDEO_LIVE") {
			throw new AppError("Invalid live session content", 400);
		}

		// Check if attendance already recorded
		const existing = await prisma.coachingAttendance.findFirst({
			where: {
				contentId,
				studentId: validated.studentId,
			},
		});

		if (existing) {
			// Update existing attendance
			const updated = await prisma.coachingAttendance.update({
				where: { id: existing.id },
				data: {
					joinedAt: validated.joinedAt,
					leftAt: validated.leftAt,
					isPresent: validated.isPresent,
				},
			});

			return res.json({
				success: true,
				data: updated,
			});
		}

		// Create new attendance record
		const attendance = await prisma.coachingAttendance.create({
			data: {
				contentId,
				studentId: validated.studentId,
				joinedAt: validated.joinedAt,
				leftAt: validated.leftAt,
				isPresent: validated.isPresent,
			},
		});

		return res.status(201).json({
			success: true,
			data: attendance,
		});
	},
);

/**
 * Get Attendance for Content
 * GET /api/coaching/contents/:contentId/attendance
 */
export const getContentAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { contentId } = req.params;

		const attendance = await prisma.coachingAttendance.findMany({
			where: { contentId },
			include: {
				student: {
					include: {
						user: { select: { name: true, image: true } },
					},
				},
			},
		});

		return res.json({
			success: true,
			data: attendance,
		});
	},
);
