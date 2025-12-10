import { randomBytes } from "node:crypto";
import {
	bookSessionSchema,
	cancelSessionSchema,
	createOneToOneReviewSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Book One-to-One Session
 * POST /api/onetoone/sessions/book
 */
export const bookSession = asyncHandler(async (req: Request, res: Response) => {
	const validated = bookSessionSchema.parse(req.body);
	const { teacherProfileId, scheduledAt, duration, topic, notes, timezone } =
		validated;

	// Get studentId from authenticated user
	const studentId = req.user?.student?.id;
	if (!studentId) {
		throw new AppError("Student profile not found", 404);
	}

	// Check teacher profile
	const teacherProfile = await prisma.teacherProfile.findUnique({
		where: { id: teacherProfileId },
	});

	if (!teacherProfile || !teacherProfile.isActive) {
		throw new AppError("Teacher not available", 404);
	}

	const sessionDate = new Date(scheduledAt);

	// Check for conflicting sessions
	const conflict = await prisma.oneToOneSession.findFirst({
		where: {
			teacherProfileId,
			scheduledAt: {
				gte: sessionDate,
				lt: new Date(sessionDate.getTime() + duration * 60000),
			},
			status: { in: ["SCHEDULED", "IN_PROGRESS"] },
		},
	});

	if (conflict) {
		throw new AppError("Time slot is already booked", 409);
	}

	// Generate Jitsi room details
	const jitsiRoomId = `onetoone_${randomBytes(16).toString("hex")}`;
	const jitsiRoomToken = randomBytes(32).toString("hex"); // In production, use proper JWT

	// Calculate amount based on duration (convert Decimal to number for arithmetic)
	const hourlyRate = teacherProfile.hourlyRate.toNumber();
	const amount = (hourlyRate / 60) * duration;

	// Create session (payment handled separately)
	const session = await prisma.oneToOneSession.create({
		data: {
			teacherProfileId,
			studentId,
			scheduledAt: sessionDate,
			duration,
			topic,
			notes,
			timezone,
			jitsiRoomId,
			jitsiRoomToken,
			status: "SCHEDULED",
		},
		include: {
			teacherProfile: {
				include: {
					teacher: {
						include: {
							user: { select: { name: true, image: true } },
						},
					},
				},
			},
			student: {
				include: {
					user: { select: { name: true, image: true } },
				},
			},
		},
	});

	res.status(201).json({
		success: true,
		data: session,
		amount,
		message: "Session booked successfully.",
	});
});

/**
 * Get Student's Sessions
 * GET /api/onetoone/sessions
 */
export const getStudentSessions = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId, status } = req.query;

		if (!studentId) {
			throw new AppError("studentId is required", 400);
		}

		const where: any = { studentId: studentId as string };
		if (status) {
			where.status = status;
		}

		const sessions = await prisma.oneToOneSession.findMany({
			where,
			include: {
				teacher: {
					include: {
						user: { select: { name: true, image: true } },
					},
				},
				recording: true,
			},
			orderBy: { scheduledAt: "desc" },
		});

		res.json({
			success: true,
			data: sessions,
		});
	},
);

/**
 * Get Teacher's Sessions
 * GET /api/onetoone/teachers/:teacherId/sessions
 */
export const getTeacherSessions = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;
		const { status } = req.query;

		const where: any = { teacherId };
		if (status) {
			where.status = status;
		}

		const sessions = await prisma.oneToOneSession.findMany({
			where,
			include: {
				student: {
					include: {
						user: { select: { name: true, image: true } },
					},
				},
				recording: true,
			},
			orderBy: { scheduledAt: "desc" },
		});

		res.json({
			success: true,
			data: sessions,
		});
	},
);

/**
 * Get Session Details
 * GET /api/onetoone/sessions/:id
 */
export const getSession = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const session = await prisma.oneToOneSession.findUnique({
		where: { id },
		include: {
			teacher: {
				include: {
					user: { select: { name: true, image: true } },
				},
			},
			student: {
				include: {
					user: { select: { name: true, image: true } },
				},
			},
			recording: true,
			payment: true,
		},
	});

	if (!session) {
		throw new AppError("Session not found", 404);
	}

	res.json({
		success: true,
		data: session,
	});
});

/**
 * Start Session
 * POST /api/onetoone/sessions/:id/start
 */
