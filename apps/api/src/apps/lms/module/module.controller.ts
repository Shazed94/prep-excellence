import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { lmsModuleService } from "./module.service";

export const createModule = asyncHandler(
	async (req: Request, res: Response) => {
		const mod = await lmsModuleService.create(
			req.params.courseId,
			req.body,
			req,
		);
		res.status(201).json({ success: true, data: mod });
	},
);

export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const modules = await lmsModuleService.list(req.params.courseId);
	res.status(200).json({ success: true, data: modules });
});

export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const mod = await lmsModuleService.update(req.params.id, req.body, req);
		res.status(200).json({ success: true, data: mod });
	},
);

export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		await lmsModuleService.delete(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Module deleted successfully" });
	},
);
