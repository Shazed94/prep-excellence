import {
	createLMSCourseSchema,
	publishLMSCourseSchema,
	updateLMSCourseSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/client";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import { toPublicUrl } from "@/utils/storageUrl";
import { buildFiltersWithSearch } from "@/utils/typeSafeFilters";

export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSCourseSchema.parse(req.body);

		const slug = validated.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		const existingCourse = await prisma.lMSCourse.findUnique({
			where: { slug },
		});
		if (existingCourse) {
			throw new AppError("A course with this title already exists", 400);
		}

		// Handle thumbnail upload
		let thumbnailPath: string | undefined;
		if (req.file) {
			const thumbnailKey = `lms-courses/${generateFileName(
				req.file.originalname,
				"thumbnail",
			)}`;
			await minioService.uploadFile(
				thumbnailKey,
				req.file.buffer,
				req.file.mimetype,
			);
			thumbnailPath = thumbnailKey;
		}

		const course = await prisma.lMSCourse.create({
			data: {
				...validated,
				slug,
				thumbnail: thumbnailPath,
			},
			include: {
				instructor: {
					include: { user: true },
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSCourse",
			entityId: course.id,
			description: `LMS Course created: ${validated.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("courses:*");

		res.status(201).json({
			success: true,
			data: {
				...course,
				thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
			},
		});
	},
);

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);
	const currentUser = req.user as UserWithRoleAndPermissions;

	const skip = (page - 1) * limit;

	const cacheKey = `courses:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}:userId=${currentUser?.id || "anon"}`;

	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		return res.status(200).json({
			success: true,
			message: "Courses fetched successfully (from cache)",
			data: parsed.data,
			pagination: parsed.pagination,
		});
	}

	const ALLOWED_FILTERS: Array<keyof Prisma.LMSCourseWhereInput> = [];
	const where = buildFiltersWithSearch<Prisma.LMSCourseWhereInput>(
		filters,
		ALLOWED_FILTERS,
		search,
		["title", "category", "description"],
	);

	const orderClause: Prisma.LMSCourseOrderByWithRelationInput = {
		[sortBy]: orderBy,
	};

	const [courses, total] = await Promise.all([
		prisma.lMSCourse.findMany({
			where,
			include: {
				instructor: {
					include: { user: { select: { name: true, image: true } } },
				},
				_count: { select: { enrollments: true, reviews: true } },
			},
			skip,
			take: limit,
			orderBy: orderClause,
		}),
		prisma.lMSCourse.count({ where }),
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

	await cached.set(cacheKey, JSON.stringify({ data: courses, pagination }), 60);

	return res.status(200).json({
		success: true,
		data: courses.map((course) => ({
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		})),
		pagination,
	});
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
	const { id } = ZCuid.parse(req.params);

	const course = await prisma.lMSCourse.findUnique({
		where: { id },
		include: {
			instructor: {
				include: { user: { select: { name: true, image: true } } },
			},
			modules: {
				orderBy: { orderIndex: "asc" },
				include: {
					lessons: { orderBy: { orderIndex: "asc" } },
					quizzes: { orderBy: { orderIndex: "asc" } },
				},
			},
			reviews: {
				include: {
					student: {
						include: { user: { select: { name: true, image: true } } },
					},
				},
				orderBy: { createdAt: "desc" },
				take: 10,
			},
			_count: {
				select: { enrollments: true },
			},
		},
	});

	if (!course) {
		throw new AppError("Course not found", 404);
	}

	res.json({
		success: true,
		data: {
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		},
	});
});

export const updateCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);
		const validated = updateLMSCourseSchema.parse(req.body);

		const course = await prisma.lMSCourse.update({
			where: { id },
			data: validated,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course updated: ${validated.title || course.title}`,
			performedById: req.user?.id,
		});

		// Invalidate courses cache
		await invalidateCachePattern("courses:*");

		res.json({
			success: true,
			message: "Course updated successfully",
			data: {
				...course,
				thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
			},
		});
	},
);

export const publishCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);
		const { isPublished } = publishLMSCourseSchema.parse(req.body);

		const course = await prisma.lMSCourse.update({
			where: { id },
			data: {
				isPublished,
				publishedAt: isPublished ? new Date() : null,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: isPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course ${isPublished ? "published" : "unpublished"}: ${course.title}`,
			performedById: req.user?.id,
		});

		// Invalidate courses cache
		await invalidateCachePattern("courses:*");

		res.json({
			success: true,
			message: `Course ${isPublished ? "published" : "unpublished"} successfully`,
			data: course,
		});
	},
);

export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);

		const course = await prisma.lMSCourse.findUnique({ where: { id } });
		if (!course) {
			throw new AppError("Course not found", 404);
		}

		await prisma.lMSCourse.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course deleted: ${course.title}`,
			performedById: req.user?.id,
		});

		// Invalidate courses cache
		await invalidateCachePattern("courses:*");

		res.json({
			success: true,
			message: "Course deleted successfully",
		});
	},
);
