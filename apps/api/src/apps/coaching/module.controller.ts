import {
	createCoachingModuleSchema,
	updateCoachingModuleSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export const createModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const validated = createCoachingModuleSchema.parse(req.body);

		// Destructure to separate relation fields from the rest
		const { courseId: _courseId, instructorId, ...data } = validated;

		if (!instructorId) {
			throw new AppError("Instructor is required to create a module", 400);
		}

		const module = await prisma.coachingModule.create({
			data: {
				...data,
				course: { connect: { id: courseId } },
				instructor: { connect: { id: instructorId } },
			},
		});
		await invalidateCachePattern("coaching-courses:*");

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingModule",
			entityId: module.id,
			description: `Coaching module created: ${module.title}`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: module,
		});
	},
);

export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateCoachingModuleSchema.parse(req.body);

		// Destructure instructorId to use relation syntax (required by Prisma 7)
		const { instructorId, ...rest } = validated as any;

		const module = await prisma.coachingModule.update({
			where: { id },
			data: {
				...rest,
				...(instructorId !== undefined
					? { instructor: { connect: { id: instructorId } } }
					: {}),
			},
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingModule",
			entityId: id,
			description: `Coaching module updated: ${module.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			data: module,
		});
	},
);

export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const module = await prisma.coachingModule.findUnique({
			where: { id },
			select: { id: true, title: true },
		});
		if (!module) {
			throw new AppError("Module not found", 404);
		}

		await prisma.coachingModule.delete({
			where: { id },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingModule",
			entityId: id,
			description: `Coaching module deleted: ${module.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			message: "Module deleted successfully",
		});
	},
);

export const getModule = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const module = await prisma.coachingModule.findUnique({
		where: { id },
	});

	if (!module) {
		throw new AppError("Module not found", 404);
	}

	res.json({
		success: true,
		data: module,
	});
});

export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.params;
	// const { enrollmentId } = req.query;

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

	// if (enrollmentId) {
	// 	const enrollment = await prisma.coachingEnrollment.findUnique({
	// 		where: { id: enrollmentId as string },
	// 		include: {
	// 			paymentPlan: true,
	// 		},
	// 	});

	// 	if (!enrollment) {
	// 		throw new AppError("Enrollment not found", 404);
	// 	}

	// 	const unlockedPercent = enrollment.paymentPlan?.unlockedPercent || 0;

	// 	const modulesWithUnlockStatus = modules.map((module) => {
	// 		const isUnlocked = unlockedPercent >= module.unlockAtPercent;
	// 		return { ...module, isUnlocked };
	// 	});

	// 	return res.json({
	// 		success: true,
	// 		data: modulesWithUnlockStatus,
	// 		unlockedPercent,
	// 	});
	// }

	return res.json({
		success: true,
		data: modules,
	});
});
