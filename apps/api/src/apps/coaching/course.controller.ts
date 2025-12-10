import {
	createCoachingCourseSchema,
	publishCoachingCourseSchema,
	updateCoachingCourseSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { toPublicUrl } from "@/utils/storageUrl";

/**
 * Create Coaching Course
 * POST /api/coaching/courses
 */
export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createCoachingCourseSchema.parse(req.body);
		const createdById = req.user?.id;

		if (!createdById) {
			throw new AppError("User not authenticated", 401);
		}

		const course = await prisma.coachingCourse.create({
			data: {
				...validated,
				createdById,
			},
			include: {
				createdBy: {
					select: { name: true, image: true },
				},
			},
		});

		res.status(201).json({
			success: true,
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
	const {
		category,
		level,
		instructorId,
		isPublished,
		search,
		page = 1,
		limit = 20,
	} = req.query;

	const where: any = {};

	if (category) where.category = category;
	if (level) where.level = level;
	if (instructorId) where.instructorId = instructorId;
	if (isPublished !== undefined) where.isPublished = isPublished === "true";
	if (search) {
		where.OR = [
			{ title: { contains: search as string, mode: "insensitive" } },
			{ description: { contains: search as string, mode: "insensitive" } },
		];
	}

	const [courses, total] = await Promise.all([
		prisma.coachingCourse.findMany({
			where,
			include: {
				instructor: {
					include: { user: { select: { name: true, image: true } } },
				},
				_count: {
					select: { enrollments: true },
				},
			},
			skip: (Number(page) - 1) * Number(limit),
			take: Number(limit),
			orderBy: { createdAt: "desc" },
		}),
		prisma.coachingCourse.count({ where }),
	]);

	res.json({
		success: true,
		data: courses.map((course) => ({
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		})),
		pagination: {
			page: Number(page),
			limit: Number(limit),
			total,
			totalPages: Math.ceil(total / Number(limit)),
		},
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
			instructor: {
				include: { user: { select: { name: true, image: true, bio: true } } },
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

		res.json({
			success: true,
			message: "Course deleted successfully",
		});
	},
);
