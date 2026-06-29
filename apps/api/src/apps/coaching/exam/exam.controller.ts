import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { coachingExamService } from "./exam.service";

export const createExam = asyncHandler(async (req: Request, res: Response) => {
	const exam = await coachingExamService.create(req.body, req);
	res.status(201).json({ success: true, data: exam });
});

export const getExamByLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const exam = await coachingExamService.getByLesson(req.params.lessonId);
		res.status(200).json({ success: true, data: exam });
	},
);

export const getExam = asyncHandler(async (req: Request, res: Response) => {
	const exam = await coachingExamService.getById(req.params.id);
	res.status(200).json({ success: true, data: exam });
});

export const updateExam = asyncHandler(async (req: Request, res: Response) => {
	const exam = await coachingExamService.update(req.params.id, req.body, req);
	res.status(200).json({ success: true, data: exam });
});

export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
	await coachingExamService.delete(req.params.id, req);
	res.status(200).json({ success: true, message: "Exam deleted successfully" });
});

export const startAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const attempt = await coachingExamService.startAttempt(
			req.params.id,
			req.user!.id,
		);
		res.status(201).json({ success: true, data: attempt });
	},
);

export const submitAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const attempt = await coachingExamService.submitAttempt(
			req.params.attemptId,
			req.body.answers,
		);
		res.status(200).json({ success: true, data: attempt });
	},
);

export const getAttempts = asyncHandler(async (req: Request, res: Response) => {
	const attempts = await coachingExamService.getAttempts(req.params.id);
	res.status(200).json({ success: true, data: attempts });
});
