import { randomBytes } from "node:crypto";
import {
	bookSessionSchema,
	cancelSessionSchema,
	createOneToOneReviewSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/client";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import queueService from "@/infrastructure/queue/queue";
import { JOB_TYPES, QUEUE_NAMES } from "@/lib/queue-processors";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildFiltersWithSearch } from "@/utils/typeSafeFilters";

/**
 * Book One-to-One Session
 * POST /api/onetoone/sessions/book
 *
 * Flow:
 * 1. Student selects a teacher availability slot
 * 2. System fetches the slot details (date, time, duration)
 * 3. Validates payment information
 * 4. Creates Payment record (initially PENDING)
 * 5. Creates OneToOneSession with status SCHEDULED
 * 6. Returns session details with payment info
 */
export const bookSession = asyncHandler(async (req: Request, res: Response) => {
	const validated = bookSessionSchema.parse(req.body);
	const { teacherAvailabilityId, topic, notes } = validated;

	// Get studentId from authenticated user
	const studentId = req.user?.student?.id;
	if (!studentId) {
		throw new AppError("Student profile not found", 404);
	}

	// Fetch teacher availability slot
	const availabilitySlot = await prisma.teacherAvailability.findUnique({
		where: { id: teacherAvailabilityId },
		include: {
			profile: {
				include: {
					teacher: {
						include: {
							user: { select: { name: true, image: true } },
						},
					},
				},
			},
		},
	});

	if (!availabilitySlot) {
		throw new AppError("Availability slot not found", 404);
	}

	if (!availabilitySlot.isActive) {
		throw new AppError("This availability slot is no longer active", 400);
	}

	if (availabilitySlot.isBooked) {
		throw new AppError("This time slot is already booked", 409);
	}

	const teacherProfile = availabilitySlot.profile;

	if (!teacherProfile || !teacherProfile.isActive) {
		throw new AppError("Teacher is not available", 404);
	}

	// Determine session scheduling based on availability type
	let scheduledAt: Date;
	let duration: number;
	let timezone: string;

	if (availabilitySlot.availabilityType === "ONE_TIME_SLOT") {
		if (
			!availabilitySlot.specificStartTime ||
			!availabilitySlot.specificEndTime
		) {
			throw new AppError("Invalid availability slot configuration", 400);
		}
		scheduledAt = new Date(availabilitySlot.specificStartTime);
		const durationMs =
			new Date(availabilitySlot.specificEndTime).getTime() -
			new Date(availabilitySlot.specificStartTime).getTime();
		duration = Math.floor(durationMs / (1000 * 60)); // Convert to minutes
		timezone = teacherProfile.timezone;
	} else if (availabilitySlot.availabilityType === "RECURRING_WEEKLY") {
		// For recurring slots, use the next occurrence
		if (!availabilitySlot.startTime || !availabilitySlot.endTime) {
			throw new AppError("Invalid recurring availability configuration", 400);
		}

		// Parse times
		const [startHour, startMin] = availabilitySlot.startTime
			.split(":")
			.map(Number);
		const [endHour, endMin] = availabilitySlot.endTime.split(":").map(Number);

		// Calculate next occurrence
		const today = new Date();
		const dayOfWeekIndex = [
			"SUNDAY",
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY",
		].indexOf(availabilitySlot.dayOfWeek || "MONDAY");

		const daysUntilNext = (dayOfWeekIndex - today.getDay() + 7) % 7 || 7;
		scheduledAt = new Date(today);
		scheduledAt.setDate(scheduledAt.getDate() + daysUntilNext);
		scheduledAt.setHours(startHour, startMin, 0, 0);

		duration = endHour * 60 + endMin - (startHour * 60 + startMin);
		timezone = teacherProfile.timezone;
	} else {
		throw new AppError("Invalid availability type", 400);
	}

	// Check for conflicting sessions with the slot
	const conflict = await prisma.oneToOneSession.findFirst({
		where: {
			teacherAvailabilityId,
			status: { in: ["SCHEDULED", "IN_PROGRESS"] },
		},
	});

	if (conflict) {
		throw new AppError("This slot has already been booked", 409);
	}

	// Calculate payment amount based on duration and hourly rate
	//   const hourlyRate = teacherProfile.hourlyRate.toNumber();
	//   const amount = (hourlyRate / 60) * duration;

	// Generate Jitsi room details
	const jitsiRoomId = `onetoone_${randomBytes(16).toString("hex")}`;
	const jitsiRoomToken = randomBytes(32).toString("hex");

	// Create transaction: Payment + Session + Mark slot as booked
	const result = await prisma.$transaction(async (tx) => {
		// 1. Create OneToOneSession
		const session = await tx.oneToOneSession.create({
			data: {
				teacherAvailabilityId,
				studentId,
				scheduledAt,
				duration,
				topic,
				notes,
				timezone,
				jitsiRoomId,
				jitsiRoomToken,
				status: "SCHEDULED",
			},
			include: {
				teacherAvailability: {
					include: {
						profile: {
							include: {
								teacher: {
									include: {
										user: { select: { name: true, image: true } },
									},
								},
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

		// // 2. Create Payment record (PENDING status) linked to session
		// const payment = await tx.payment.create({
		//   data: {
		//     amount: amount.toString(), // Decimal accepts string
		//     currency: "USD",
		//     status: "PENDING",
		//     paymentType: "PER_SESSION",
		//     provider: paymentProvider,
		//     paymentMethod,
		// 	userId: req.user?.id,
		// 	orderId: 'rwerdf23432erwdfasdf',
		//     oneToOneSessionId: session.id,
		//   },
		// });

		// 3. Mark availability slot as booked
		await tx.teacherAvailability.update({
			where: { id: teacherAvailabilityId },
			data: { isBooked: true },
		});

		return { session };
	});

	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "OneToOneSession",
		entityId: result.session.id,
		description: `One-to-one session booked with teacher)`,
		performedById: req.user?.id,
	});

	res.status(201).json({
		success: true,
		data: result.session,
		// payment: {
		//   id: result.payment.id,
		//   amount: result.payment.amount,
		//   currency: result.payment.currency,
		//   status: result.payment.status,
		//   paymentMethod: result.payment.paymentMethod,
		// },
		message: "Session booked successfully. Proceed to payment.",
	});
});

/**
 * Get Student's Sessions
 * GET /api/onetoone/sessions
 */
export const getStudentSessions = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const studentId = filters?.studentId;

		if (!studentId) {
			throw new AppError("studentId filter is required", 400);
		}

		const skip = (page - 1) * limit;

		const cacheKey = `student-sessions:${studentId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Sessions fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.OneToOneSessionWhereInput> = [
			"status",
			"studentId",
		];
		const where = buildFiltersWithSearch<Prisma.OneToOneSessionWhereInput>(
			filters,
			ALLOWED_FILTERS,
			search,
			["topic", "notes"],
		);

		const orderClause: Prisma.OneToOneSessionOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [sessions, total] = await Promise.all([
			prisma.oneToOneSession.findMany({
				where,
				include: {
					teacherAvailability: {
						include: {
							profile: {
								include: {
									teacher: {
										include: {
											user: { select: { name: true, image: true } },
										},
									},
								},
							},
						},
					},
					recording: true,
				},
				skip,
				take: limit,
				orderBy: orderClause,
			}),
			prisma.oneToOneSession.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const pagination = {
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		await cached.set(
			cacheKey,
			JSON.stringify({ data: sessions, pagination }),
			60,
		);

		return res.json({
			success: true,
			data: sessions,
			pagination,
		});
	},
);

/**
 * Get Teacher's Sessions
 * GET /api/onetoone/teachers/:teacherId/sessions
 * Fixed: now properly scopes to the teacher's profile
 */
export const getTeacherSessions = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: teacherId } = ZCuid.parse(req.params);
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const cacheKey = `teacher-sessions:${teacherId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Sessions fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		// Always scope to this teacher via availability profile
		const where: Prisma.OneToOneSessionWhereInput = {
			teacherAvailability: {
				profile: { teacherId },
			},
		};
		if (filters?.status) where.status = filters.status as any;
		if (filters?.studentId) where.studentId = filters.studentId as string;
		if (search) {
			where.OR = [
				{ topic: { contains: search, mode: "insensitive" } },
				{ notes: { contains: search, mode: "insensitive" } },
			];
		}

		const orderClause: Prisma.OneToOneSessionOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [sessions, total] = await Promise.all([
			prisma.oneToOneSession.findMany({
				where,
				include: {
					student: {
						include: {
							user: { select: { name: true, image: true } },
						},
					},
					recording: true,
				},
				skip,
				take: limit,
				orderBy: orderClause,
			}),
			prisma.oneToOneSession.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const pagination = {
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		await cached.set(
			cacheKey,
			JSON.stringify({ data: sessions, pagination }),
			60,
		);

		return res.json({
			success: true,
			data: sessions,
			pagination,
		});
	},
);

/**
 * Get Session Details
 * GET /api/onetoone/sessions/:id
 */
export const getSession = asyncHandler(async (req: Request, res: Response) => {
	const { id } = ZCuid.parse(req.params);

	const session = await prisma.oneToOneSession.findUnique({
		where: { id },
		include: {
			teacherAvailability: {
				include: {
					profile: {
						include: {
							teacher: {
								include: {
									user: { select: { name: true, image: true } },
								},
							},
						},
					},
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

	return res.json({
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
		const { id } = ZCuid.parse(req.params);

		const session = await prisma.oneToOneSession.findUnique({
			where: { id },
			include: {
				teacherAvailability: {
					include: {
						profile: true,
					},
				},
			},
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

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CHANGE_STATUS,
			module: "OneToOneSession",
			entityId: updatedSession.id,
			description: `Started one-to-one session`,
			performedById: req.user?.id,
		});

		await Promise.all([
			invalidateCachePattern(`student-sessions:${session.studentId}:*`),
			invalidateCachePattern(
				`teacher-sessions:${session.teacherAvailability.profile.id}:*`,
			),
		]);

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
	const { id } = ZCuid.parse(req.params);

	const session = await prisma.oneToOneSession.findUnique({
		where: { id },
		include: {
			teacherAvailability: {
				include: {
					profile: true,
				},
			},
		},
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

	// Enqueue recording stop (instruct orchestrator/Jibri to finalize upload)
	try {
		const recording = await prisma.sessionRecording.findUnique({
			where: { sessionId: id },
		});
		if (recording) {
			await queueService.addJob(
				QUEUE_NAMES.RECORDING,
				JOB_TYPES.RECORDING_STOP,
				{
					sessionId: id,
					recordingId: recording.id,
					jitsiRoomId: session.jitsiRoomId,
				},
			);
		}
	} catch (err) {
		console.error("Failed to enqueue recording stop job:", err);
	}

	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.CHANGE_STATUS,
		module: "OneToOneSession",
		entityId: updatedSession.id,
		description: `Completed one-to-one session`,
		performedById: req.user?.id,
	});

	// Create a SessionRecording record (if not exists) and enqueue recording start
	const existingRecording = await prisma.sessionRecording.findUnique({
		where: { sessionId: id },
	});
	if (!existingRecording) {
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days retention
		const recording = await prisma.sessionRecording.create({
			data: {
				sessionId: id,
				status: "RECORDING",
				expiresAt,
			},
		});

		// Ask orchestrator to start recording (e.g., Jibri)
		try {
			await queueService.addJob(
				QUEUE_NAMES.RECORDING,
				JOB_TYPES.RECORDING_START,
				{
					sessionId: id,
					recordingId: recording.id,
					jitsiRoomId: updatedSession.jitsiRoomId,
				},
			);
		} catch (err) {
			// Log but do not fail session start
			console.error("Failed to enqueue recording start job:", err);
		}
	}

	await Promise.all([
		invalidateCachePattern(`student-sessions:${session.studentId}:*`),
		invalidateCachePattern(
			`teacher-sessions:${session.teacherAvailability.profile.id}:*`,
		),
	]);

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
		const { id } = ZCuid.parse(req.params);
		const { cancellationReason } = cancelSessionSchema.parse(req.body);

		const session = await prisma.oneToOneSession.findUnique({
			where: { id },
			include: {
				teacherAvailability: {
					include: {
						profile: true,
					},
				},
			},
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

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "OneToOneSession",
			entityId: updatedSession.id,
			description: `Cancelled one-to-one session: ${cancellationReason || "No reason provided"}`,
			performedById: req.user?.id,
		});

		await Promise.all([
			invalidateCachePattern(`student-sessions:${session.studentId}:*`),
			invalidateCachePattern(
				`teacher-sessions:${session.teacherAvailability.profile.id}:*`,
			),
		]);

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
		const { id: sessionId } = ZCuid.parse(req.params);
		const validated = createOneToOneReviewSchema.parse(req.body);

		// Get studentId from authenticated user
		const studentId = req.user?.student?.id;
		if (!studentId) {
			throw new AppError("Student profile not found", 404);
		}

		// Check if session exists and is completed
		const session = await prisma.oneToOneSession.findUnique({
			where: { id: sessionId },
			include: {
				teacherAvailability: {
					include: {
						profile: true,
					},
				},
			},
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
				teacherProfileId: session.teacherAvailability.profile.id,
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
			where: { teacherProfileId: session.teacherAvailability.profile.id },
			_avg: { rating: true },
			_count: { rating: true },
		});

		await prisma.teacherProfile.update({
			where: { id: session.teacherAvailability.profile.id },
			data: {
				rating: stats._avg.rating || null,
				totalReviews: stats._count.rating || 0,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "OneToOneReview",
			entityId: review.id,
			description: `Created review for one-to-one session with rating ${validated.rating}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("teachers:*");

		res.status(201).json({
			success: true,
			data: review,
		});
	},
);

/**
 * Get Student's Own Sessions (JWT-based, no studentId required)
 * GET /api/onetoone/sessions/my
 */
export const getMyStudentSessions = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = req.user?.student?.id;
		if (!studentId) {
			throw new AppError("Student profile not found", 404);
		}

		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `my-sessions:${studentId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}`;
		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Sessions fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const where: Prisma.OneToOneSessionWhereInput = { studentId };
		if (filters?.status) where.status = filters.status as any;
		if (search) {
			where.OR = [
				{ topic: { contains: search, mode: "insensitive" } },
				{ notes: { contains: search, mode: "insensitive" } },
			];
		}

		const [sessions, total] = await Promise.all([
			prisma.oneToOneSession.findMany({
				where,
				include: {
					teacherAvailability: {
						include: {
							profile: {
								include: {
									teacher: {
										include: {
											user: {
												select: { name: true, image: true, email: true },
											},
										},
									},
								},
							},
						},
					},
					recording: true,
					review: {
						include: {
							student: {
								include: { user: { select: { name: true, image: true } } },
							},
						},
					},
				},
				skip,
				take: limit,
				orderBy: { [sortBy]: orderBy },
			}),
			prisma.oneToOneSession.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const pagination = {
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		await cached.set(
			cacheKey,
			JSON.stringify({ data: sessions, pagination }),
			60,
		);

		return res.json({ success: true, data: sessions, pagination });
	},
);

/**
 * Admin: Get All Sessions (no studentId filter required)
 * GET /api/onetoone/sessions/admin
 */
export const getAdminSessions = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const where: Prisma.OneToOneSessionWhereInput = {};
		if (filters?.status) where.status = filters.status as any;
		if (filters?.studentId) where.studentId = filters.studentId as string;
		if (filters?.teacherId) {
			where.teacherAvailability = {
				profile: { teacherId: filters.teacherId as string },
			};
		}
		if (search) {
			where.OR = [
				{ topic: { contains: search, mode: "insensitive" } },
				{ notes: { contains: search, mode: "insensitive" } },
			];
		}

		const [sessions, total] = await Promise.all([
			prisma.oneToOneSession.findMany({
				where,
				include: {
					student: {
						include: {
							user: { select: { name: true, image: true, email: true } },
						},
					},
					teacherAvailability: {
						include: {
							profile: {
								include: {
									teacher: {
										include: {
											user: { select: { name: true, image: true } },
										},
									},
								},
							},
						},
					},
					recording: true,
					review: true,
				},
				skip,
				take: limit,
				orderBy: { [sortBy]: orderBy },
			}),
			prisma.oneToOneSession.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const pagination = {
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		return res.json({ success: true, data: sessions, pagination });
	},
);

/**
 * Teacher: Respond to a Review
 * POST /api/onetoone/sessions/:sessionId/review-response
 */
export const respondToReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: sessionId } = ZCuid.parse(req.params);
		const { response } = req.body as { response: string };

		if (!response || typeof response !== "string" || !response.trim()) {
			throw new AppError("Response text is required", 400);
		}

		const review = await prisma.oneToOneReview.findFirst({
			where: { sessionId },
		});
		if (!review) {
			throw new AppError("Review not found for this session", 404);
		}
		if (review.response) {
			throw new AppError("Review has already been responded to", 409);
		}

		const updated = await prisma.oneToOneReview.update({
			where: { id: review.id },
			data: { response: response.trim(), respondedAt: new Date() },
		});

		await invalidateCachePattern(`teachers:*`);

		res.json({ success: true, data: updated });
	},
);

/**
 * Get Teacher Reviews
 * GET /api/onetoone/teachers/:teacherProfileId/reviews
 */
export const getTeacherReviews = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: teacherProfileId } = ZCuid.parse(req.params);
		const validatedParams = ZQueryParams.parse(req.query);

		const skip =
			(Number(validatedParams.page) - 1) * Number(validatedParams.limit);
		const limit = Number(validatedParams.limit);
		const page = Number(validatedParams.page);

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
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.oneToOneReview.count({ where: { teacherProfileId } }),
		]);

		res.json({
			success: true,
			data: reviews,
			pagination: {
				page: page,
				limit: limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	},
);
