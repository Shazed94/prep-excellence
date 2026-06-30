import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export interface MarkAttendanceInput {
	studentId: string;
	status: string;
	joinedAt?: string;
	leftAt?: string;
	duration?: number;
}

class CoachingAttendanceService {
	async mark(
		scheduledClassId: string,
		data: MarkAttendanceInput,
		req: Request,
	) {
		const sc = await prisma.scheduledClass.findUnique({
			where: { id: scheduledClassId },
			include: { course: { select: { courseType: true, title: true } } },
		});
		if (!sc) throw AppError.notFound("Scheduled class not found");
		if (sc.course.courseType !== "COACHING") {
			throw AppError.badRequest("Not part of a Coaching course");
		}

		const attendance = await prisma.attendance.upsert({
			where: {
				studentId_scheduledClassId: {
					studentId: data.studentId,
					scheduledClassId,
				},
			},
			create: {
				studentId: data.studentId,
				scheduledClassId,
				status: data.status as any,
				joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
				leftAt: data.leftAt ? new Date(data.leftAt) : null,
				duration: data.duration,
				markedById: req.user?.id,
			},
			update: {
				status: data.status as any,
				joinedAt: data.joinedAt ? new Date(data.joinedAt) : undefined,
				leftAt: data.leftAt ? new Date(data.leftAt) : undefined,
				duration: data.duration,
				markedById: req.user?.id,
			},
			include: {
				student: {
					select: {
						id: true,
						user: { select: { name: true } },
					},
				},
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingAttendance",
			entityId: attendance.id,
			description: `Attendance marked for ${data.studentId}: ${data.status}`,
			performedById: req.user?.id,
		});
		return attendance;
	}

	async markBulk(
		scheduledClassId: string,
		records: MarkAttendanceInput[],
		req: Request,
	) {
		const sc = await prisma.scheduledClass.findUnique({
			where: { id: scheduledClassId },
			select: { course: { select: { courseType: true } } },
		});
		if (!sc) throw AppError.notFound("Scheduled class not found");
		if (sc.course.courseType !== "COACHING") {
			throw AppError.badRequest("Not part of a Coaching course");
		}

		const results = [];
		for (const record of records) {
			const attendance = await prisma.attendance.upsert({
				where: {
					studentId_scheduledClassId: {
						studentId: record.studentId,
						scheduledClassId,
					},
				},
				create: {
					studentId: record.studentId,
					scheduledClassId,
					status: record.status as any,
					joinedAt: record.joinedAt ? new Date(record.joinedAt) : null,
					leftAt: record.leftAt ? new Date(record.leftAt) : null,
					duration: record.duration,
					markedById: req.user?.id,
				},
				update: {
					status: record.status as any,
					joinedAt: record.joinedAt ? new Date(record.joinedAt) : undefined,
					leftAt: record.leftAt ? new Date(record.leftAt) : undefined,
					duration: record.duration,
					markedById: req.user?.id,
				},
			});
			results.push(attendance);
		}

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingAttendance",
			entityId: scheduledClassId,
			description: `Bulk attendance marked for ${records.length} students`,
			performedById: req.user?.id,
		});
		return results;
	}

	async getByScheduledClass(scheduledClassId: string) {
		const sc = await prisma.scheduledClass.findUnique({
			where: { id: scheduledClassId },
		});
		if (!sc) throw AppError.notFound("Scheduled class not found");

		return prisma.attendance.findMany({
			where: { scheduledClassId },
			include: {
				student: {
					select: {
						id: true,
						user: { select: { name: true, email: true } },
					},
				},
			},
			orderBy: { createdAt: "asc" },
		});
	}

	async getByStudent(studentId: string, courseId?: string) {
		const where: any = { studentId };
		if (courseId) {
			where.scheduledClass = { courseId };
		}
		return prisma.attendance.findMany({
			where,
			include: {
				scheduledClass: {
					select: { id: true, classDate: true, startTime: true, endTime: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}

	async getStudentStats(studentId: string, courseId: string) {
		const attendances = await prisma.attendance.findMany({
			where: {
				studentId,
				scheduledClass: { courseId },
			},
		});

		const total = attendances.length;
		const present = attendances.filter((a) => a.status === "PRESENT").length;
		const absent = attendances.filter((a) => a.status === "ABSENT").length;
		const late = attendances.filter((a) => a.status === "LATE").length;
		const excused = attendances.filter((a) => a.status === "EXCUSED").length;
		const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

		return { total, present, absent, late, excused, percentage };
	}

	async getCourseStats(courseId: string) {
		const course = await prisma.course.findFirst({
			where: { id: courseId, courseType: "COACHING" },
		});
		if (!course) throw AppError.notFound("Coaching course not found");

		const attendances = await prisma.attendance.findMany({
			where: { scheduledClass: { courseId } },
			include: {
				student: {
					select: {
						id: true,
						user: { select: { name: true } },
					},
				},
			},
		});

		const total = attendances.length;
		const present = attendances.filter((a) => a.status === "PRESENT").length;
		const absent = attendances.filter((a) => a.status === "ABSENT").length;
		const overallPercentage =
			total > 0 ? Math.round((present / total) * 100) : 0;

		return { total, present, absent, overallPercentage };
	}
}

export const coachingAttendanceService = new CoachingAttendanceService();
