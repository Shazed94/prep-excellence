import {
	publishCoachingCourseSchema,
	ZCreateCourseSchema,
	ZQueryParams,
	ZUpdateCourseSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere, castFilterValue } from "@/utils/filters";
import { toPublicUrl } from "@/utils/storageUrl";

function parseFormDataBody(body: Record<string, unknown>) {
	const data = { ...body };

	// Parse numeric fields
	for (const field of [
		"duration",
		"capacity",
		"regular_price",
		"offer_price",
	] as const) {
		if (typeof data[field] === "string") {
			data[field] = Number(data[field]);
		}
	}

	// Parse date field
	if (typeof data.startDate === "string") {
		data.startDate = new Date(data.startDate);
	}

	// Parse JSON array/object fields
	for (const field of ["tags", "schedule"] as const) {
		if (typeof data[field] === "string") {
			try {
				data[field] = JSON.parse(data[field] as string);
			} catch {
				data[field] = field === "tags" ? [] : [];
			}
		}
	}

	return data;
}

export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const bodyData = parseFormDataBody(req.body ?? {});
		const validated = ZCreateCourseSchema.parse(bodyData);
		const createdById = req.user?.id;

		if (!createdById) {
			throw new AppError("User not authenticated", 401);
		}

		const slug = validated.title.toLowerCase().replaceAll(" ", "-");

		// Handle file uploads
		const files = req.files as
			| { [fieldname: string]: Express.Multer.File[] }
			| undefined;

		let thumbnailPath: string | undefined;
		let videoPath: string | undefined;

		if (files?.thumbnail?.[0]) {
			thumbnailPath = `coaching-courses/${generateFileName(files.thumbnail[0].originalname, "thumbnail")}`;
			await minioService.uploadFile(
				thumbnailPath,
				files.thumbnail[0].buffer,
				files.thumbnail[0].mimetype,
			);
		}

		if (files?.video?.[0]) {
			videoPath = `coaching-courses/${generateFileName(files.video[0].originalname, "video")}`;
			await minioService.uploadFile(
				videoPath,
				files.video[0].buffer,
				files.video[0].mimetype,
			);
		}

		const course = await prisma.coachingCourse.create({
			data: {
				title: validated.title,
				startDate: validated.startDate,
				regular_price: validated.regular_price,
				offer_price: validated.offer_price,
				capacity: validated.capacity,
				thumbnail: thumbnailPath ?? validated.thumbnail,
				video: videoPath ?? validated.video,
				category_s: validated.category_s,
				level: validated.level,
				tags: validated.tags,
				sortDescription: validated.sortDescription,
				longDescription: validated.longDescription,
				schedule: validated.schedule,
				duration: validated.duration,
				slug,
				createdById,
			},
			include: {
				createdBy: {
					select: { name: true, image: true },
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingCourse",
			entityId: course.id,
			description: `Coaching course created: ${course.title}`,
			performedById: createdById,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.status(201).json({
			success: true,
			message: "Course created successfully",
			data: {
				...course,
				thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
			},
		});
	},
);

export const updateCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const bodyData = parseFormDataBody(req.body ?? {});
		const validated = ZUpdateCourseSchema.parse(bodyData);

		// Handle file uploads
		const files = req.files as
			| { [fieldname: string]: Express.Multer.File[] }
			| undefined;

		const updateData: Record<string, unknown> = { ...validated };

		if (files?.thumbnail?.[0]) {
			const thumbnailPath = `coaching-courses/${generateFileName(files.thumbnail[0].originalname, "thumbnail")}`;
			await minioService.uploadFile(
				thumbnailPath,
				files.thumbnail[0].buffer,
				files.thumbnail[0].mimetype,
			);
			updateData.thumbnail = thumbnailPath;
		}

		if (files?.video?.[0]) {
			const videoPath = `coaching-courses/${generateFileName(files.video[0].originalname, "video")}`;
			await minioService.uploadFile(
				videoPath,
				files.video[0].buffer,
				files.video[0].mimetype,
			);
			updateData.video = videoPath;
		}

		const course = await prisma.coachingCourse.update({
			where: { id },
			data: updateData,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingCourse",
			entityId: id,
			description: `Coaching course updated: ${course.title}`,
			performedById: req.user?.id,
		});

		// Invalidate coaching courses cache
		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			data: {
				...course,
				thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
			},
		});
	},
);

