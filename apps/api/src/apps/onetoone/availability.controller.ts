import {
	createAvailabilitySchema,
	TeacherCuid,
	updateAvailabilitySchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import moment from "moment";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

const DAY_NAMES = [
	"SUNDAY",
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
];

/**
 * Build time-as-Date from a YYYY-MM-DD date and HH:MM time string.
 * Stores the wall-clock time directly as UTC — no timezone conversion.
 */
function toTimeDate(dateStr: string, timeStr: string): Date {
	return new Date(`${dateStr}T${timeStr}:00.000Z`);
}

function validateNoPastDates(startDate: string): void {
	if (new Date(startDate) < new Date(new Date().toISOString().slice(0, 10))) {
		throw new AppError("Cannot create availability in the past", 400);
	}
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function getProfileOrThrow(teacherId: string) {
	const profile = await prisma.teacherProfile.findUnique({
		where: { teacherId },
	});
	if (!profile) {
		throw new AppError("Complete your teaching profile first", 404);
	}
	return profile;
}

function buildCreateData(
	validated: ReturnType<typeof createAvailabilitySchema.parse>,
	profileId: string,
) {
	const {
		category,
		availabilityType,
		daysOfWeek,
		startTime,
		endTime,
		startDate,
		endDate,
		sessionDuration,
		bufferTime,
		hourlyRate,
		fullDay,
		reason,
		title,
		repeatDuration,
	} = validated;

	const isRecurring = !!daysOfWeek?.length;

	const effectiveEndDate =
		endDate ??
		(isRecurring
			? moment(startDate).add(7, "days").format("YYYY-MM-DD")
			: startDate);

	// Validate end date is within 7 days of start date
	const diffDays = moment(effectiveEndDate).diff(moment(startDate), "days");
	if (diffDays > 7) {
		throw new AppError(
			"End date cannot be more than 7 days from start date",
			400,
		);
	}

	const base = {
		category: category as any,
		availabilityType: (availabilityType ?? null) as any,
		profileId,
		sessionDuration: sessionDuration ?? null,
		bufferTime: bufferTime ?? null,
		hourlyRate: hourlyRate ?? null,
		reason: reason ?? null,
		title: title ?? null,
		repeatDuration: repeatDuration ?? 90,
		endDate: new Date(`${effectiveEndDate}T00:00:00.000Z`),
		isActive: true,
		isBooked: false,
	};

	// ============================
	// Recurring Availability
	// ============================
	if (isRecurring) {
		validateNoPastDates(startDate);

		const rows: any[] = [];

		const current = moment(startDate);
		const last = moment(effectiveEndDate);

		while (current.isSameOrBefore(last, "day")) {
			const jsDay = current.day(); // 0 = Sunday, 6 = Saturday

			if (daysOfWeek.includes(jsDay)) {
				const dateStr = current.format("YYYY-MM-DD");

				rows.push({
					...base,
					dayOfWeek: DAY_NAMES[jsDay] as any,
					specificDate: new Date(`${dateStr}T00:00:00.000Z`),
					specificStartTime: fullDay
						? toTimeDate(dateStr, "00:00")
						: toTimeDate(dateStr, startTime),
					specificEndTime: fullDay
						? toTimeDate(dateStr, "23:59")
						: toTimeDate(dateStr, endTime),
				});
			}

			current.add(1, "day");
		}

		return rows;
	}

	// ============================
	// One-time Availability
	// ============================

	validateNoPastDates(startDate);

	return [
		{
			...base,
			dayOfWeek: null,
			specificDate: new Date(`${startDate}T00:00:00.000Z`),
			specificStartTime: fullDay
				? toTimeDate(startDate, "00:00")
				: toTimeDate(startDate, startTime),
			specificEndTime: fullDay
				? toTimeDate(startDate, "23:59")
				: toTimeDate(startDate, endTime),
		},
	];
}

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * Create Teacher Availability
 * POST /api/v1/onetoone/teachers/:teacherId/availability
 */
export const createAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = TeacherCuid.parse(req.params);

		const validated = createAvailabilitySchema.parse(req.body);
		const profile = await getProfileOrThrow(teacherId);

		const records = buildCreateData(validated, profile.id);

		const created = await prisma.$transaction(
			records.map((data) => prisma.teacherAvailability.create({ data })),
		);

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "TeacherAvailability",
			entityId: created[0]?.id ?? "bulk",
			description: `${created.length} availability slot(s) created (${validated.category})`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			message: "Availability created successfully",
			data: created.length === 1 ? created[0] : created,
		});
	},
);

/**
 * Get Teacher Availability
 * GET /api/onetoone/teachers/:teacherId/availability
 *
 * Returns only active slots that haven't expired (endDate not in the past).
 */
export const getAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = TeacherCuid.parse(req.params);
		const profile = await getProfileOrThrow(teacherId);

		const availability = await prisma.teacherAvailability.findMany({
			where: {
				profileId: profile.id,
				isActive: true,
				OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
			},
			orderBy: [
				{ category: "asc" },
				{ dayOfWeek: "asc" },
				{ specificDate: "asc" },
			],
		});

		res.json({ success: true, data: availability });
	},
);

