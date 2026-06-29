import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { lmsReviewService } from "./review.service";

export const createReview = asyncHandler(
	async (req: Request, res: Response) => {
		const review = await lmsReviewService.create(req.body, req.user!.id, req);
		res.status(201).json({ success: true, data: review });
	},
);

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit } = req.query as any;
	const result = await lmsReviewService.list(
		req.params.courseId,
		page ? Number(page) : 1,
		limit ? Number(limit) : 10,
	);
	res.status(200).json({ success: true, ...result });
});

export const updateReview = asyncHandler(
	async (req: Request, res: Response) => {
		const review = await lmsReviewService.update(
			req.params.id,
			req.body,
			req.user!.id,
			req,
		);
		res.status(200).json({ success: true, data: review });
	},
);

export const deleteReview = asyncHandler(
	async (req: Request, res: Response) => {
		await lmsReviewService.delete(req.params.id, req.user!.id, req);
		res
			.status(200)
			.json({ success: true, message: "Review deleted successfully" });
	},
);
