import { updateLMSProgressSchema } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { enrollmentService, progressService } from "@/apps/shared/services";
import { asyncHandler } from "@/utils/asyncHandler";

export const getCourseProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const progress = await progressService.getCourseProgress(
			req.params.courseId,
			req.user!.id,
		);
		res.status(200).json({ success: true, data: progress });
	},
);

export const getLessonProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const progress = await progressService.getLessonProgress(
			req.params.lessonId,
			req.user!.id,
		);
		res.status(200).json({ success: true, data: progress });
	},
);

export const updateProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = updateLMSProgressSchema.parse(req.body);
		const progress = await progressService.updateLessonProgress({
			lessonId: req.params.lessonId,
			studentId: req.user!.id,
			...validated,
		});

		// Recalculate overall course progress
		const enrollment = await enrollmentService.getByCourseAndStudent(
			req.body.courseId ?? req.params.courseId,
			req.user!.id,
		);
		if (enrollment) {
			await progressService.recalculateCourseProgress(
				enrollment.id,
				req.body.courseId ?? req.params.courseId,
				req.user!.id,
			);
		}

		res.status(200).json({ success: true, data: progress });
	},
);
