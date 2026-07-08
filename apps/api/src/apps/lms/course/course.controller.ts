import {
	createLMSCourseSchema,
	publishLMSCourseSchema,
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
import { buildWhere } from "@/utils/filters";
import { toPublicUrl } from "@/utils/storageUrl";

const CACHE_TTL = 60;

export const userRole = async (requestUserId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: requestUserId },
		select: {
			role: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!user) {
		throw new AppError("User not authenticated", 401);
	}

	if (!user.role) {
		throw new AppError("User has no role assigned", 403);
	}

	return user.role.name;
};

export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSCourseSchema.parse(req.body);
		const createdById = req.user?.id;

		if (!createdById) {
			throw new AppError("User not authenticated", 401);
		}

		// Generate slug
		const slug = validated.title.toLowerCase().replaceAll(" ", "-");

		// Resolve teacherId from the authenticated user's teacher profile
		const teacherId =
			(req.user as any)?.teacher?.id ??
			(req.body as Record<string, string>)?.teacherId;

		if (!teacherId) {
			throw new AppError(
				"Teacher profile not found. Ensure you have a teacher account.",
				403,
			);
		}

		// Handle file upload — route uses uploadCourseThumbnail (single "thumbnail")
		let thumbnailPath: string | undefined;

		if (req.file) {
			thumbnailPath = `lms-courses/${generateFileName(
				req.file.originalname,
				"thumbnail",
			)}`;
			await minioService.uploadFile(
				thumbnailPath,
				req.file.buffer,
				req.file.mimetype,
			);
		}

		const course = await prisma.$transaction(async (tx) => {
			const created = await tx.course.create({
				data: {
					...validated,
					courseType: "LMS",
					thumbnail: thumbnailPath ?? validated.thumbnail,
					slug,
					createdById,
					teacherId,
				},
				include: {
					createdBy: { select: { id: true, name: true, image: true } },
					category: true,
				},
			});
			return created;
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSCourse",
			entityId: course.id,
			description: `LMS Course created: ${course.title}`,
			performedById: createdById,
		});

		await invalidateCachePattern("lms:courses:*");

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

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);
	const requestUserRole = await userRole(req.user!.id);

	const pg = page ? Number(page) : 1;
	const lim = limit ? Number(limit) : 10;
	const skip = (pg - 1) * lim;

	const cacheKey = `lms:courses:list:${pg}:${lim}:${sortBy || "createdAt"}:${orderBy || "desc"}:${search || ""}:${JSON.stringify(filters || {})}:true`;
	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		res.status(200).json(JSON.parse(cachedData));
		return;
	}

	const ALLOWED_FILTERS = ["categoryId", "level", "isPublished"];
	const where: Record<string, unknown> = buildWhere(filters, ALLOWED_FILTERS);

	where.courseType = "LMS";
	if (requestUserRole === "SuperAdmin") {
		// Admin has access to all courses, no additional filters needed
	} else if (requestUserRole === "Teacher") {
		where.teacherId = req.user?.teacher?.id;
	} else {
		throw new AppError("You do not have access to this resource", 403);
	}

	// Uppercase level to match Prisma DIFFICULTY_LEVEL enum
	if (where.level) {
		where.level = (where.level as string).toUpperCase();
	}

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ shortDescription: { contains: search, mode: "insensitive" } },
			{ longDescription: { contains: search, mode: "insensitive" } },
		];
	}

	const [courses, total] = await Promise.all([
		prisma.course.findMany({
			where,
			include: {
				createdBy: {
					select: { id: true, name: true, image: true },
				},
				category: true,
				_count: {
					select: {
						enrollments: true,
						reviews: true,
						courseModules: true,
					},
				},
			},
			skip,
			take: lim,
			orderBy: {
				[sortBy || "createdAt"]: (orderBy as "asc" | "desc") || "desc",
			},
		}),
		prisma.course.count({ where }),
	]);

	const totalPages = Math.ceil(total / lim);
	const result = {
		success: true,
		data: courses.map((c) => ({
			...c,
			thumbnail: c.thumbnail ? toPublicUrl(c.thumbnail) : null,
		})),
		pagination: {
			total,
			page: pg,
			limit: lim,
			totalPages,
			hasNext: pg < totalPages,
			hasPrev: pg > 1,
		},
	};

	await cached.set(cacheKey, JSON.stringify(result), CACHE_TTL);
	res.status(200).json(result);
});

