import type { Request } from "express";
import { AuditAction, VideoStatus } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";

export interface CreateVideoInput {
	title: string;
	description?: string;
	fileName: string;
	fileUrl: string;
	fileSize: number;
	mimeType: string;
	duration?: number;
	thumbnailUrl?: string;
}

export interface UpdateVideoInput {
	title?: string;
	description?: string;
	thumbnailUrl?: string;
	duration?: number;
	status?: VideoStatus;
}

class LMSVideoService {
	async create(lessonId: string, data: CreateVideoInput, req: Request) {
		const lesson = await prisma.lesson.findUnique({
			where: { id: lessonId },
			include: {
				courseModule: {
					select: {
						course: { select: { id: true, courseType: true, title: true } },
					},
				},
			},
		});
		if (!lesson) throw AppError.notFound("Lesson not found");
		if (lesson.courseModule.course.courseType !== "LMS") {
			throw AppError.badRequest("Not an LMS lesson");
		}

		const video = await prisma.videoContent.create({
			data: {
				...data,
				lessonId,
				status: data.status ?? VideoStatus.UPLOADING,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSVideo",
			entityId: video.id,
			description: `Video uploaded: ${data.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern(`lms:course:${lesson.courseModule.course.id}`);
		return video;
	}

	async getByLesson(lessonId: string) {
		const video = await prisma.videoContent.findFirst({
			where: { lessonId },
			include: { variants: true },
		});
		if (!video) return null;
		return {
			...video,
			fileUrl: toPublicUrl(video.fileUrl),
			thumbnailUrl: video.thumbnailUrl ? toPublicUrl(video.thumbnailUrl) : null,
		};
	}

	async getById(id: string) {
		const video = await prisma.videoContent.findUnique({
			where: { id },
			include: {
				variants: true,
				lesson: {
					select: {
						id: true,
						title: true,
						courseModule: {
							select: { id: true, courseId: true },
						},
					},
				},
			},
		});
		if (!video) throw AppError.notFound("Video not found");
		return {
			...video,
			fileUrl: toPublicUrl(video.fileUrl),
			thumbnailUrl: video.thumbnailUrl ? toPublicUrl(video.thumbnailUrl) : null,
		};
	}

	async update(id: string, data: UpdateVideoInput, req: Request) {
		const video = await prisma.videoContent.findUnique({ where: { id } });
		if (!video) throw AppError.notFound("Video not found");

		const updated = await prisma.videoContent.update({
			where: { id },
			data,
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSVideo",
			entityId: id,
			description: `Video updated: ${updated.title}`,
			performedById: req.user?.id,
		});

		return updated;
	}

	async updateStatus(id: string, status: VideoStatus, errorMessage?: string) {
		const video = await prisma.videoContent.findUnique({
			where: { id },
			include: {
				lesson: { select: { courseModule: { select: { courseId: true } } } },
			},
		});
		if (!video) throw AppError.notFound("Video not found");

		const updated = await prisma.videoContent.update({
			where: { id },
			data: {
				status,
				errorMessage: errorMessage ?? null,
				processedAt: status === VideoStatus.READY ? new Date() : undefined,
			},
		});

		await invalidateCachePattern(
			`lms:course:${video.lesson.courseModule.courseId}`,
		);
		return updated;
	}

	async delete(id: string, req: Request) {
		const video = await prisma.videoContent.findUnique({ where: { id } });
		if (!video) throw AppError.notFound("Video not found");

		await prisma.videoContent.delete({ where: { id } });
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSVideo",
			entityId: id,
			description: `Video deleted: ${video.title}`,
			performedById: req.user?.id,
		});
	}
}

export const lmsVideoService = new LMSVideoService();
