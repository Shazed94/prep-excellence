import {
	createTeacherProfileSchema,
	updateTeacherProfileSchema,
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
		console.log("teacherIdddddddddddddddddddddddddddddddddd", teacherId);

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
 * Get Own Teacher Profile (JWT-based, no teacherId param)
 * GET /api/onetoone/teachers/me
 */
export const getMyTeacherProfile = asyncHandler(
	async (req: Request, res: Response) => {
		const teacherId = req.user?.teacher?.id;
		if (!teacherId) {
			throw new AppError("Teacher profile not found for this user", 404);
		}

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
				_count: { select: { reviews: true, availabilities: true } },
			},
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		res.json({ success: true, data: profile });
	},
);

/**
 * Search Teachers
 * GET /api/onetoone/teachers
 */
export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
	const page = Math.max(1, Number(req.query.page) || 1);
	const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
	const search = (req.query.search as string | undefined)?.trim() || undefined;
	const sortBy = (req.query.sortBy as string) || "createdAt";
	const orderBy = (req.query.orderBy as string) || "desc";

	// filters arrives as JSON string e.g. '{"isAvailable":true}'
	let rawFilters: Record<string, unknown> = {};
	try {
		if (req.query.filters) {
			rawFilters = JSON.parse(req.query.filters as string);
		}
	} catch {
		rawFilters = {};
	}

	// ── Build where ─────────────────────────────────────────────────────────
	const where: Prisma.TeacherProfileWhereInput = {};

	// isAvailable — coerce both boolean and stringified boolean
	if ("isAvailable" in rawFilters) {
		const val = rawFilters.isAvailable;
		if (val === true || val === "true") where.isAvailable = true;
		else if (val === false || val === "false") where.isAvailable = false;
	}

	// numeric scalar filters
	for (const field of [
		"rating",
		"onlineHourlyRate",
		"offlineHourlyRate",
	] as const) {
		if (field in rawFilters) {
			const val = Number(rawFilters[field]);
			if (!Number.isNaN(val)) {
				(where as Record<string, unknown>)[field] = val;
			}
		}
	}

	// search: user name OR specialization subject
	if (search) {
		where.OR = [
			{
				teacher: {
					user: { name: { contains: search, mode: "insensitive" } },
				},
			},
			{
				specializations: {
					some: { subject: { contains: search, mode: "insensitive" } },
				},
			},
		];
	}

	// ── Sort guard ──────────────────────────────────────────────────────────
	const ALLOWED_SORT = new Set([
		"createdAt",
		"rating",
		"onlineHourlyRate",
		"offlineHourlyRate",
		"totalSessions",
		"totalReviews",
	]);
	const safeSortBy = ALLOWED_SORT.has(sortBy) ? sortBy : "createdAt";
	const safeOrderBy: "asc" | "desc" = orderBy === "asc" ? "asc" : "desc";

	// ── Cache ───────────────────────────────────────────────────────────────
	const cacheKey = [
		"teachers",
		`search=${search ?? ""}`,
		`filters=${JSON.stringify(rawFilters)}`,
		`sortBy=${safeSortBy}`,
		`orderBy=${safeOrderBy}`,
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

	// ── Query ───────────────────────────────────────────────────────────────
	const [teachers, total] = await Promise.all([
		prisma.teacherProfile.findMany({
			where,
			select: {
				id: true,
				teacherId: true,
				rating: true,
				totalSessions: true,
				totalReviews: true,
				onlineHourlyRate: true,
				offlineHourlyRate: true,
				isAvailable: true,
				timezone: true,
				responseTime: true,
				specializations: true,
				availabilities: true,
				teacher: {
					select: {
						bio: true,
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
			orderBy: { [safeSortBy]: safeOrderBy },
			skip: (page - 1) * limit,
			take: limit,
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
	});
});
