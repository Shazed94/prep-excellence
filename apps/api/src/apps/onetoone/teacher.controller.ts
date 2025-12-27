import {
	createTeacherProfileSchema,
	searchTeachersSchema,
	updateTeacherProfileSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
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
					select: { sessions: true, reviews: true },
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
			data: updateData,
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
 * GET /api/onetoone/teachers/search
 */
export const searchTeachers = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = searchTeachersSchema.parse(req.query);
		const {
			subject,
			level,
			minHourlyRate,
			maxHourlyRate,
			minRating,
			isAvailable,
			page = 1,
			limit = 20,
		} = validated;

		const cacheKey = `teachers:subject=${subject || ""}:level=${level || ""}:minHourlyRate=${minHourlyRate || ""}:maxHourlyRate=${maxHourlyRate || ""}:minRating=${minRating || ""}:isAvailable=${isAvailable || ""}:page=${page}:limit=${limit}`;

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

		const where: any = {
			isActive: true,
		};

		if (subject || level) {
			where.specializations = {
				some: {
					...(subject && {
						subject: { contains: subject, mode: "insensitive" },
					}),
					...(level && { level: level as any }), // Type assertion for enum
				},
			};
		}

		if (minHourlyRate !== undefined || maxHourlyRate !== undefined) {
			where.hourlyRate = {};
			if (minHourlyRate !== undefined) where.hourlyRate.gte = minHourlyRate;
			if (maxHourlyRate !== undefined) where.hourlyRate.lte = maxHourlyRate;
		}

		if (minRating !== undefined) {
			where.rating = { gte: minRating };
		}

		if (isAvailable) {
			where.availabilities = {
				some: {},
			};
		}

		const [teachers, total] = await Promise.all([
			prisma.teacherProfile.findMany({
				where,
				include: {
					teacher: {
						include: {
							user: { select: { name: true, image: true } },
						},
					},
					specializations: true,
					_count: {
						select: { sessions: true, reviews: true },
					},
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { rating: "desc" },
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
	},
);

/**
 * Add Teacher Specialization
 * POST /api/onetoone/teachers/:teacherId/specializations
 */
export const addSpecialization = asyncHandler(
	async (req: Request, res: Response) => {
		const { teacherId } = req.params;
		const { subject, level } = req.body;

		const profile = await prisma.teacherProfile.findUnique({
			where: { teacherId },
		});

		if (!profile) {
			throw new AppError("Teacher profile not found", 404);
		}

		const specialization = await prisma.teacherSpecialization.create({
			data: {
				profileId: profile.id,
				subject,
				level,
				// yearsOfExperience,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "TeacherSpecialization",
			entityId: specialization.id,
			description: `Added specialization: ${subject} - ${level}`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: specialization,
		});
	},
);

/**
 * Delete Teacher Specialization
 * DELETE /api/onetoone/specializations/:id
 */
export const deleteSpecialization = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.teacherSpecialization.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "TeacherSpecialization",
			entityId: id,
			description: `Deleted teacher specialization`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			message: "Specialization deleted successfully",
		});
	},
);
