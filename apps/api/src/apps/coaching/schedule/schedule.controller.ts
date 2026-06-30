import {
	ZCCoachingRecurringScheduleSchema,
	ZCCoachingScheduledClassSchema,
	ZCCoachingScheduleExceptionSchema,
	ZUCoachingRecurringScheduleSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { z } from "zod";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

async function validateCourseType(courseId: string) {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: { courseType: true },
	});
	if (!course || course.courseType !== "COACHING") {
		throw AppError.badRequest("Not a Coaching course");
	}
}

// ── Recurring schedule ──
export const createRecurringSchedule = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const { dayOfWeek, startTime, endTime, room } =
			ZCCoachingRecurringScheduleSchema.parse(req.body);

		await validateCourseType(courseId);

		const schedule = await prisma.courseSchedule.create({
			data: {
				dayOfWeek,
				startTime,
				endTime,
				room,
				courseId,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingSchedule",
			entityId: schedule.id,
			description: `Recurring schedule created: ${dayOfWeek} ${startTime}-${endTime}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:schedule:${courseId}`);

		res.status(201).json({ success: true, data: schedule });
	},
);

export const getRecurringSchedules = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;

		await validateCourseType(courseId);

		const schedules = await prisma.courseSchedule.findMany({
			where: { courseId },
			orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
		});

		res.status(200).json({ success: true, data: schedules });
	},
);

export const updateRecurringSchedule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { dayOfWeek, startTime, endTime, room } =
			ZUCoachingRecurringScheduleSchema.parse(req.body);

		const schedule = await prisma.courseSchedule.findUnique({ where: { id } });
		if (!schedule) throw AppError.notFound("Recurring schedule not found");

		const data: Record<string, unknown> = {};
		if (dayOfWeek !== undefined) data.dayOfWeek = dayOfWeek;
		if (startTime !== undefined) data.startTime = startTime;
		if (endTime !== undefined) data.endTime = endTime;
		if (room !== undefined) data.room = room;

		const updated = await prisma.courseSchedule.update({
			where: { id },
			data: data as any,
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingSchedule",
			entityId: id,
			description: `Recurring schedule updated`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:schedule:${schedule.courseId}`);

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteRecurringSchedule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const schedule = await prisma.courseSchedule.findUnique({ where: { id } });
		if (!schedule) throw AppError.notFound("Recurring schedule not found");

		await prisma.courseSchedule.delete({ where: { id } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingSchedule",
			entityId: id,
			description: `Recurring schedule deleted`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:schedule:${schedule.courseId}`);

		res
			.status(200)
			.json({ success: true, message: "Schedule deleted successfully" });
	},
);

// ── Schedule exceptions ──
export const createScheduleException = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const { exceptionDate, isCancelled, reason, rescheduleDate } =
			ZCCoachingScheduleExceptionSchema.parse(req.body);

		await validateCourseType(courseId);

		const exception = await prisma.courseScheduleException.create({
			data: {
				exceptionDate: new Date(exceptionDate),
				isCancelled: isCancelled ?? false,
				reason,
				rescheduleDate: rescheduleDate ? new Date(rescheduleDate) : null,
				courseId,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingScheduleException",
			entityId: exception.id,
			description: `Schedule exception created for ${exceptionDate}`,
			performedById: req.user?.id,
		});

		res.status(201).json({ success: true, data: exception });
	},
);

export const getScheduleExceptions = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;

		await validateCourseType(courseId);

		const exceptions = await prisma.courseScheduleException.findMany({
			where: { courseId },
			orderBy: { exceptionDate: "asc" },
		});

		res.status(200).json({ success: true, data: exceptions });
	},
);

export const deleteScheduleException = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const exception = await prisma.courseScheduleException.findUnique({
			where: { id },
		});
		if (!exception) throw AppError.notFound("Schedule exception not found");

		await prisma.courseScheduleException.delete({ where: { id } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingScheduleException",
			entityId: id,
			description: `Schedule exception deleted`,
			performedById: req.user?.id,
		});

		res
			.status(200)
			.json({ success: true, message: "Exception deleted successfully" });
	},
);

// ── Scheduled classes ──
export const createScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const { classDate, startTime, endTime, dayOfWeek, orderIndex, lessonId } =
			ZCCoachingScheduledClassSchema.parse(req.body);

		await validateCourseType(courseId);

		const scheduledClass = await prisma.scheduledClass.create({
			data: {
				classDate: new Date(classDate),
				startTime,
				endTime,
				dayOfWeek,
				orderIndex,
				courseId,
				...(lessonId ? { lessonId } : {}),
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingScheduledClass",
			entityId: scheduledClass.id,
			description: `Scheduled class created for ${classDate}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:schedule:${courseId}`);

		res.status(201).json({ success: true, data: scheduledClass });
	},
);

export const getScheduledClasses = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const { from, to } = req.query as any;

		await validateCourseType(courseId);

		const where: any = { courseId };
		if (from || to) {
			where.classDate = {};
			if (from) where.classDate.gte = new Date(from);
			if (to) where.classDate.lte = new Date(to);
		}

		const classes = await prisma.scheduledClass.findMany({
			where,
			orderBy: [{ classDate: "asc" }, { startTime: "asc" }],
			include: {
				lesson: { select: { id: true, title: true } },
				_count: { select: { attendances: true } },
			},
		});

		res.status(200).json({ success: true, data: classes });
	},
);

export const getScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const sc = await prisma.scheduledClass.findUnique({
			where: { id },
			include: {
				lesson: { select: { id: true, title: true, orderIndex: true } },
				attendances: {
					include: {
						student: {
							select: {
								id: true,
								user: {
									select: { firstName: true, lastName: true, email: true },
								},
							},
						},
					},
				},
			},
		});
		if (!sc) throw AppError.notFound("Scheduled class not found");

		res.status(200).json({ success: true, data: sc });
	},
);

export const cancelScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { reason } = z
			.object({ reason: z.string().optional() })
			.parse(req.body);

		const sc = await prisma.scheduledClass.findUnique({ where: { id } });
		if (!sc) throw AppError.notFound("Scheduled class not found");

		const updated = await prisma.scheduledClass.update({
			where: { id },
			data: { isCancelled: true },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingScheduledClass",
			entityId: id,
			description: `Scheduled class cancelled: ${reason || "No reason provided"}`,
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const sc = await prisma.scheduledClass.findUnique({ where: { id } });
		if (!sc) throw AppError.notFound("Scheduled class not found");

		await prisma.scheduledClass.delete({ where: { id } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingScheduledClass",
			entityId: id,
			description: `Scheduled class deleted`,
			performedById: req.user?.id,
		});

		res.status(200).json({
			success: true,
			message: "Scheduled class deleted successfully",
		});
	},
);
