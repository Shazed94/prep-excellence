import {
	ZCCoachingLessonSchema,
	ZUCoachingLessonSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { LESSON_TYPE } from "@/generated/enums";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

async function checkOrderIndex(
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

export const createLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { moduleId } = req.params;
		const { title, description, orderIndex, lessonType, content } =
			ZCCoachingLessonSchema.parse(req.body);

		const mod = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			select: { id: true, courseId: true },
		});
		if (!mod) throw AppError.notFound("Module not found");

		await checkOrderIndex(moduleId, orderIndex);

		const lesson = await prisma.lesson.create({
			data: {
				title,
				description: description ?? "",
				orderIndex,
				lessonType: lessonType ?? ("LIVE_CLASS" as LESSON_TYPE),
				courseModuleId: mod.id,
				content,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingLesson",
			entityId: lesson.id,
			description: `Lesson created: ${title}`,
			performedById: req.user?.id,
		});

		res.status(201).json({ success: true, data: lesson });
	},
);

export const updateLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { title, description, orderIndex, lessonType, content, isPublished } =
			ZUCoachingLessonSchema.parse(req.body);

		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		if (orderIndex !== undefined && orderIndex !== lesson.orderIndex) {
			await checkOrderIndex(lesson.courseModuleId, orderIndex, id);
		}

		const data: Record<string, unknown> = {};
		if (title !== undefined) data.title = title;
		if (description !== undefined) data.description = description;
		if (orderIndex !== undefined) data.orderIndex = orderIndex;
		if (lessonType !== undefined) data.lessonType = lessonType;
		if (content !== undefined) data.content = content;
		if (isPublished !== undefined) data.isPublished = isPublished;

		const updated = await prisma.lesson.update({ where: { id }, data });

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingLesson",
			entityId: id,
			description: `Lesson updated: ${updated.title}`,
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");

		await prisma.lesson.delete({
			where: { id },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingLesson",
			entityId: id,
			description: `Lesson deleted: ${lesson.title}`,
			performedById: req.user?.id,
		});

		res.status(200).json({
			success: true,
			message: "Lesson deleted successfully",
		});
	},
);

export const getLessons = asyncHandler(async (req: Request, res: Response) => {
	const { moduleId } = req.params;

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
			assignment: {
				select: {
					id: true,
					title: true,
					totalPoints: true,
				},
			},
			exam: {
				select: {
					id: true,
					title: true,
					passingScore: true,
				},
			},
			lessonAttachments: {
				select: { id: true, title: true, fileUrl: true, fileType: true },
			},
		},
	});

	res.status(200).json({
		success: true,
		data: lessons,
		courseId: mod.courseId,
	});
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

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
				},
			},
			exam: {
				select: {
					id: true,
					title: true,
					passingScore: true,
				},
			},
			lessonAttachments: true,
		},
	});
	if (!lesson) throw AppError.notFound("Lesson not found");

	res.status(200).json({ success: true, data: lesson });
});
