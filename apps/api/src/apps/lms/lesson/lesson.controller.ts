import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { lmsLessonService } from "./lesson.service";

export const createLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const lesson = await lmsLessonService.create(
			req.params.moduleId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: lesson });
	},
);

export const getLessons = asyncHandler(async (req: Request, res: Response) => {
	const lessons = await lmsLessonService.list(req.params.moduleId);
	res.status(200).json({ success: true, data: lessons });
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
	const lesson = await lmsLessonService.getById(req.params.id);
	res.status(200).json({ success: true, data: lesson });
});

export const updateLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const lesson = await lmsLessonService.update(req.params.id, req.body, req);
		res.status(200).json({ success: true, data: lesson });
	},
);

export const deleteLesson = asyncHandler(
	async (req: Request, res: Response) => {
		await lmsLessonService.delete(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Lesson deleted successfully" });
	},
);
