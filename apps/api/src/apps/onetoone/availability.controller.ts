import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import {
  createAvailabilitySchema,
  updateAvailabilitySchema,
  ZCuid,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";

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
 */
function toTimeDate(dateStr: string, timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr + "T00:00:00.000Z");
  d.setUTCHours(h, m, 0, 0);
  return d;
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

  const isRecurring = daysOfWeek && daysOfWeek.length > 0;
  const effectiveEndDate = endDate ?? startDate;

  const base: any = {
    category: category as any,
    availabilityType: (availabilityType ?? null) as any,
    profileId,
    sessionDuration: sessionDuration ?? null,
    bufferTime: bufferTime ?? null,
    hourlyRate: hourlyRate ?? null,
    reason: reason ?? null,
    title: title ?? null,
    repeatDuration: repeatDuration ?? 90,
    isActive: true,
    isBooked: false,
  };

  if (isRecurring) {
    // Create one record per day-of-week
    // We store startTime/endTime as specificStartTime/specificEndTime using a reference date
    base.specificDate = null;
    base.specificStartTime = toTimeDate(startDate, startTime);
    base.specificEndTime = toTimeDate(startDate, endTime);
    return daysOfWeek.map((d) => ({
      ...base,
      dayOfWeek: DAY_NAMES[d] as any,
    }));
  }

  // One-time slot
  validateNoPastDates(startDate);
  base.dayOfWeek = null;
  base.specificDate = new Date(startDate + "T00:00:00.000Z");
  if (fullDay) {
    base.specificStartTime = toTimeDate(startDate, "00:00");
    base.specificEndTime = toTimeDate(startDate, "23:59");
  } else {
    base.specificStartTime = toTimeDate(startDate, startTime);
    base.specificEndTime = toTimeDate(startDate, endTime);
  }
  return [{ ...base }];
}

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * Create Teacher Availability
 * POST /api/v1/onetoone/teachers/:teacherId/availability
 */
export const createAvailability = asyncHandler(
  async (req: Request, res: Response) => {
  
    const { teacherId } = ZCuid.parse(req.params);



    const validated = createAvailabilitySchema.parse(req.body);
    const profile = await getProfileOrThrow(teacherId);

    const records = buildCreateData(validated, profile.id);

    console.log(records, "records");

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
 */
export const getAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacherId } = ZCuid.parse(req.params);
    const profile = await getProfileOrThrow(teacherId);

    const availability = await prisma.teacherAvailability.findMany({
      where: { profileId: profile.id, isActive: true },
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
    const { teacherId:id } = ZCuid.parse(req.params);
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
        validated.startDate + "T00:00:00.000Z",
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
    const { teacherId :id } = ZCuid.parse(req.params);

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
 */
export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacherId } = ZCuid.parse(req.params);
    const { date } = req.query;

    if (!date) {
      throw new AppError("date parameter is required", 400);
    }

    const targetDate = new Date(date as string);
    const dayName = DAY_NAMES[targetDate.getUTCDay()];
    const dayStart = new Date(targetDate);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const profile = await getProfileOrThrow(teacherId);

    // Recurring availability matching the day of week
    const recurringSlots = await prisma.teacherAvailability.findMany({
      where: {
        profileId: profile.id,
        category: "AVAILABLE",
        dayOfWeek: dayName as any,
        isActive: true,
        isBooked: false,
      },
    });

    // One-time slots for the specific date
    const oneTimeSlots = await prisma.teacherAvailability.findMany({
      where: {
        profileId: profile.id,
        category: "AVAILABLE",
        specificDate: { gte: dayStart, lte: dayEnd },
        isActive: true,
        isBooked: false,
      },
    });

    // Booked sessions on the same day
    const bookedSessions = await prisma.oneToOneSession.findMany({
      where: {
        teacherAvailability: { profileId: profile.id },
        scheduledAt: { gte: dayStart, lte: dayEnd },
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      },
      select: { scheduledAt: true, duration: true },
    });

    res.json({
      success: true,
      data: {
        availableSlots: [...recurringSlots, ...oneTimeSlots],
        bookedSessions,
      },
    });
  },
);