export const publishCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { isPublished } = publishCoachingCourseSchema.parse(req.body);

		const course = await prisma.coachingCourse.update({
			where: { id },
			data: {
				isPublished,
				publishedAt: isPublished ? new Date() : null,
			},
		});

		await createAuditLogFromRequest(req, {
			action: isPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			module: "CoachingCourse",
			entityId: id,
			description: `Coaching course ${isPublished ? "published" : "unpublished"}: ${course.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			data: course,
		});
	},
);

export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const course = await prisma.coachingCourse.findUnique({
			where: { id },
			select: { id: true, title: true },
		});
		if (!course) {
			throw new AppError("Course not found", 404);
		}

		await prisma.coachingCourse.delete({
			where: { id },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingCourse",
			entityId: id,
			description: `Coaching course deleted: ${course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern("coaching-courses:*");

		return res.json({
			success: true,
			message: "Course deleted successfully",
		});
	},
);

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);

	const skip = (page - 1) * limit;

	const cacheKey = `coaching-courses:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

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

	const ALLOWED_FILTERS = ["category", "level", "isPublished"];
	const where = buildWhere(filters, ALLOWED_FILTERS);

	// Uppercase level to match Prisma DIFFICULTY_LEVEL enum
	if (where.level) {
		where.level = (where.level as string).toUpperCase();
	}

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ sortDescription: { contains: search, mode: "insensitive" } },
			{ longDescription: { contains: search, mode: "insensitive" } },
		];
	}

	if (filters?.isPublished !== undefined) {
		where.isPublished = castFilterValue(filters.isPublished);
	}

	const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

	const [courses, total] = await Promise.all([
		prisma.coachingCourse.findMany({
			where,
			skip,
			take: limit,
			orderBy: orderClause,
		}),
		prisma.coachingCourse.count({ where }),
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

	const data = courses.map((course) => ({
		...course,
		thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		video: course.video ? toPublicUrl(course.video) : null,
	}));

	await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

	return res.status(200).json({
		success: true,
		data,
		pagination,
	});
});

export const getPublishedCourses = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const cacheKey = `coaching-courses-published:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Published courses fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS = ["category", "level"];
		const where = buildWhere(filters, ALLOWED_FILTERS);
		where.isPublished = true;

		// Uppercase level to match Prisma DIFFICULTY_LEVEL enum
		if (where.level) {
			where.level = (where.level as string).toUpperCase();
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ sortDescription: { contains: search, mode: "insensitive" } },
				{ longDescription: { contains: search, mode: "insensitive" } },
			];
		}

		let orderClause: any;

		if (sortBy === "_count") {
			// For sorting by relation count (e.g., enrollments)
			orderClause = {
				enrollments: {
					_count: orderBy,
				},
			};
		} else {
			// For regular field sorting
			orderClause = { [sortBy]: orderBy };
		}

		const [courses, total] = await Promise.all([
			prisma.coachingCourse.findMany({
				where,
				skip,
				take: limit,
				orderBy: orderClause,
				include: {
					createdBy: {
						select: { name: true, image: true },
					},
					_count: {
						select: { enrollments: true },
					},
				},
			}),
			prisma.coachingCourse.count({ where }),
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

		const data = courses.map((course) => ({
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
			video: course.video ? toPublicUrl(course.video) : null,
		}));

		await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

		return res.status(200).json({
			success: true,
			data,
			pagination,
		});
	},
);

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const course = await prisma.coachingCourse.findUnique({
		where: { id },
		include: {
			createdBy: {
				select: { name: true, image: true },
			},
			modules: {
				orderBy: { orderIndex: "asc" },
				include: {
					topics: {
						orderBy: { orderIndex: "asc" },
						include: {
							contents: { orderBy: { orderIndex: "asc" } },
						},
					},
					instructor: {
						select: {
							role: true,
							experienceYears: true,
							subjects: true,
							user: { select: { name: true, image: true } },
						},
					},
				},
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
			instructor: course.modules[0]?.instructor
				? {
						...course.modules[0].instructor,
						user: {
							...course.modules[0].instructor.user,
							image: course.modules[0].instructor.user.image
								? toPublicUrl(course.modules[0].instructor.user.image)
								: null,
						},
					}
				: null,
			video: course.video ? toPublicUrl(course.video) : null,
		},
	});
});

export const getPopularCourses = asyncHandler(async (_, res: Response) => {
	const courses = await prisma.coachingCourse.findMany({
		where: { isPublished: true },
		orderBy: {
			enrollments: {
				_count: "desc",
			},
		},
		take: 5,
		include: {
			createdBy: {
				select: { name: true, image: true },
			},
			_count: {
				select: { enrollments: true },
			},
		},
	});

	const data = courses.map((course) => ({
		...course,
		thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		video: course.video ? toPublicUrl(course.video) : null,
	}));

	res.json({
		success: true,
		data,
	});
});
