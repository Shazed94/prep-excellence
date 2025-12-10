import {
	createLMSCourseSchema,
	publishLMSCourseSchema,
	updateLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { toPublicUrl } from "@/utils/storageUrl";

/**
 * Create LMS Course
 * POST /api/lms/courses
 */
export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSCourseSchema.parse(req.body);

		const course = await prisma.lMSCourse.create({
			data: validated,
			include: {
				instructor: {
					include: { user: true },
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
 * Get All LMS Courses (with filters)
 * GET /api/lms/courses
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
		prisma.lMSCourse.findMany({
			where,
			include: {
				instructor: {
					include: { user: { select: { name: true, image: true } } },
				},
				_count: {
					select: { enrollments: true, reviews: true },
				},
			},
			skip: (Number(page) - 1) * Number(limit),
			take: Number(limit),
			orderBy: { createdAt: "desc" },
		}),
		prisma.lMSCourse.count({ where }),
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
 * Get Single LMS Course
 * GET /api/lms/courses/:id
 */
export const getCourse = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const course = await prisma.lMSCourse.findUnique({
		where: { id },
		include: {
			instructor: {
				include: { user: { select: { name: true, image: true, bio: true } } },
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

/**
 * Update LMS Course
 * PATCH /api/lms/courses/:id
 */
export const updateCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSCourseSchema.parse(req.body);

		const course = await prisma.lMSCourse.update({
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
 * PATCH /api/lms/courses/:id/publish
 */
export const publishCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { isPublished } = publishLMSCourseSchema.parse(req.body);

		const course = await prisma.lMSCourse.update({
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
 * Delete LMS Course
 * DELETE /api/lms/courses/:id
 */
export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await prisma.lMSCourse.delete({
			where: { id },
		});

		res.json({
			success: true,
			message: "Course deleted successfully",
		});
	},
);
