import {
	publishCoachingCourseSchema,
	updateCoachingCourseSchema,
	ZCreateCourseSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere, castFilterValue } from "@/utils/filters";
import { toPublicUrl } from "@/utils/storageUrl";
/**
 * Create Coaching Course
 * POST /api/coaching/courses
 */
export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = ZCreateCourseSchema.parse(req.body);
		console.log(validated);
		const createdById = req.user?.id;

		if (!createdById) {
			throw new AppError("User not authenticated", 401);
		}
		const slug = validated.title.toLowerCase().replaceAll(" ", "-");

		const course = await prisma.coachingCourse.create({
			data: {
				title: validated.title,
				startDate: validated.startDate,
				price: validated.price,
				capacity: validated.capacity,
				thumbnail: validated.thumbnail,
				category: validated.category,
				level: validated.level,
				tags: validated.tags,
				sortDescription: validated.short_description,
				longDescription: validated.long_description,
				schedule: validated.sessions,
				duration: validated.durationDays,
				slug,
				createdById,
			},
			include: {
				createdBy: {
					select: { name: true, image: true },
				},
			},
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

/**
 * Get All Coaching Courses
 * GET /api/coaching/courses
 */
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
	}));

	await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

	return res.status(200).json({
		success: true,
		data,
		pagination,
	});
});

/**
 * Get Single Coaching Course
 * GET /api/coaching/courses/:id
 */
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
		},
	});
});

/**
 * Update Coaching Course
 * PATCH /api/coaching/courses/:id
 */
export const updateCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateCoachingCourseSchema.parse(req.body);

		const course = await prisma.coachingCourse.update({
			where: { id },
			data: validated,
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

/**
 * Publish/Unpublish Course
 * PATCH /api/coaching/courses/:id/publish
 */
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

		// Invalidate coaching courses cache
		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			data: course,
		});
	},
);

/**
 * Delete Coaching Course
 * DELETE /api/coaching/courses/:id
 */
export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.coachingCourse.delete({
			where: { id },
		});

		// Invalidate coaching courses cache
		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			message: "Course deleted successfully",
		});
	},
);
