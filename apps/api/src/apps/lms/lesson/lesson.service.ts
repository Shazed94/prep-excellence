import type { Request } from "express";
import type { LESSON_TYPE } from "@/generated/enums";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";

export interface CreateLessonInput {
	title: string;
	description?: string;
	orderIndex: number;
	lessonType: LESSON_TYPE;
	content?: string;
}

export interface UpdateLessonInput {
	title?: string;
	description?: string;
	orderIndex?: number;
	lessonType?: LESSON_TYPE;
	content?: string;
	isPublished?: boolean;
}

class LMSLessonService {
	async create(moduleId: string, data: CreateLessonInput, req: Request) {
		const courseModule = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			include: {
				course: { select: { id: true, courseType: true, title: true } },
			},
		});
		if (!courseModule) throw AppError.notFound("Module not found");
		if (courseModule.course.courseType !== "LMS") {
			throw AppError.badRequest("Not an LMS course");
		}

		const existing = await prisma.lesson.findUnique({
			where: {
				courseModuleId_orderIndex: {
					courseModuleId: moduleId,
					orderIndex: data.orderIndex,
				},
			},
		});
		if (existing) {
			throw AppError.badRequest(
				`Lesson with orderIndex ${data.orderIndex} already exists`,
			);
		}

		const lesson = await prisma.lesson.create({
			data: {
				...data,
				courseModuleId: moduleId,
			},
			include: {
				courseModule: { select: { id: true, title: true } },
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSLesson",
			entityId: lesson.id,
			description: `Lesson created: ${data.title} in module ${courseModule.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern(`lms:course:${courseModule.course.id}`);
		return lesson;
	}

	async list(moduleId: string) {
		const lessons = await prisma.lesson.findMany({
			where: { courseModuleId: moduleId, isActive: true },
			orderBy: { orderIndex: "asc" },
			include: {
				videoContent: {
					select: {
						id: true,
						title: true,
						duration: true,
						thumbnailUrl: true,
						status: true,
					},
				},
				lessonAttachments: {
					orderBy: { orderIndex: "asc" },
					select: {
						id: true,
						title: true,
						fileUrl: true,
						linkUrl: true,
						fileType: true,
					},
				},
				_count: { select: { progress: true } },
			},
		});

		return lessons.map((lesson) => ({
			...lesson,
			lessonAttachments: lesson.lessonAttachments.map((att) => ({
				...att,
				fileUrl: att.fileUrl ? toPublicUrl(att.fileUrl) : null,
			})),
		}));
	}

	async getById(id: string) {
		const lesson = await prisma.lesson.findUnique({
			where: { id },
			include: {
				courseModule: {
					select: { id: true, title: true, courseId: true },
				},
				videoContent: {
					include: { variants: true },
				},
				lessonAttachments: { orderBy: { orderIndex: "asc" } },
				liveClass: true,
				assignment: true,
				exam: true,
			},
		});

		if (!lesson) throw AppError.notFound("Lesson not found");
		return lesson;
	}

	async update(id: string, data: UpdateLessonInput, req: Request) {
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		const updated = await prisma.lesson.update({
			where: { id },
			data: {
				...data,
				publishedAt: data.isPublished ? new Date() : undefined,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSLesson",
			entityId: id,
			description: `Lesson updated: ${updated.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern("lms:course:*");
		return updated;
	}

	async delete(id: string, req: Request) {
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		await prisma.lesson.update({
			where: { id },
			data: { isActive: false },
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSLesson",
			entityId: id,
			description: `Lesson deleted: ${lesson.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern("lms:course:*");
	}
}

export const lmsLessonService = new LMSLessonService();
