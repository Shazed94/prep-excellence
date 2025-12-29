import {
	createAvailabilitySchema,
	updateAvailabilitySchema,
	ZCuid,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

/**
 * Create Teacher Availability
 * POST /api/v1/onetoone/teachers/:teacherId/availability
 */
export const createAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: teacherId } = ZCuid.parse(req.params);
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
			message: "Availability created successfully",
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
		const { id: teacherId } = ZCuid.parse(req.params);

		const profile = await prisma.teacherProfile.findUnique({
			where: { teacherId },
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		const availability = await prisma.teacherAvailability.findMany({
			where: { profileId: profile.id },
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
 * PATCH /api/v1/onetoone/teachers/availability/:id
 * Note: Update not implemented - delete and recreate availability instead
 */
export const updateAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);
		const validated = updateAvailabilitySchema.parse(req.body);

		const availabilityIns = await prisma.teacherAvailability.findUnique({
			where: { id },
		});

		if (!availabilityIns) {
			throw new AppError("Teacher availability not found", 404);
		}

		// For one-time slots, check if the slot is in the future
		if (validated.availabilityType === "ONE_TIME_SLOT") {
			const slotDate = new Date(validated.specificDate!);
			if (slotDate < new Date()) {
				throw new AppError("Cannot create availability for past dates", 400);
			}
		}

		const availability = await prisma.teacherAvailability.update({
			where: { id },
			data: {
				...validated,
				profileId: availabilityIns.profileId,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "TeacherAvailability",
			entityId: availability.id,
			description: `Teacher availability updated for ${validated.availabilityType}`,
			performedById: req.user?.id,
		});

		res.status(200).json({
			success: true,
			message: "Availability updated successfully",
			data: availability,
		});
	},
);

/**
 * Delete Teacher Availability
 * DELETE /api/v1/onetoone/teachers/availability/:id
 */
export const deleteAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);

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
 * GET /api/v1/onetoone/teachers/:teacherId/available-slots
 */
export const getAvailableSlots = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: teacherId } = ZCuid.parse(req.params);
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
