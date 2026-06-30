import {
	ZCCoachingModuleSchema,
	ZUCoachingModuleSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";


export const createModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const { title, description, orderIndex, teacherId} =
			ZCCoachingModuleSchema.parse(
				req.body,
			);

		const course = await prisma.course.findUnique({
			where: { id: courseId },
			select: { id: true, courseType: true, title: true },
		});
		if (!course) throw AppError.notFound("Course not found");
		if (course.courseType !== "COACHING") {
			throw AppError.badRequest("Not a Coaching course");
		}

		const existing = await prisma.courseModule.findUnique({
			where: { courseId_orderIndex: { courseId, orderIndex } },
		});
		if (existing) {
			throw AppError.badRequest(
				`Module with orderIndex ${orderIndex} already exists`,
			);
		}

		const module = await prisma.courseModule.create({
			data: {
				title,
				description,
				orderIndex,
				courseId,
				teacherId,
			},
			include: { lessons: true },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingModule",
			entityId: module.id,
			description: `Module created: ${title} in course ${course.title}`,
			performedById: req.user?.id,
		});


		res.status(201).json({ success: true, data: module });
	},
);



export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = ZUCoachingModuleSchema.parse(req.body);
		const {
			title,
			description,
			orderIndex,
			teacherId,
		} = validated;

		const mod = await prisma.courseModule.findUnique({ where: { id } });
		if (!mod) throw AppError.notFound("Module not found");

		if (orderIndex !== undefined && orderIndex !== mod.orderIndex) {
			const existing = await prisma.courseModule.findUnique({
				where: {
					courseId_orderIndex: {
						courseId: mod.courseId,
						orderIndex,
					},
				},
			});
			if (existing && existing.id !== id) {
				throw AppError.badRequest(
					`Module with orderIndex ${orderIndex} already exists`,
				);
			}
		}

		const data: Record<string, unknown> = {};
		if (title !== undefined) data.title = title;
		if (description !== undefined) data.description = description;
		if (orderIndex !== undefined) data.orderIndex = orderIndex;
		if (teacherId !== undefined) data.teacherId = teacherId;
		const updated = await prisma.courseModule.update({ where: { id }, data });

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingModule",
			entityId: id,
			description: `Module updated: ${updated.title}`,
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const mod = await prisma.courseModule.findUnique({ where: { id } });
		if (!mod) throw AppError.notFound("Module not found");

		await prisma.courseModule.update({
			where: { id },
			data: { isActive: false },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingModule",
			entityId: id,
			description: `Module deleted: ${mod.title}`,
			performedById: req.user?.id,
		});

		res.status(200).json({
			success: true,
			message: "Module deleted successfully",
		});
	},
);




export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.params;

	const modules = await prisma.courseModule.findMany({
		where: { courseId, isActive: true },
		orderBy: { orderIndex: "asc" },
		include: {
			lessons: {
				where: { isActive: true },
				orderBy: { orderIndex: "asc" },
				select: {
					id: true,
					title: true,
					orderIndex: true,
					lessonType: true,
				},
			},
			_count: { select: { lessons: true } },
		},
	});

	res.status(200).json({ success: true, data: modules });
});