export const getMyCourses = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user?.id;

		if (!userId) {
			throw new AppError("Unauthorized", 401);
		}

		const student = await prisma.student.findUnique({
			where: { userId },
			select: { id: true },
		});

		if (!student) {
			throw new AppError("Student profile not found", 404);
		}

		const enrollments = await prisma.enrollment.findMany({
			where: {
				studentId: student.id,
				course: {
					courseType: "LMS",
					isPublished: true,
				},
			},
			include: {
				course: {
					include: {
						_count: {
							select: {
								enrollments: true,
							},
						},
						courseProgress: {
							where: {
								studentId: student.id,
							},
							select: {
								progressPercent: true,
								lastActivityAt: true,
							},
						},
					},
				},
			},
			orderBy: {
				enrolledAt: "desc",
			},
		});

		const data = enrollments.map(({ course, ...enrollment }) => ({
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
			video: course.video ? toPublicUrl(course.video) : null,
			enrollment: {
				id: enrollment.id,
				enrolledAt: enrollment.enrolledAt,
				status: enrollment.status,
			},
		}));

		return res.status(200).json({
			success: true,
			data,
		});
	},
);

export const listTeachers = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search } = ZQueryParams.parse(
			req.query,
		);

		const skip = (page - 1) * limit;

		// Only allow sorting by valid teacher fields to prevent Prisma errors
		const ALLOWED_SORT_FIELDS = [
			"id",
			"experienceYears",
			"createdAt",
			"updatedAt",
		];
		const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
			? sortBy
			: "createdAt";
		const orderClause: Record<string, "asc" | "desc"> = {
			[safeSortBy]: orderBy,
		};

		const where: Prisma.TeacherWhereInput = {
			coursesCreated: {
				some: { courseType: "LMS", isActive: true },
			},
		};

		if (search) {
			where.AND = [
				{
					user: {
						name: { contains: search, mode: "insensitive" },
					},
				},
			];
		}

		const [teachers, total] = await Promise.all([
			prisma.teacher.findMany({
				where,
				skip,
				take: limit,
				orderBy: orderClause,
				include: {
					user: {
						select: {
							name: true,
							image: true,
							address: true,
							email: true,
							phone: true,
						},
					},
					_count: {
						select: { coursesCreated: true },
					},
				},
			}),
			prisma.teacher.count({ where }),
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

		const data = teachers.map((teacher) => ({
			...teacher,
			user: {
				name: teacher.user.name,
				image: teacher.user.image ? toPublicUrl(teacher.user.image) : null,
				address: teacher.user.address,
				email: teacher.user.email,
				phone: teacher.user.phone,
			},
		}));

		return res.status(200).json({
			success: true,
			data,
			pagination,
		});
	},
);

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
	const { id } = ZCuid.parse(req.params);

	const cacheKey = `lms:course:${id}`;
	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		res.status(200).json({ success: true, data: JSON.parse(cachedData) });
		return;
	}

	const course = await prisma.course.findUnique({
		where: { id, courseType: "LMS" },
		include: {
			createdBy: {
				select: { id: true, name: true, image: true },
			},
			category: true,
			courseModules: {
				where: { isActive: true },
				orderBy: { orderIndex: "asc" },
				include: {
					lessons: {
						where: { isActive: true },
						orderBy: { orderIndex: "asc" },
						include: {
							videoContent: {
								select: {
									id: true,
									duration: true,
									thumbnailUrl: true,
									status: true,
								},
							},
						},
					},
					teacher: {
						include: { user: { select: { name: true, image: true } } },
					},
				},
			},
			reviews: {
				orderBy: { createdAt: "desc" },
				take: 10,
				include: {
					student: {
						include: { user: { select: { name: true, image: true } } },
					},
				},
			},
			_count: { select: { enrollments: true } },
		},
	});

	if (!course) throw AppError.notFound("Course not found");

	const result = {
		...course,
		thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
	};
	await cached.set(cacheKey, JSON.stringify(result), CACHE_TTL);
	res.status(200).json({ success: true, data: result });
});

