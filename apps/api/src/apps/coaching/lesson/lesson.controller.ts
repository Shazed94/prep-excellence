import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { coachingLessonService } from "./lesson.service";

export const createLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const lesson = await coachingLessonService.create(
			req.params.moduleId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: lesson });
	},
);

export const getLessons = asyncHandler(async (req: Request, res: Response) => {
	const result = await coachingLessonService.list(req.params.moduleId);
	res
		.status(200)
		.json({ success: true, data: result.lessons, courseId: result.courseId });
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
	const lesson = await coachingLessonService.getById(req.params.id);
	res.status(200).json({ success: true, data: lesson });
});

export const updateLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const lesson = await coachingLessonService.update(
			req.params.id,
			req.body,
			req,
		);
		res.status(200).json({ success: true, data: lesson });
	},
);

export const deleteLesson = asyncHandler(
	async (req: Request, res: Response) => {
		await coachingLessonService.delete(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Lesson deleted successfully" });
	},
);
