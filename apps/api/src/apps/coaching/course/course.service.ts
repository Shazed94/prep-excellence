import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";




class CoachingCourseService {
	async create(data: CreateCourseInput, userId: string, req: Request) {
		const course = await prisma.course.create({
			data: {
				...data,
				courseType: "COACHING",
				tags: data.tags ?? [],
				requirements: data.requirements ?? [],
				whatYouLearn: data.whatYouLearn ?? [],
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingCourse",
			entityId: course.id,
			description: `Coaching course created: ${data.title}`,
			performedById: userId,
		});

		return course;
	}

	async list(params: {
		page: number;
		limit: number;
		sortBy?: string;
		orderBy?: "asc" | "desc";
		search?: string;
		filters?: Record<string, any>;
		isPublished?: boolean;
	}) {
		const {
			page,
			limit,
			sortBy = "createdAt",
			orderBy = "desc",
			search,
			filters,
			isPublished,
		} = params;
		const skip = (page - 1) * limit;

		const where: any = { courseType: "COACHING" };
		if (isPublished !== undefined) where.isPublished = isPublished;
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}
		if (filters) Object.assign(where, filters);

		const [courses, total] = await Promise.all([
			prisma.course.findMany({
				where,
				orderBy: { [sortBy]: orderBy },
				skip,
				take: limit,
				include: {
					instructor: {
						select: { id: true, name: true, email: true, avatarUrl: true },
					},
					_count: { select: { enrollments: true, courseModules: true } },
				},
			}),
			prisma.course.count({ where }),
		]);

		return {
			data: courses.map((c) => ({
				...c,
				thumbnail: c.thumbnail ? toPublicUrl(c.thumbnail) : null,
			})),
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		};
	}

	async getById(id: string) {
		const course = await prisma.course.findFirst({
			where: { id, courseType: "COACHING" },
			include: {
				instructor: {
					select: { id: true, name: true, email: true, avatarUrl: true },
				},
				courseModules: {
					where: { isActive: true },
					orderBy: { orderIndex: "asc" },
					include: {
						lessons: {
							where: { isActive: true },
							orderBy: { orderIndex: "asc" },
							select: {
								id: true,
								title: true,
								orderIndex: true,
								lessonType: true,
							},
						},
					},
				},
				_count: { select: { enrollments: true, courseModules: true } },
			},
		});
		if (!course) throw AppError.notFound("Coaching course not found");

		return {
			...course,
			thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
		};
	}

	async update(id: string, data: UpdateCourseInput, req: Request) {
		const course = await prisma.course.findFirst({
			where: { id, courseType: "COACHING" },
		});
		if (!course) throw AppError.notFound("Coaching course not found");

		const updated = await prisma.course.update({ where: { id }, data });
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingCourse",
			entityId: id,
			description: `Coaching course updated: ${updated.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:course:${id}`);
		return updated;
	}

	async publish(id: string, isPublished: boolean, req: Request) {
		const course = await prisma.course.findFirst({
			where: { id, courseType: "COACHING" },
		});
		if (!course) throw AppError.notFound("Coaching course not found");

		const updated = await prisma.course.update({
			where: { id },
			data: { isPublished, publishedAt: isPublished ? new Date() : null },
		});
		await createAuditLogFromRequest(req, {
			action: isPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			module: "CoachingCourse",
			entityId: id,
			description: `Coaching course ${isPublished ? "published" : "unpublished"}: ${updated.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:course:*`);
		return updated;
	}

	async delete(id: string, req: Request) {
		const course = await prisma.course.findFirst({
			where: { id, courseType: "COACHING" },
		});
		if (!course) throw AppError.notFound("Coaching course not found");

		await prisma.course.update({
			where: { id },
			data: { isActive: false },
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingCourse",
			entityId: id,
			description: `Coaching course deleted: ${course.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:course:*`);
	}

	async uploadThumbnail(id: string, file: Express.Multer.File, _req: Request) {
		const course = await prisma.course.findFirst({
			where: { id, courseType: "COACHING" },
		});
		if (!course) throw AppError.notFound("Coaching course not found");

		const { uploadToMinio } = await import("@/utils/minioUpload");
		const thumbnailUrl = await uploadToMinio(file, `coaching/${id}/thumbnail`);

		const updated = await prisma.course.update({
			where: { id },
			data: { thumbnail: thumbnailUrl },
		});
		await invalidateCachePattern(`coaching:course:${id}`);
		return updated;
	}
}

export const coachingCourseService = new CoachingCourseService();
