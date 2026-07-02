import {
	createLMSLessonSchema,
	updateLMSLessonSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";

export const createLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { moduleId } = req.params;
		const validated = createLMSLessonSchema
			.omit({ moduleId: true })
			.parse(req.body);
		const { title, description, orderIndex, lessonType, content } = validated;

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
					orderIndex,
				},
			},
		});
		if (existing) {
			throw AppError.badRequest(
				`Lesson with orderIndex ${orderIndex} already exists`,
			);
		}

		const lesson = await prisma.lesson.create({
			data: {
				title,
				description,
				orderIndex,
				lessonType,
				content,
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
			description: `Lesson created: ${title} in module ${courseModule.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern(`lms:course:${courseModule.course.id}`);

		res.status(201).json({ success: true, data: lesson });
	},
);

export const getLessons = asyncHandler(async (req: Request, res: Response) => {
	const { moduleId } = req.params;
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

	res.status(200).json({
		success: true,
		data: lessons.map((lesson) => ({
			...lesson,
			lessonAttachments: lesson.lessonAttachments.map((att) => ({
				...att,
				fileUrl: att.fileUrl ? toPublicUrl(att.fileUrl) : null,
			})),
		})),
	});
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
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
	res.status(200).json({ success: true, data: lesson });
});

export const updateLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSLessonSchema.parse(req.body);

		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		const updated = await prisma.lesson.update({
			where: { id },
			data: {
				...validated,
				publishedAt: validated.isPublished ? new Date() : undefined,
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

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
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

		res
			.status(200)
			.json({ success: true, message: "Lesson deleted successfully" });
	},
);
