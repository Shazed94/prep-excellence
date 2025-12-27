import { createAvailabilitySchema } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

/**
 * Create Teacher Availability
 * POST /api/onetoone/teachers/:teacherId/availability
 */
export const createAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;
		const validated = createAvailabilitySchema.parse(req.body);

		const profile = await prisma.teacherProfile.findUnique({
			where: { teacherId },
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		// For one-time slots, check if the slot is in the future
		if (validated.availabilityType === "ONE_TIME_SLOT") {
			const slotDate = new Date(validated.specificDate!);
			if (slotDate < new Date()) {
				throw new AppError("Cannot create availability for past dates", 400);
			}
		}

		const availability = await prisma.teacherAvailability.create({
			data: {
				...validated,
				profileId: profile.id,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "TeacherAvailability",
			entityId: availability.id,
			description: `Teacher availability created for ${validated.availabilityType}`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: availability,
		});
	},
);

/**
 * Get Teacher Availability
 * GET /api/onetoone/teachers/:teacherId/availability
 */
export const getAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;
		const { availabilityType, fromDate, toDate } = req.query;

		const profile = await prisma.teacherProfile.findUnique({
			where: { teacherId },
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		const where: any = { profileId: profile.id };

		if (availabilityType) {
			where.availabilityType = availabilityType;
		}

		// For one-time slots, filter by date range
		if (fromDate || toDate) {
			where.specificDate = {};
			if (fromDate) where.specificDate.gte = new Date(fromDate as string);
			if (toDate) where.specificDate.lte = new Date(toDate as string);
		}

		const availability = await prisma.teacherAvailability.findMany({
			where,
			orderBy: [
				{ availabilityType: "asc" },
				{ dayOfWeek: "asc" },
				{ specificDate: "asc" },
			],
		});

		res.json({
			success: true,
			data: availability,
		});
	},
);

/**
 * Update Teacher Availability
 * PATCH /api/onetoone/availability/:id
 * Note: Update not implemented - delete and recreate availability instead
 */
// export const updateAvailability = asyncHandler(
//     async (req: Request, res: Response) => {
//         throw new AppError("Update not supported. Delete and recreate availability instead.", 400);
//     }
// );

/**
 * Delete Teacher Availability
 * DELETE /api/onetoone/availability/:id
 */
export const deleteAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.teacherAvailability.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "TeacherAvailability",
			entityId: id,
			description: `Teacher availability deleted`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			message: "Availability deleted successfully",
		});
	},
);

/**
 * Get Available Time Slots for Booking
 * GET /api/onetoone/teachers/:teacherId/available-slots
 */
export const getAvailableSlots = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;
		const { date } = req.query;

		if (!date) {
			throw new AppError("date parameter is required", 400);
		}

		const targetDate = new Date(date as string);
		const dayOfWeek = [
			"SUNDAY",
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY",
		][targetDate.getDay()];

		const profile = await prisma.teacherProfile.findUnique({
			where: { teacherId },
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		// Get recurring availability for the day
		const recurringSlots = await prisma.teacherAvailability.findMany({
			where: {
				profileId: profile.id,
				availabilityType: "RECURRING_WEEKLY",
				dayOfWeek: dayOfWeek as any,
			},
		});

		// Get one-time slots for the specific date
		const oneTimeSlots = await prisma.teacherAvailability.findMany({
			where: {
				profileId: profile.id,
				availabilityType: "ONE_TIME_SLOT",
				specificDate: {
					gte: new Date(targetDate.setHours(0, 0, 0, 0)),
					lt: new Date(targetDate.setHours(23, 59, 59, 999)),
				},
			},
		});

		// Get booked sessions for the date
		const bookedSessions = await prisma.oneToOneSession.findMany({
			where: {
				teacherProfileId: teacherId,
				scheduledAt: {
					gte: new Date(targetDate.setHours(0, 0, 0, 0)),
					lt: new Date(targetDate.setHours(23, 59, 59, 999)),
				},
				status: { in: ["SCHEDULED", "IN_PROGRESS"] },
			},
			select: {
				scheduledAt: true,
				duration: true,
			},
		});

		// Combine and filter out booked slots
		const allSlots = [...recurringSlots, ...oneTimeSlots];

		res.json({
			success: true,
			data: {
				availableSlots: allSlots,
				bookedSessions,
			},
		});
	},
);
