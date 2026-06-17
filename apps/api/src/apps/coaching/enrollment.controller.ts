import {
	createCoachingSubmissionSchema,
	gradeSubmissionSchema,
	recordAttendanceSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";



export const getMyEnrollments = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = req.user?.student?.id;

		if (!studentId) {
			throw new AppError("Student profile not found", 404);
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

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingSubmission",
			entityId: submission.id,
			description: `Assignment submitted for content: ${content.title}`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: submission,
		});
	},
);





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

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingSubmission",
			entityId: id,
			description: `Assignment graded: Score ${validated.score}/100, Grade: ${validated.grade}`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			data: submission,
		});
	},
);





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

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingAttendance",
			entityId: attendance.id,
			description: `Attendance recorded for live session: ${content.title} - ${validated.isPresent ? "Present" : "Absent"}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: attendance,
		});
	},
);




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