/**
 * Update Teacher Availability
 * PATCH /api/v1/onetoone/teachers/availability/:id
 */
export const updateAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateAvailabilitySchema.parse(req.body);

		const existing = await prisma.teacherAvailability.findUnique({
			where: { id },
		});
		if (!existing) {
			throw new AppError("Teacher availability not found", 404);
		}

		const updateData: any = {};

		if (validated.category !== undefined)
			updateData.category = validated.category as any;
		if (validated.availabilityType !== undefined)
			updateData.availabilityType = validated.availabilityType as any;
		if (validated.sessionDuration !== undefined)
			updateData.sessionDuration = validated.sessionDuration;
		if (validated.bufferTime !== undefined)
			updateData.bufferTime = validated.bufferTime;
		if (validated.hourlyRate !== undefined)
			updateData.hourlyRate = validated.hourlyRate;
		if (validated.reason !== undefined) updateData.reason = validated.reason;
		if (validated.title !== undefined) updateData.title = validated.title;
		if (validated.repeatDuration !== undefined)
			updateData.repeatDuration = validated.repeatDuration;
		if (validated.fullDay !== undefined) updateData.fullDay = validated.fullDay;

		if (validated.endDate !== undefined) {
			updateData.endDate = new Date(`${validated.endDate}T00:00:00.000Z`);
		}

		if (validated.startTime && validated.startDate) {
			updateData.specificStartTime = toTimeDate(
				validated.startDate,
				validated.startTime,
			);
		}
		if (validated.endTime && validated.startDate) {
			updateData.specificEndTime = toTimeDate(
				validated.startDate,
				validated.endTime,
			);
		}
		if (validated.startDate) {
			updateData.specificDate = new Date(
				`${validated.startDate}T00:00:00.000Z`,
			);
		}
		if (validated.daysOfWeek && validated.daysOfWeek.length > 0) {
			updateData.dayOfWeek = DAY_NAMES[validated.daysOfWeek[0]] as any;
		}

		const availability = await prisma.teacherAvailability.update({
			where: { id },
			data: updateData,
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "TeacherAvailability",
			entityId: id,
			description: `Availability slot updated`,
			performedById: req.user?.id,
		});

		res.json({ success: true, data: availability });
	},
);

/**
 * Delete Teacher Availability
 * DELETE /api/v1/onetoone/teachers/availability/:id
 */
export const deleteAvailability = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.teacherAvailability.delete({ where: { id } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "TeacherAvailability",
			entityId: id,
			description: `Teacher availability deleted`,
			performedById: req.user?.id,
		});

		res.json({ success: true, message: "Availability deleted successfully" });
	},
);

/**
 * Get Available Time Slots for Booking
 * GET /api/v1/onetoone/teachers/:teacherId/available-slots
 *
 * Query params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 * Returns all bookable slots in the date range.
 */
export const getAvailableSlots = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = TeacherCuid.parse(req.params);
		const { startDate, endDate } = req.query;

		if (!startDate) {
			throw new AppError("startDate parameter is required", 400);
		}

		if (!endDate) {
			throw new AppError("endDate parameter is required", 400);
		}

		const rangeStart = new Date(startDate as string);
		rangeStart.setUTCHours(0, 0, 0, 0);
		const rangeEnd = new Date(endDate as string);
		rangeEnd.setUTCHours(23, 59, 59, 999);

		const profile = await getProfileOrThrow(teacherId);

		// Collect all day names in the range for recurring matching
		const dayNamesInRange: string[] = [];
		const current = new Date(rangeStart);
		while (current <= rangeEnd) {
			const dayName = DAY_NAMES[current.getUTCDay()];
			if (!dayNamesInRange.includes(dayName)) {
				dayNamesInRange.push(dayName);
			}
			current.setDate(current.getDate() + 1);
		}

		// Recurring availability matching the days of week in range (not expired, not booked)
		const recurringSlots = await prisma.teacherAvailability.findMany({
			where: {
				profileId: profile.id,
				category: "AVAILABLE",
				dayOfWeek: { in: dayNamesInRange as any },
				isActive: true,
				isBooked: false,
				OR: [{ endDate: null }, { endDate: { gte: rangeStart } }],
			},
		});

		// One-time slots for the specific date range
		const oneTimeSlots = await prisma.teacherAvailability.findMany({
			where: {
				profileId: profile.id,
				category: "AVAILABLE",
				specificDate: { gte: rangeStart, lte: rangeEnd },
				isActive: true,
				isBooked: false,
			},
		});

		// Booked sessions in the date range
		const bookedSessions = await prisma.oneToOneSession.findMany({
			where: {
				teacherAvailability: { profileId: profile.id },
				scheduledAt: { gte: rangeStart, lte: rangeEnd },
				status: { in: ["SCHEDULED", "IN_PROGRESS"] },
			},
			select: { scheduledAt: true, duration: true },
		});

		res.json({
			success: true,
			data: [...recurringSlots, ...oneTimeSlots],
		});
	},
);