export const startSession = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const session = await prisma.oneToOneSession.findUnique({
			where: { id },
		});

		if (!session) {
			throw new AppError("Session not found", 404);
		}

		if (session.status !== "SCHEDULED") {
			throw new AppError("Session cannot be started", 400);
		}

		const updatedSession = await prisma.oneToOneSession.update({
			where: { id },
			data: {
				status: "IN_PROGRESS",
				actualStartTime: new Date(),
			},
		});

		res.json({
			success: true,
			data: {
				...updatedSession,
				jitsiRoomId: updatedSession.jitsiRoomId,
				jitsiRoomToken: updatedSession.jitsiRoomToken,
			},
		});
	},
);

/**
 * End Session
 * POST /api/onetoone/sessions/:id/end
 */
export const endSession = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const session = await prisma.oneToOneSession.findUnique({
		where: { id },
	});

	if (!session) {
		throw new AppError("Session not found", 404);
	}

	if (session.status !== "IN_PROGRESS") {
		throw new AppError("Session is not in progress", 400);
	}

	const updatedSession = await prisma.oneToOneSession.update({
		where: { id },
		data: {
			status: "COMPLETED",
			actualEndTime: new Date(),
		},
	});

	res.json({
		success: true,
		data: updatedSession,
	});
});

/**
 * Cancel Session
 * POST /api/onetoone/sessions/:id/cancel
 */
export const cancelSession = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { cancellationReason } = cancelSessionSchema.parse(req.body);

		const session = await prisma.oneToOneSession.findUnique({
			where: { id },
		});

		if (!session) {
			throw new AppError("Session not found", 404);
		}

		if (!["SCHEDULED"].includes(session.status)) {
			throw new AppError("Session cannot be cancelled", 400);
		}

		const updatedSession = await prisma.oneToOneSession.update({
			where: { id },
			data: {
				status: "CANCELLED",
				cancelledAt: new Date(),
				cancellationReason,
				cancelledById: req.user?.id,
			},
		});

		res.json({
			success: true,
			data: updatedSession,
			message: "Session cancelled successfully",
		});
	},
);

/**
 * Create Session Review
 * POST /api/onetoone/sessions/:sessionId/reviews
 */
export const createReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { sessionId } = req.params;
		const validated = createOneToOneReviewSchema.parse(req.body);

		// Get studentId from authenticated user
		const studentId = req.user?.student?.id;
		if (!studentId) {
			throw new AppError("Student profile not found", 404);
		}

		// Check if session exists and is completed
		const session = await prisma.oneToOneSession.findUnique({
			where: { id: sessionId },
		});

		if (!session) {
			throw new AppError("Session not found", 404);
		}

		if (session.status !== "COMPLETED") {
			throw new AppError("Can only review completed sessions", 400);
		}

		// Check if review already exists
		const existing = await prisma.oneToOneReview.findFirst({
			where: {
				sessionId,
				studentId,
			},
		});

		if (existing) {
			throw new AppError("Session already reviewed", 409);
		}

		const review = await prisma.oneToOneReview.create({
			data: {
				sessionId,
				studentId,
				teacherProfileId: session.teacherProfileId,
				rating: validated.rating,
				comment: validated.comment,
				isPublic: validated.isPublic,
			},
			include: {
				student: {
					include: {
						user: { select: { name: true, image: true } },
					},
				},
			},
		});

		// Update teacher's average rating
		const stats = await prisma.oneToOneReview.aggregate({
			where: { teacherProfileId: session.teacherProfileId },
			_avg: { rating: true },
			_count: { rating: true },
		});

		await prisma.teacherProfile.update({
			where: { id: session.teacherProfileId },
			data: {
				rating: stats._avg.rating || null,
				totalReviews: stats._count.rating || 0,
			},
		});

		res.status(201).json({
			success: true,
			data: review,
		});
	},
);

/**
 * Get Teacher Reviews
 * GET /api/onetoone/teachers/:teacherProfileId/reviews
 */
export const getTeacherReviews = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherProfileId } = req.params;
		const { page = 1, limit = 20 } = req.query;

		const [reviews, total] = await Promise.all([
			prisma.oneToOneReview.findMany({
				where: { teacherProfileId },
				include: {
					student: {
						include: {
							user: { select: { name: true, image: true } },
						},
					},
					session: {
						select: { topic: true, scheduledAt: true },
					},
				},
				skip: (Number(page) - 1) * Number(limit),
				take: Number(limit),
				orderBy: { createdAt: "desc" },
			}),
			prisma.oneToOneReview.count({ where: { teacherProfileId } }),
		]);

		res.json({
			success: true,
			data: reviews,
			pagination: {
				page: Number(page),
				limit: Number(limit),
				total,
				totalPages: Math.ceil(total / Number(limit)),
			},
		});
	},
);
