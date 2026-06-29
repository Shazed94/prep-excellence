import type { Request, Response } from "express";
import { progressService } from "@/apps/shared/services/progress.service";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

export const getCourseProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		const progress = await progressService.getCourseProgress(
			req.params.courseId,
			user.id,
		);
		res.status(200).json({ success: true, data: progress });
	},
);

export const getLessonProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		const progress = await progressService.getLessonProgress(
			req.params.lessonId,
			user.id,
		);
		res.status(200).json({ success: true, data: progress });
	},
);

export const updateProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		const result = await progressService.updateLessonProgress({
			lessonId: req.params.lessonId,
			studentId: user.id,
			...req.body,
		});
		res.status(200).json({ success: true, data: result });
	},
);
