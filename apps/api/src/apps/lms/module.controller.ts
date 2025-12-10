import {
	createLMSModuleSchema,
	updateLMSModuleSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Create LMS Module
 * POST /api/lms/courses/:courseId/modules
 */
export const createModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const validated = createLMSModuleSchema.parse(req.body);

		const module = await prisma.lMSModule.create({
			data: {
				...validated,
				courseId,
			},
		});

		res.status(201).json({
			success: true,
			data: module,
		});
	},
);

/**
 * Get Modules for Course
 * GET /api/lms/courses/:courseId/modules
 */
export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.params;

	const modules = await prisma.lMSModule.findMany({
		where: { courseId },
		orderBy: { orderIndex: "asc" },
		include: {
			lessons: {
				orderBy: { orderIndex: "asc" },
				select: {
					id: true,
					title: true,
					duration: true,
					isFree: true,
					orderIndex: true,
				},
			},
			quizzes: {
				orderBy: { orderIndex: "asc" },
				select: {
					id: true,
					title: true,
					orderIndex: true,
				},
			},
		},
	});

	res.json({
		success: true,
		data: modules,
	});
});

/**
 * Update LMS Module
 * PATCH /api/lms/modules/:id
 */
export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSModuleSchema.parse(req.body);

		const module = await prisma.lMSModule.update({
			where: { id },
			data: validated,
		});

		res.json({
			success: true,
			data: module,
		});
	},
);

/**
 * Delete LMS Module
 * DELETE /api/lms/modules/:id
 */
export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.lMSModule.delete({
			where: { id },
		});

		res.json({
			success: true,
			message: "Module deleted successfully",
		});
	},
);
