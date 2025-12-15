import {
	createLMSModuleSchema,
	updateLMSModuleSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere } from "@/utils/filters";

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

export const getModules = asyncHandler(async (req: Request, res: Response) => {
	const { id } = ZCuid.parse(req.params);
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);

	const skip = (page - 1) * limit;

	const cacheKey = `modules:${id}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		return res.status(200).json({
			success: true,
			message: "Modules fetched successfully (from cache)",
			data: parsed.data,
			pagination: parsed.pagination,
		});
	}

	const ALLOWED_FILTERS: string[] = [];
	const where = buildWhere(filters, ALLOWED_FILTERS);
	where.courseId = id;

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
		];
	}

	const orderClause: Record<string, "asc" | "desc"> =
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

	await cached.set(cacheKey, JSON.stringify({ data: modules, pagination }), 60);

	res.json({
		success: true,
		data: modules,
		pagination,
	});
});

export const updateModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSModuleSchema.parse(req.body);

		const module = await prisma.lMSModule.update({
			where: { id },
			data: validated,
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

			// Invalidate modules cache for this course
			await invalidateCachePattern(`modules:${module.courseId}:*`);
		}

		res.json({
			success: true,
			message: "Module deleted successfully",
		});
	},
);
