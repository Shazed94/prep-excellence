import type { Request } from "express";
import type { Prisma } from "@/generated/client";
import type { COURSE_TYPE, DIFFICULTY_LEVEL } from "@/generated/enums";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";

export interface CreateCourseInput {
	title: string;
	shortDescription: string;
	longDescription: string;
	level?: DIFFICULTY_LEVEL;
	tags?: string[];
	price?: number;
	discount?: number;
	duration?: number;
	requirements?: string[];
	whatYouLearn?: string[];
	categoryId?: string;
}

export interface UpdateCourseInput {
	title?: string;
	shortDescription?: string;
	longDescription?: string;
	level?: DIFFICULTY_LEVEL;
	tags?: string[];
	price?: number;
	discount?: number;
	duration?: number;
	requirements?: string[];
	whatYouLearn?: string[];
	isPublished?: boolean;
	categoryId?: string;
}

class LMSCourseService {
	private readonly COURSE_TYPE = "LMS" as COURSE_TYPE;
	private readonly CACHE_TTL = 60;

	async create(
		data: CreateCourseInput,
		createdById: string,
		req: Request,
		thumbnailFile?: Express.Multer.File,
	) {
		const slug = data.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		const existingCourse = await prisma.course.findUnique({ where: { slug } });
		if (existingCourse) {
			throw AppError.badRequest("A course with this title already exists");
		}

		let thumbnailPath: string | undefined;
		if (thumbnailFile) {
			const thumbnailKey = `lms-courses/${generateFileName(
				thumbnailFile.originalname,
				"thumbnail",
			)}`;
			await minioService.uploadFile(
				thumbnailKey,
				thumbnailFile.buffer,
				thumbnailFile.mimetype,
			);
			thumbnailPath = thumbnailKey;
		}

		const course = await prisma.course.create({
			data: {
				courseType: this.COURSE_TYPE,
				title: data.title,
				slug,
				shortDescription: data.shortDescription,
				longDescription: data.longDescription,
				level: data.level || "BEGINNER",
				tags: data.tags || [],
				price: data.price,
				discount: data.discount || 0,
				duration: data.duration,
				requirements: data.requirements || [],
				whatYouLearn: data.whatYouLearn || [],
				categoryId: data.categoryId,
				thumbnail: thumbnailPath,
				createdById,
			},
			include: {
				createdBy: { include: { user: true } },
				category: true,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSCourse",
			entityId: course.id,
			description: `LMS Course created: ${data.title}`,
			performedById: createdById,
		});

		await invalidateCachePattern("lms:courses:*");

		return {
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		};
	}

	async list(filter: {
		page?: number;
		limit?: number;
		sortBy?: string;
		orderBy?: "asc" | "desc";
		search?: string;
		filters?: Record<string, string>;
		isPublished?: boolean;
	}) {
		const {
			page = 1,
			limit = 10,
			sortBy = "createdAt",
			orderBy = "desc",
			search,
			filters,
			isPublished,
		} = filter;
		const skip = (page - 1) * limit;

		const cacheKey = `lms:courses:list:${page}:${limit}:${sortBy}:${orderBy}:${search || ""}:${JSON.stringify(filters || {})}:${isPublished}`;
		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			return JSON.parse(cachedData);
		}

		const where: Prisma.CourseWhereInput = {
			courseType: this.COURSE_TYPE,
		};
		if (isPublished !== undefined) where.isPublished = isPublished;
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
						include: {
							user: { select: { name: true, image: true } },
						},
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
				take: limit,
				orderBy: { [sortBy]: orderBy },
			}),
			prisma.course.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const result = {
			data: courses.map((c) => ({
				...c,
				thumbnail: c.thumbnail ? toPublicUrl(c.thumbnail) : null,
			})),
			pagination: {
				total,
				page,
				limit,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
		};

		await cached.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
		return result;
	}

	async getById(id: string) {
		const cacheKey = `lms:course:${id}`;
		const cachedData = await cached.get(cacheKey);
		if (cachedData) return JSON.parse(cachedData);

		const course = await prisma.course.findUnique({
			where: { id },
			include: {
				createdBy: {
					include: { user: { select: { name: true, image: true } } },
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
		await cached.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
		return result;
	}

	async update(id: string, data: UpdateCourseInput, req: Request) {
		const course = await prisma.course.findUnique({ where: { id } });
		if (!course) throw AppError.notFound("Course not found");
		if (course.courseType !== this.COURSE_TYPE) {
			throw AppError.badRequest("This is not an LMS course");
		}

		const updated = await prisma.course.update({ where: { id }, data });
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSCourse",
			entityId: id,
			description: `LMS Course updated: ${data.title || course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${id}`);
		await invalidateCachePattern("lms:courses:*");
		return updated;
	}

	async publish(id: string, isPublished: boolean, req: Request) {
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
		return updated;
	}

	async delete(id: string, req: Request) {
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
	}

	async uploadThumbnail(id: string, file: Express.Multer.File, req: Request) {
		const course = await prisma.course.findUnique({ where: { id } });
		if (!course) throw AppError.notFound("Course not found");

		const thumbnailKey = `lms-courses/${generateFileName(
			file.originalname,
			"thumbnail",
		)}`;
		await minioService.uploadFile(thumbnailKey, file.buffer, file.mimetype);

		const updated = await prisma.course.update({
			where: { id },
			data: { thumbnail: thumbnailKey },
		});

		await invalidateCachePattern(`lms:course:${id}`);
		await invalidateCachePattern("lms:courses:*");
		return { ...updated, thumbnail: toPublicUrl(updated.thumbnail!) };
	}
}

export const lmsCourseService = new LMSCourseService();
