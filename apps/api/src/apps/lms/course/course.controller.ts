import {
	createLMSCourseSchema,
	publishLMSCourseSchema,
	updateLMSCourseSchema,
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
import { toPublicUrl } from "@/utils/storageUrl";

const CACHE_TTL = 60;

export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const bodyData = { ...req.body };

		// Parse JSON array fields (they come as strings in multipart/form-data)
		if (typeof bodyData.tags === "string") {
			try {
				bodyData.tags = JSON.parse(bodyData.tags);
			} catch {
				bodyData.tags = [];
			}
		}
		if (typeof bodyData.requirements === "string") {
			try {
				bodyData.requirements = JSON.parse(bodyData.requirements);
			} catch {
				bodyData.requirements = [];
			}
		}
		if (typeof bodyData.whatYouLearn === "string") {
			try {
				bodyData.whatYouLearn = JSON.parse(bodyData.whatYouLearn);
			} catch {
				bodyData.whatYouLearn = [];
			}
		}

		const validated = createLMSCourseSchema.parse(bodyData);
		const {
			title,
			shortDescription,
			longDescription,
			price,
			discount,
			teacherId,
			level,
			duration,
			categoryId,
			tags,
			requirements,
			whatYouLearn,
		} = validated;

		const user = req.user!;

		// Generate slug
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		const existingCourse = await prisma.course.findUnique({ where: { slug } });
		if (existingCourse) {
			throw AppError.badRequest("A course with this title already exists");
		}

		// Upload thumbnail if provided
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

		const course = await prisma.course.create({
			data: {
				courseType: "LMS",
				title,
				slug,
				shortDescription,
				longDescription,
				level: level || "BEGINNER",
				tags: tags || [],
				price,
				discount: discount || 0,
				duration,
				requirements: requirements || [],
				whatYouLearn: whatYouLearn || [],
				categoryId,
				thumbnail: thumbnailPath,
				createdById: user.id,
				teacherId: teacherId,
			},
			include: {
				createdBy: { select: { id: true, name: true, image: true } },
				category: true,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSCourse",
			entityId: course.id,
			description: `LMS Course created: ${title}`,
			performedById: user.id,
		});

		await invalidateCachePattern("lms:courses:*");

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
	const { page, limit, sortBy, orderBy, search, filters } = req.query as any;
	const pg = page ? Number(page) : 1;
	const lim = limit ? Number(limit) : 10;
	const skip = (pg - 1) * lim;

	const cacheKey = `lms:courses:list:${pg}:${lim}:${sortBy || "createdAt"}:${orderBy || "desc"}:${search || ""}:${JSON.stringify(filters || {})}:true`;
	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		res.status(200).json(JSON.parse(cachedData));
		return;
	}

	const where: any = { courseType: "LMS", isPublished: true };
	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ shortDescription: { contains: search, mode: "insensitive" } },
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

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const cacheKey = `lms:course:${id}`;
	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		res.status(200).json({ success: true, data: JSON.parse(cachedData) });
		return;
	}

	const course = await prisma.course.findUnique({
		where: { id },
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
					instructor: {
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
		const validated = updateLMSCourseSchema.parse(req.body);

		const course = await prisma.course.findUnique({ where: { id } });
		if (!course) throw AppError.notFound("Course not found");
		if (course.courseType !== "LMS") {
			throw AppError.badRequest("This is not an LMS course");
		}

		const updated = await prisma.course.update({
			where: { id },
			data: validated,
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course updated: ${validated.title || course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${id}`);
		await invalidateCachePattern("lms:courses:*");

		res.status(200).json({ success: true, data: updated });
	},
);

export const publishCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { isPublished } = publishLMSCourseSchema.parse(req.body);

		const course = await prisma.course.findUnique({ where: { id } });
		if (!course) throw AppError.notFound("Course not found");

		const updated = await prisma.course.update({
			where: { id },
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

export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const course = await prisma.course.findUnique({ where: { id } });
		if (!course) throw AppError.notFound("Course not found");

		await prisma.course.update({
			where: { id },
			data: { isActive: false },
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
