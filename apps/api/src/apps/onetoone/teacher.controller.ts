import {
	createTeacherProfileSchema,
	updateTeacherProfileSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/client";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildFiltersWithSearch } from "@/utils/typeSafeFilters";

/**
 * Create Teacher Profile
 * POST /api/onetoone/teachers/profile
 */
export const createTeacherProfile = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createTeacherProfileSchema.parse(req.body);
		const teacherId = req.user?.teacher?.id;

		if (!teacherId) {
			throw new AppError("Teacher profile not found", 403);
		}

		// Check if teacher already has a profile
		const existing = await prisma.teacherProfile.findUnique({
			where: { teacherId },
		});

		if (existing) {
			throw new AppError("Teacher profile already exists", 409);
		}

		const { specializations, ...profileData } = validated;

		const profile = await prisma.teacherProfile.create({
			data: {
				...profileData,
				teacherId,
				specializations: {
					create: specializations,
				},
			},
			include: {
				teacher: {
					include: {
						user: { select: { name: true, image: true, email: true } },
					},
				},
				specializations: true,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "TeacherProfile",
			entityId: profile.id,
			description: `Teacher profile created`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("teachers:*");

		res.status(201).json({
			success: true,
			data: profile,
		});
	},
);

/**
 * Get Teacher Profile
 * GET /api/onetoone/teachers/:teacherId/profile
 */
export const getTeacherProfile = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;

		const profile = await prisma.teacherProfile.findUnique({
			where: { teacherId },
			include: {
				teacher: {
					include: {
						user: { select: { name: true, image: true, email: true } },
					},
				},
				specializations: true,
				availabilities: true,
				_count: {
					select: { reviews: true },
				},
			},
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		res.json({
			success: true,
			data: profile,
		});
	},
);

/**
 * Update Teacher Profile
 * PATCH /api/onetoone/teachers/:teacherId/profile
 */
export const updateTeacherProfile = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;
		const validated = updateTeacherProfileSchema.parse(req.body);

		// Exclude specializations as it requires special Prisma syntax
		const { specializations: _specializations, ...updateData } = validated;

		const profile = await prisma.teacherProfile.update({
			where: { teacherId },
			data: {
				...updateData,

				specializations: {
					deleteMany: {},
					create: _specializations,
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "TeacherProfile",
			entityId: profile.id,
			description: `Teacher profile updated`,
			performedById: req.user?.id,
		});

		// Invalidate teacher search cache
		await invalidateCachePattern("teachers:*");

		res.json({
			success: true,
			data: profile,
		});
	},
);

/**
 * Search Teachers
 * GET /api/onetoone/teachers
 */
export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
	const validated = ZQueryParams.parse(req.query);
	const { search, filters, page = 1, limit = 20, orderBy, sortBy } = validated;

	const cacheKey = [
		"teachers",
		`search=${search ?? ""}`,
		`filters=${JSON.stringify(filters ?? {})}`,
		`orderBy=${orderBy ?? ""}`,
		`sortBy=${sortBy ?? ""}`,
		`page=${page}`,
		`limit=${limit}`,
	].join(":");

	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		return res.status(200).json({
			success: true,
			message: "Teachers fetched successfully (from cache)",
			data: parsed.data,
			pagination: parsed.pagination,
		});
	}

	const ALLOWED_FILTERS: Array<keyof Prisma.TeacherProfileWhereInput> = [
		"rating",
		"isAvailable",
		"onlineHourlyRate",
		"offlineHourlyRate",
		"specializations",
	];
	const where = buildFiltersWithSearch<Prisma.TeacherProfileWhereInput>(
		filters,
		ALLOWED_FILTERS,
		search,
		["specializations"],
	);

	const orderClause: Prisma.TeacherProfileOrderByWithRelationInput = {
		[sortBy]: orderBy,
	};

	const [teachers, total] = await Promise.all([
		prisma.teacherProfile.findMany({
			where,
			select: {
				bio: true,
				availabilities: true,
				teacher: {
					select: {
						subjects: true,
						qualifications: true,
						experienceYears: true,
						certifications: true,
						user: {
							select: {
								name: true,
								image: true,
								email: true,
								phone: true,
							},
						},
					},
				},
			},

			skip: (page - 1) * limit,
			take: limit,
			orderBy: orderClause,
		}),
		prisma.teacherProfile.count({ where }),
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
		JSON.stringify({ data: teachers, pagination }),
		60,
	);

	return res.json({
		success: true,
		data: teachers,
		pagination,
		ulala: 44,
	});
});
