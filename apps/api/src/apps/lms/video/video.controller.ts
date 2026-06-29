import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { lmsVideoService } from "./video.service";

export const createVideo = asyncHandler(async (req: Request, res: Response) => {
	const video = await lmsVideoService.create(
		req.params.lessonId,
		req.body,
		req,
	);
	res.status(201).json({ success: true, data: video });
});

export const getVideoByLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const video = await lmsVideoService.getByLesson(req.params.lessonId);
		res.status(200).json({ success: true, data: video });
	},
);

export const getVideo = asyncHandler(async (req: Request, res: Response) => {
	const video = await lmsVideoService.getById(req.params.id);
	res.status(200).json({ success: true, data: video });
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
	const video = await lmsVideoService.update(req.params.id, req.body, req);
	res.status(200).json({ success: true, data: video });
});

export const updateVideoStatus = asyncHandler(
	async (req: Request, res: Response) => {
		const { status, errorMessage } = req.body;
		const video = await lmsVideoService.updateStatus(
			req.params.id,
			status,
			errorMessage,
		);
		res.status(200).json({ success: true, data: video });
	},
);

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
	await lmsVideoService.delete(req.params.id, req);
	res
		.status(200)
		.json({ success: true, message: "Video deleted successfully" });
});
