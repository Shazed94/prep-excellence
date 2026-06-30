import type { Request } from "express";
import type { LESSON_TYPE } from "@/generated/enums";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export interface CreateLessonInput {
	title: string;
	description?: string;
	orderIndex: number;
	lessonType?: LESSON_TYPE;
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

class CoachingLessonService {
	async #checkOrderIndex(
		moduleId: string,
		orderIndex: number,
		excludeId?: string,
	) {
		const existing = await prisma.lesson.findFirst({
			where: {
				courseModuleId: moduleId,
				orderIndex,
				...(excludeId ? { id: { not: excludeId } } : {}),
			},
		});
		if (existing) {
			throw AppError.conflict(
				`Lesson with orderIndex ${orderIndex} already exists in this module`,
			);
		}
	}

	async create(moduleId: string, data: CreateLessonInput, req: Request) {
		const mod = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			select: { id: true, courseId: true },
		});
		if (!mod) throw AppError.notFound("Module not found");

		await this.#checkOrderIndex(moduleId, data.orderIndex);

		const lesson = await prisma.lesson.create({
			data: {
				title: data.title,
				description: data.description ?? "",
				orderIndex: data.orderIndex,
				lessonType: data.lessonType ?? ("LIVE_CLASS" as LESSON_TYPE),
				courseModuleId: mod.id,
				content: data.content,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingLesson",
			entityId: lesson.id,
			description: `Lesson created: ${data.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`coaching:course:${mod.courseId}`);
		return lesson;
	}

	async list(moduleId: string) {
		const mod = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			select: { id: true, courseId: true },
		});
		if (!mod) throw AppError.notFound("Module not found");

		const lessons = await prisma.lesson.findMany({
			where: { courseModuleId: moduleId, isActive: true },
			orderBy: { orderIndex: "asc" },
			include: {
				liveClass: {
					select: {
						id: true,
						meetingUrl: true,
						provider: true,
						status: true,
						scheduledStartAt: true,
						scheduledEndAt: true,
					},
				},
				videoContent: {
					select: {
						id: true,
						title: true,
						status: true,
						duration: true,
						masterPlaylistUrl: true,
						thumbnailUrl: true,
					},
				},
				assignment: {
					select: {
						id: true,
						title: true,
						totalPoints: true,
						dueDate: true,
						allowLateSubmission: true,
					},
				},
				exam: {
					select: {
						id: true,
						title: true,
						passingScore: true,
						timeLimit: true,
						maxAttempts: true,
					},
				},
				lessonAttachments: {
					select: { id: true, title: true, fileUrl: true, fileType: true },
				},
			},
		});

		return {
			courseId: mod.courseId,
			lessons,
		};
	}

	async getById(id: string) {
		const lesson = await prisma.lesson.findFirst({
			where: { id, isActive: true },
			include: {
				courseModule: { select: { id: true, title: true, courseId: true } },
				liveClass: true,
				videoContent: true,
				assignment: {
					select: {
						id: true,
						title: true,
						totalPoints: true,
						dueDate: true,
						allowLateSubmission: true,
					},
				},
				exam: {
					select: {
						id: true,
						title: true,
						passingScore: true,
						timeLimit: true,
						maxAttempts: true,
					},
				},
				lessonAttachments: true,
			},
		});
		if (!lesson) throw AppError.notFound("Lesson not found");

		return lesson;
	}

	async update(id: string, data: UpdateLessonInput, req: Request) {
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		if (
			data.orderIndex !== undefined &&
			data.orderIndex !== lesson.orderIndex
		) {
			await this.#checkOrderIndex(lesson.courseModuleId, data.orderIndex, id);
		}

		const updated = await prisma.lesson.update({ where: { id }, data });
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingLesson",
			entityId: id,
			description: `Lesson updated: ${updated.title}`,
			performedById: req.user?.id,
		});
		return updated;
	}

	async delete(id: string, req: Request) {
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		await prisma.lesson.update({ where: { id }, data: { isActive: false } });
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingLesson",
			entityId: id,
			description: `Lesson deleted: ${lesson.title}`,
			performedById: req.user?.id,
		});
	}
}

export const coachingLessonService = new CoachingLessonService();
