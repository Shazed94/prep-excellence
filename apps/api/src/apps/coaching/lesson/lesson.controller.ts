import {
	ZAddLessonAttachmentsSchema,
	ZCCoachingLessonSchema,
	ZUCoachingLessonSchema,
	ZUpdateLessonAttachmentsSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { LESSON_TYPE } from "@/generated/enums";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { generateFileName } from "@/middleware/upload";
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

export const addLessonAttachments = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Validate the lesson exists and is READING_MATERIAL type
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");
		if (lesson.lessonType !== "READING_MATERIAL") {
			throw AppError.badRequest(
				"Attachments can only be added to READING_MATERIAL lessons",
			);
		}

		// Validate optional body fields (titles)
		const { titles } = ZAddLessonAttachmentsSchema.parse(req.body);

		const files = (req.files as Express.Multer.File[] | undefined) ?? [];
		if (files.length === 0) {
			throw AppError.badRequest("At least one file is required");
		}

		// Upload files to MinIO and prepare attachment records
		const minioService = (await import("@/infrastructure/storage/minio"))
			.default;
		const attachmentsData: Array<{
			title: string;
			fileUrl: string;
			fileType: string;
			fileSize: number;
			orderIndex: number;
		}> = [];

		for (const [index, file] of files.entries()) {
			const key = `lesson-attachments/${generateFileName(
				file.originalname,
				"attachment_",
			)}`;
			await minioService.uploadFile(key, file.buffer, file.mimetype, {
				originalName: file.originalname,
				lessonId: id,
				uploadedAt: new Date().toISOString(),
			});

			attachmentsData.push({
				// Use the custom title if provided, otherwise fallback to original filename
				title: titles?.[index] ?? file.originalname,
				fileUrl: key,
				fileType: file.mimetype,
				fileSize: file.size,
				orderIndex: index,
			});
		}

		// Create attachment records via the lesson relation
		const updated = await prisma.lesson.update({
			where: { id },
			data: {
				lessonAttachments: {
					create: attachmentsData,
				},
			},
			include: {
				lessonAttachments: {
					orderBy: { orderIndex: "asc" },
				},
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingLessonAttachment",
			entityId: id,
			description: `${attachmentsData.length} attachment(s) added to lesson: ${lesson.title}`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: updated.lessonAttachments,
		});
	},
);

export const updateLessonAttachments = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Validate the lesson exists and is READING_MATERIAL type
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) throw AppError.notFound("Lesson not found");
		if (lesson.lessonType !== "READING_MATERIAL") {
			throw AppError.badRequest(
				"Attachments can only be updated on READING_MATERIAL lessons",
			);
		}

		// Validate body fields
		const { titles, attachmentIds } = ZUpdateLessonAttachmentsSchema.parse(
			req.body,
		);

		const files = (req.files as Express.Multer.File[] | undefined) ?? [];
		if (files.length === 0) {
			throw AppError.badRequest("At least one file is required");
		}

		const minioService = (await import("@/infrastructure/storage/minio"))
			.default;

		const operations: Array<{
			action: "update" | "create";
			recordId?: string;
			title: string;
			fileUrl: string;
			fileType: string;
			fileSize: number;
			orderIndex: number;
		}> = [];

		// Process each file — existing attachment mapping or new
		for (const [index, file] of files.entries()) {
			const existingId = attachmentIds?.[index]?.trim();
			const key = `lesson-attachments/${generateFileName(
				file.originalname,
				"attachment_",
			)}`;

			// Upload to MinIO
			await minioService.uploadFile(key, file.buffer, file.mimetype, {
				originalName: file.originalname,
				lessonId: id,
				uploadedAt: new Date().toISOString(),
			});

			operations.push({
				action: existingId ? "update" : "create",
				recordId: existingId || undefined,
				title: titles?.[index] ?? file.originalname,
				fileUrl: key,
				fileType: file.mimetype,
				fileSize: file.size,
				orderIndex: index,
			});
		}

		// Execute operations
		for (const op of operations) {
			if (op.action === "update" && op.recordId) {
				// Find existing record to remove old file from MinIO
				const existing = await prisma.lessonAttachment.findUnique({
					where: { id: op.recordId },
				});
				if (!existing) {
					throw AppError.notFound(
						`Attachment with id ${op.recordId} not found`,
					);
				}

				// Remove old file from MinIO (best-effort)
				if (existing.fileUrl) {
					await minioService.deleteFile(existing.fileUrl).catch(() => {
						// ignore — old file may already be gone
					});
				}

				// Update the record
				await prisma.lessonAttachment.update({
					where: { id: op.recordId },
					data: {
						title: op.title,
						fileUrl: op.fileUrl,
						fileType: op.fileType,
						fileSize: op.fileSize,
						orderIndex: op.orderIndex,
					},
				});
			} else {
				// Create new record
				await prisma.lessonAttachment.create({
					data: {
						title: op.title,
						fileUrl: op.fileUrl,
						fileType: op.fileType,
						fileSize: op.fileSize,
						orderIndex: op.orderIndex,
						lessonId: id,
					},
				});
			}
		}

		// Fetch the full updated list
		const allAttachments = await prisma.lessonAttachment.findMany({
			where: { lessonId: id },
			orderBy: { orderIndex: "asc" },
		});

		const updateCount = operations.filter((o) => o.action === "update").length;
		const createCount = operations.filter((o) => o.action === "create").length;

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingLessonAttachment",
			entityId: id,
			description: `Lesson attachments updated: ${updateCount} replaced, ${createCount} added for lesson: ${lesson.title}`,
			performedById: req.user?.id,
		});

		res.status(200).json({
			success: true,
			data: allAttachments,
		});
	},
);
