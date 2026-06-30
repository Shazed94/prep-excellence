import {
	createLMSVideoSchema,
	updateLMSVideoSchema,
	updateLMSVideoStatusSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";

export const createVideo = asyncHandler(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const validated = createLMSVideoSchema
		.omit({ lessonId: true })
		.parse(req.body);
	const { title, description, url, duration } = validated;

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
			title,
			description,
			rawVideoUrl: url,
			duration,
			lessonId,
			status: "uploading",
		},
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "LMSVideo",
		entityId: video.id,
		description: `Video uploaded: ${title}`,
		performedById: req.user?.id,
	});

	await invalidateCachePattern(`lms:course:${lesson.courseModule.course.id}`);

	res.status(201).json({ success: true, data: video });
});

export const getVideoByLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { lessonId } = req.params;
		const video = await prisma.videoContent.findFirst({
			where: { lessonId },
			include: { variants: true },
		});
		if (!video) {
			res.status(200).json({ success: true, data: null });
			return;
		}
		res.status(200).json({
			success: true,
			data: {
				...video,
				rawVideoUrl: toPublicUrl(video.rawVideoUrl),
				thumbnailUrl: video.thumbnailUrl
					? toPublicUrl(video.thumbnailUrl)
					: null,
			},
		});
	},
);

export const getVideo = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
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
	res.status(200).json({
		success: true,
		data: {
			...video,
			rawVideoUrl: toPublicUrl(video.rawVideoUrl),
			masterPlaylistUrl: video.masterPlaylistUrl
				? toPublicUrl(video.masterPlaylistUrl)
				: null,
			thumbnailUrl: video.thumbnailUrl ? toPublicUrl(video.thumbnailUrl) : null,
		},
	});
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const validated = updateLMSVideoSchema.parse(req.body);

	const video = await prisma.videoContent.findUnique({ where: { id } });
	if (!video) throw AppError.notFound("Video not found");

	const updated = await prisma.videoContent.update({
		where: { id },
		data: validated,
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.UPDATE,
		module: "LMSVideo",
		entityId: id,
		description: `Video updated: ${updated.title}`,
		performedById: req.user?.id,
	});

	res.status(200).json({ success: true, data: updated });
});

export const updateVideoStatus = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSVideoStatusSchema.parse(req.body);
		const { encodingStatus } = validated;

		const video = await prisma.videoContent.findUnique({
			where: { id },
			include: {
				lesson: {
					select: { courseModule: { select: { courseId: true } } },
				},
			},
		});
		if (!video) throw AppError.notFound("Video not found");

		const updated = await prisma.videoContent.update({
			where: { id },
			data: {
				status: encodingStatus,
				processedAt: encodingStatus === "COMPLETED" ? new Date() : undefined,
			},
		});

		await invalidateCachePattern(
			`lms:course:${video.lesson?.courseModule.courseId}`,
		);

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
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

	res
		.status(200)
		.json({ success: true, message: "Video deleted successfully" });
});
