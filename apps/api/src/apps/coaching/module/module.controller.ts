import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { coachingModuleService } from "./module.service";

export const createModule = asyncHandler(
	async (req: Request, res: Response) => {
		const module = await coachingModuleService.create(
			req.params.courseId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: module });
	},
);

export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const modules = await coachingModuleService.list(req.params.courseId);
	res.status(200).json({ success: true, data: modules });
});

export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const mod = await coachingModuleService.update(
			req.params.id,
			req.body,
			req,
		);
		res.status(200).json({ success: true, data: mod });
	},
);

export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		await coachingModuleService.delete(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Module deleted successfully" });
	},
);
