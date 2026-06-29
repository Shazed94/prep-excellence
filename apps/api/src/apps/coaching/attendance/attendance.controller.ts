import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { coachingAttendanceService } from "./attendance.service";

export const markAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const attendance = await coachingAttendanceService.mark(
			req.params.scheduledClassId,
			req.body,
			req,
		);
		res.status(200).json({ success: true, data: attendance });
	},
);

export const markBulkAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { records } = req.body;
		if (!Array.isArray(records)) {
			res
				.status(400)
				.json({ success: false, message: "records must be an array" });
			return;
		}
		const results = await coachingAttendanceService.markBulk(
			req.params.scheduledClassId,
			records,
			req,
		);
		res.status(200).json({ success: true, data: results });
	},
);

export const getAttendanceByClass = asyncHandler(
	async (req: Request, res: Response) => {
		const attendance = await coachingAttendanceService.getByScheduledClass(
			req.params.scheduledClassId,
		);
		res.status(200).json({ success: true, data: attendance });
	},
);

export const getStudentAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId, courseId } = req.query as any;
		const attendance = await coachingAttendanceService.getByStudent(
			studentId,
			courseId,
		);
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
		const stats = await coachingAttendanceService.getStudentStats(
			studentId,
			courseId,
		);
		res.status(200).json({ success: true, data: stats });
	},
);

export const getCourseAttendanceStats = asyncHandler(
	async (req: Request, res: Response) => {
		const stats = await coachingAttendanceService.getCourseStats(
			req.params.courseId,
		);
		res.status(200).json({ success: true, data: stats });
	},
);
