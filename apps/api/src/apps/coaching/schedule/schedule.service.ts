import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export interface CreateRecurringScheduleInput {
	dayOfWeek: string;
	startTime: string;
	endTime: string;
	room?: string;
}

export interface CreateExceptionInput {
	exceptionDate: string;
	isCancelled?: boolean;
	reason?: string;
	rescheduleDate?: string;
}

export interface CreateScheduledClassInput {
	classDate: string;
	startTime: string;
	endTime: string;
	dayOfWeek: string;
	orderIndex: number;
	lessonId?: string;
}

class CoachingScheduleService {
	// ── Recurring schedule (weekly pattern) ──
	async createRecurring(
		courseId: string,
		data: CreateRecurringScheduleInput,
		req: Request,
	) {
		await this.#validateCourseType(courseId);

		const schedule = await prisma.courseSchedule.create({
			data: {
				dayOfWeek: data.dayOfWeek as any,
				startTime: data.startTime,
				endTime: data.endTime,
				room: data.room,
				courseId,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingSchedule",
			entityId: schedule.id,
			description: `Recurring schedule created: ${data.dayOfWeek} ${data.startTime}-${data.endTime}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:schedule:${courseId}`);
		return schedule;
	}

	async getRecurringByCourse(courseId: string) {
		await this.#validateCourseType(courseId);
		return prisma.courseSchedule.findMany({
			where: { courseId },
			orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
		});
	}

	async updateRecurring(
		id: string,
		data: Partial<CreateRecurringScheduleInput>,
		req: Request,
	) {
		const schedule = await prisma.courseSchedule.findUnique({ where: { id } });
		if (!schedule) throw AppError.notFound("Recurring schedule not found");

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
		return updated;
	}

	async deleteRecurring(id: string, req: Request) {
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
	}

	// ── Schedule exceptions (date overrides) ──
	async createException(
		courseId: string,
		data: CreateExceptionInput,
		req: Request,
	) {
		await this.#validateCourseType(courseId);

		const exception = await prisma.courseScheduleException.create({
			data: {
				exceptionDate: new Date(data.exceptionDate),
				isCancelled: data.isCancelled ?? false,
				reason: data.reason,
				rescheduleDate: data.rescheduleDate
					? new Date(data.rescheduleDate)
					: null,
				courseId,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingScheduleException",
			entityId: exception.id,
			description: `Schedule exception created for ${data.exceptionDate}`,
			performedById: req.user?.id,
		});
		return exception;
	}

	async getExceptionsByCourse(courseId: string) {
		await this.#validateCourseType(courseId);
		return prisma.courseScheduleException.findMany({
			where: { courseId },
			orderBy: { exceptionDate: "asc" },
		});
	}

	async deleteException(id: string, req: Request) {
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
	}

	// ── Scheduled classes (individual class instances) ──
	async createScheduledClass(
		courseId: string,
		data: CreateScheduledClassInput,
		req: Request,
	) {
		await this.#validateCourseType(courseId);

		const scheduledClass = await prisma.scheduledClass.create({
			data: {
				classDate: new Date(data.classDate),
				startTime: data.startTime,
				endTime: data.endTime,
				dayOfWeek: data.dayOfWeek as any,
				orderIndex: data.orderIndex,
				courseId,
				...(data.lessonId ? { lessonId: data.lessonId } : {}),
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingScheduledClass",
			entityId: scheduledClass.id,
			description: `Scheduled class created for ${data.classDate}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:schedule:${courseId}`);
		return scheduledClass;
	}

	async getScheduledClassesByCourse(
		courseId: string,
		filters?: { from?: string; to?: string },
	) {
		await this.#validateCourseType(courseId);

		const where: any = { courseId };
		if (filters?.from || filters?.to) {
			where.classDate = {};
			if (filters.from) where.classDate.gte = new Date(filters.from);
			if (filters.to) where.classDate.lte = new Date(filters.to);
		}

		return prisma.scheduledClass.findMany({
			where,
			orderBy: [{ classDate: "asc" }, { startTime: "asc" }],
			include: {
				lesson: { select: { id: true, title: true } },
				_count: { select: { attendances: true } },
			},
		});
	}

	async getScheduledClassById(id: string) {
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
									select: { name: true, email: true },
								},
							},
						},
					},
				},
			},
		});
		if (!sc) throw AppError.notFound("Scheduled class not found");
		return sc;
	}

	async cancelScheduledClass(id: string, reason: string, req: Request) {
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
			description: `Scheduled class cancelled: ${reason}`,
			performedById: req.user?.id,
		});
		return updated;
	}

	async deleteScheduledClass(id: string, req: Request) {
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
	}

	async #validateCourseType(courseId: string) {
		const course = await prisma.course.findUnique({
			where: { id: courseId },
			select: { courseType: true },
		});
		if (!course || course.courseType !== "COACHING") {
			throw AppError.badRequest("Not a Coaching course");
		}
	}
}

export const coachingScheduleService = new CoachingScheduleService();
