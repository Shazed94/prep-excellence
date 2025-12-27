import {
	createLMSModuleSchema,
	updateLMSModuleSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/client";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildCompleteWhere } from "@/utils/typeSafeFilters";

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

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSModule",
			entityId: module.id,
			description: `LMS Module created: ${validated.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern(`modules:${courseId}:*`);

		res.status(201).json({
			success: true,
			data: module,
		});
	},
);
export const getModules = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { courseId } = req.params;
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const cacheKey = `modules:${courseId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			res.status(200).json({
				success: true,
				message: "Modules fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
			return;
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.LMSModuleWhereInput> = [];
		const where = buildCompleteWhere<Prisma.LMSModuleWhereInput>(
			{ courseId },
			filters,
			ALLOWED_FILTERS,
			search,
			["title", "description"],
		);

		// Type-safe order by
		const orderClause: Prisma.LMSModuleOrderByWithRelationInput =
			sortBy === "orderIndex" ? { orderIndex: "asc" } : { [sortBy]: orderBy };

		const [modules, total] = await Promise.all([
			prisma.lMSModule.findMany({
				where,
				include: {
					lessons: {
						orderBy: { orderIndex: "asc" },
						select: {
							id: true,
							title: true,
							description: true,
							orderIndex: true,
							contentType: true,
							content: true,
							attachments: true,
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
				skip,
				take: limit,
				orderBy: orderClause,
			}),
			prisma.lMSModule.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const pagination = {
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		await cached.set(
			cacheKey,
			JSON.stringify({ data: modules, pagination }),
			60,
		);

		res.json({
			success: true,
			data: modules,
			pagination,
		});
	},
);

export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSModuleSchema.parse(req.body);

		const module = await prisma.lMSModule.update({
			where: { id },
			data: validated,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSModule",
			entityId: id,
			description: `LMS Module updated: ${validated.title || module.title}`,
			performedById: req.user?.id,
		});

		// Invalidate modules cache for this course
		await invalidateCachePattern(`modules:${module.courseId}:*`);

		res.json({
			success: true,
			data: module,
		});
	},
);

export const deleteModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const module = await prisma.lMSModule.findUnique({ where: { id } });
		if (module) {
			await prisma.lMSModule.delete({
				where: { id },
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.DELETE,
				module: "LMSModule",
				entityId: id,
				description: `LMS Module deleted: ${module.title}`,
				performedById: req.user?.id,
			});

			// Invalidate modules cache for this course
			await invalidateCachePattern(`modules:${module.courseId}:*`);
		}

		res.json({
			success: true,
			message: "Module deleted successfully",
		});
	},
);
