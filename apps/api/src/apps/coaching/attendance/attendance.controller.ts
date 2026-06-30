import {
	ZBulkAttendanceSchema,
	ZMarkAttendanceSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export const markAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { scheduledClassId } = req.params;
		const { studentId, status, joinedAt, leftAt, duration } =
			ZMarkAttendanceSchema.parse(req.body);

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
					studentId,
					scheduledClassId,
				},
			},
			create: {
				studentId,
				scheduledClassId,
				status,
				joinedAt: joinedAt ? new Date(joinedAt) : null,
				leftAt: leftAt ? new Date(leftAt) : null,
				duration,
				markedById: req.user?.id,
			},
			update: {
				status,
				joinedAt: joinedAt ? new Date(joinedAt) : undefined,
				leftAt: leftAt ? new Date(leftAt) : undefined,
				duration,
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
			description: `Attendance marked for ${studentId}: ${status}`,
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: attendance });
	},
);

export const markBulkAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { scheduledClassId } = req.params;
		const { records } = ZBulkAttendanceSchema.parse(req.body);

		if (!Array.isArray(records)) {
			res
				.status(400)
				.json({ success: false, message: "records must be an array" });
			return;
		}

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
					status: record.status,
					joinedAt: record.joinedAt ? new Date(record.joinedAt) : null,
					leftAt: record.leftAt ? new Date(record.leftAt) : null,
					duration: record.duration,
					markedById: req.user?.id,
				},
				update: {
					status: record.status,
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

		res.status(200).json({ success: true, data: results });
	},
);

export const getAttendanceByClass = asyncHandler(
	async (req: Request, res: Response) => {
		const { scheduledClassId } = req.params;

		const sc = await prisma.scheduledClass.findUnique({
			where: { id: scheduledClassId },
		});
		if (!sc) throw AppError.notFound("Scheduled class not found");

		const attendance = await prisma.attendance.findMany({
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

		res.status(200).json({ success: true, data: attendance });
	},
);

export const getStudentAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId, courseId } = req.query as any;

		const where: any = { studentId };
		if (courseId) {
			where.scheduledClass = { courseId };
		}

		const attendance = await prisma.attendance.findMany({
			where,
			include: {
				scheduledClass: {
					select: { id: true, classDate: true, startTime: true, endTime: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({ success: true, data: attendance });
	},
);

export const getStudentStats = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId, courseId } = req.query as any;

		if (!studentId || !courseId) {
			res.status(400).json({
				success: false,
				message: "studentId and courseId are required",
			});
			return;
		}

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

		res.status(200).json({
			success: true,
			data: { total, present, absent, late, excused, percentage },
		});
	},
);

export const getCourseAttendanceStats = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;

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

		res.status(200).json({
			success: true,
			data: { total, present, absent, overallPercentage },
		});
	},
);
