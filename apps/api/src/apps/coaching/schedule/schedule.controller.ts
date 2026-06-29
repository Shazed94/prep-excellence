import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { coachingScheduleService } from "./schedule.service";

// ── Recurring schedule ──
export const createRecurringSchedule = asyncHandler(
	async (req: Request, res: Response) => {
		const schedule = await coachingScheduleService.createRecurring(
			req.params.courseId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: schedule });
	},
);

export const getRecurringSchedules = asyncHandler(
	async (req: Request, res: Response) => {
		const schedules = await coachingScheduleService.getRecurringByCourse(
			req.params.courseId,
		);
		res.status(200).json({ success: true, data: schedules });
	},
);

export const updateRecurringSchedule = asyncHandler(
	async (req: Request, res: Response) => {
		const schedule = await coachingScheduleService.updateRecurring(
			req.params.id,
			req.body,
			req,
		);
		res.status(200).json({ success: true, data: schedule });
	},
);

export const deleteRecurringSchedule = asyncHandler(
	async (req: Request, res: Response) => {
		await coachingScheduleService.deleteRecurring(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Schedule deleted successfully" });
	},
);

// ── Schedule exceptions ──
export const createScheduleException = asyncHandler(
	async (req: Request, res: Response) => {
		const exception = await coachingScheduleService.createException(
			req.params.courseId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: exception });
	},
);

export const getScheduleExceptions = asyncHandler(
	async (req: Request, res: Response) => {
		const exceptions = await coachingScheduleService.getExceptionsByCourse(
			req.params.courseId,
		);
		res.status(200).json({ success: true, data: exceptions });
	},
);

export const deleteScheduleException = asyncHandler(
	async (req: Request, res: Response) => {
		await coachingScheduleService.deleteException(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Exception deleted successfully" });
	},
);

// ── Scheduled classes ──
export const createScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const sc = await coachingScheduleService.createScheduledClass(
			req.params.courseId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: sc });
	},
);

export const getScheduledClasses = asyncHandler(
	async (req: Request, res: Response) => {
		const { from, to } = req.query as any;
		const classes = await coachingScheduleService.getScheduledClassesByCourse(
			req.params.courseId,
			{ from, to },
		);
		res.status(200).json({ success: true, data: classes });
	},
);

export const getScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const sc = await coachingScheduleService.getScheduledClassById(
			req.params.id,
		);
		res.status(200).json({ success: true, data: sc });
	},
);

export const cancelScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		const { reason } = req.body;
		const sc = await coachingScheduleService.cancelScheduledClass(
			req.params.id,
			reason || "No reason provided",
			req,
		);
		res.status(200).json({ success: true, data: sc });
	},
);

export const deleteScheduledClass = asyncHandler(
	async (req: Request, res: Response) => {
		await coachingScheduleService.deleteScheduledClass(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Scheduled class deleted successfully" });
	},
);
