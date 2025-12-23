import { updateCoachingModuleSchema } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Create Coaching Module
 * POST /api/coaching/courses/:courseId/modules
 */
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export const createModule = asyncHandler(
	async (req: Request, res: Response) => {
		console.log("createModule", req.body);
		// const { courseId } = req.params;
		// const validated = createCoachingModuleSchema.parse(req.body);

		// const module = await prisma.coachingModule.create({
		// 	data: {
		// 		...validated,
		// 		courseId,

		// 	},
		// });

		await invalidateCachePattern("coaching-courses:*");

		res.status(201).json({
			success: true,
			data: [],
		});
	},
); /**
 * Get Modules for Course (with unlock status)
 * GET /api/coaching/courses/:courseId/modules
 */
export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.params;
	const { enrollmentId } = req.query;

	const modules = await prisma.coachingModule.findMany({
		where: { courseId },
		orderBy: { orderIndex: "asc" },
		include: {
			topics: {
				orderBy: { orderIndex: "asc" },
				select: {
					id: true,
					title: true,
					orderIndex: true,
				},
			},
		},
	});

	// If enrollmentId provided, check unlock status based on payment progress
	if (enrollmentId) {
		const enrollment = await prisma.coachingEnrollment.findUnique({
			where: { id: enrollmentId as string },
			include: {
				paymentPlan: true,
			},
		});

		if (!enrollment) {
			throw new AppError("Enrollment not found", 404);
		}

		const unlockedPercent = enrollment.paymentPlan?.unlockedPercent || 0;

		const modulesWithUnlockStatus = modules.map((module) => {
			const isUnlocked = unlockedPercent >= module.unlockAtPercent;
			return { ...module, isUnlocked };
		});

		return res.json({
			success: true,
			data: modulesWithUnlockStatus,
			unlockedPercent,
		});
	}

	// Without enrollmentId, return all modules
	return res.json({
		success: true,
		data: modules,
	});
});

/**
 * Update Coaching Module
 * PATCH /api/coaching/modules/:id
 */
export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateCoachingModuleSchema.parse(req.body);

		const module = await prisma.coachingModule.update({
			where: { id },
			data: validated,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			data: module,
		});
	},
); /**
 * Delete Coaching Module
 * DELETE /api/coaching/modules/:id
 */
export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.coachingModule.delete({
			where: { id },
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			message: "Module deleted successfully",
		});
	},
);