export const updateCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Ownership: a teacher may only edit their own course. Admins (no teacher
		// profile) are allowed through.
		const teacherId = (req.user as any)?.teacher?.id;
		if (teacherId) {
			const existing = await prisma.course.findUnique({
				where: { id, courseType: "LMS" },
				select: { teacherId: true },
			});
			if (!existing) throw new AppError("Course not found", 404);
			if (existing.teacherId !== teacherId && !req.user?.isSuperUser) {
				throw new AppError("You can only edit your own courses", 403);
			}
		}

		// Handle file upload — route uses uploadCourseThumbnail (single "thumbnail")
		const updateData: Record<string, unknown> = { ...req.body };

		if (req.file) {
			const thumbnailPath = `lms-courses/${generateFileName(
				req.file.originalname,
				"thumbnail",
			)}`;
			await minioService.uploadFile(
				thumbnailPath,
				req.file.buffer,
				req.file.mimetype,
			);
			updateData.thumbnail = thumbnailPath;
		}

		const course = await prisma.$transaction(async (tx) => {
			const updated = await tx.course.update({
				where: { id, courseType: "LMS" },
				data: updateData,
			});
			return updated;
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course updated: ${course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${id}`);
		await invalidateCachePattern("lms:courses:*");

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
		const { id } = ZCuid.parse(req.params);
		const { isPublished } = publishLMSCourseSchema.parse(req.body);

		const course = await prisma.course.findUnique({
			where: { id, courseType: "LMS" },
		});
		if (!course) throw AppError.notFound("Course not found");

		const updated = await prisma.course.update({
			where: { id, courseType: "LMS" },
			data: {
				isPublished,
				publishedAt: isPublished ? new Date() : null,
			},
		});

		await createAuditLogFromRequest(req, {
			action: isPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course ${isPublished ? "published" : "unpublished"}: ${course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${id}`);
		await invalidateCachePattern("lms:courses:*");

		res.status(200).json({ success: true, data: updated });
	},
);

export const getPublishedCourses = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const cacheKey = `lms-courses-published:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

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

		const ALLOWED_FILTERS = ["categoryId", "level"];
		const where = buildWhere(filters, ALLOWED_FILTERS);
		where.isPublished = true;
		where.courseType = "LMS";

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
			prisma.course.findMany({
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
					schedules: true,
				},
			}),
			prisma.course.count({ where }),
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

export const getPublishedCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);

		const course = await prisma.course.findUnique({
			where: { id, courseType: "LMS", isPublished: true },
			include: {
				createdBy: {
					select: { name: true, image: true },
				},
				courseModules: {
					orderBy: { orderIndex: "asc" },
					include: {
						lessons: {
							orderBy: { orderIndex: "asc" },
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
	},
);

export const getPopularCourses = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const courses = await prisma.course.findMany({
			where: { isPublished: true, courseType: "LMS" },
			orderBy: {
				enrollments: {
					_count: "desc",
				},
			},
			skip,
			take: limit,
			include: {
				createdBy: {
					select: { name: true, image: true },
				},
				_count: {
					select: { enrollments: true },
				},
			},
		});

		const total = await prisma.course.count({
			where: { isPublished: true, courseType: "LMS" },
		});

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

		res.json({
			success: true,
			data,
			pagination,
		});
	},
);

export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);
		const course = await prisma.course.findUnique({
			where: { id, courseType: "LMS" },
		});
		if (!course) throw AppError.notFound("Course not found");
		// Ownership: a teacher may only delete their own courses. Admins allowed.
		const teacherId = req.user?.teacher?.id;
		if (teacherId && course.teacherId !== teacherId) {
			throw AppError.forbidden("You can only delete your own courses");
		}

		await prisma.course.delete({
			where: { id, courseType: "LMS" },
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course deleted: ${course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${id}`);
		await invalidateCachePattern("lms:courses:*");

		res
			.status(200)
			.json({ success: true, message: "Course deleted successfully" });
	},
);
