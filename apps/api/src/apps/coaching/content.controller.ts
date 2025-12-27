import { randomBytes } from "node:crypto";
import fs from "node:fs";
import {
	createCoachingContentSchema,
	updateCoachingContentSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { videoJobs } from "@/lib/queue-processors";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { toPublicUrl } from "@/utils/storageUrl";

/**
 * Create Coaching Content (polymorphic)
 * POST /api/coaching/topics/:topicId/contents
 */
export const createContent = asyncHandler(
	async (req: Request, res: Response) => {
		const { topicId } = req.params;
		const validated = createCoachingContentSchema.parse(req.body);

		// Generate Jitsi room details for live sessions
		let additionalData = {};
		if (validated.contentType === "VIDEO_LIVE") {
			const roomId = `coaching_${topicId}_${randomBytes(8).toString("hex")}`;
			const roomToken = randomBytes(32).toString("hex"); // In production, use proper JWT

			additionalData = {
				jitsiRoomId: roomId,
				jitsiRoomToken: roomToken,
			};
		}

		const content = await prisma.coachingContent.create({
			data: {
				...validated,
				...additionalData,
				topicId,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingContent",
			entityId: content.id,
			description: `Coaching content created: ${content.title} (${content.contentType})`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.status(201).json({
			success: true,
			data: content,
		});
	},
);

/**
 * Upload Video for Recorded Content
 * POST /api/coaching/contents/:id/upload-video
 */
export const uploadContentVideo = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const videoFile = req.file;

		if (!videoFile) {
			throw new AppError("No video file provided", 400);
		}

		const content = await prisma.coachingContent.findUnique({
			where: { id },
		});

		if (!content) {
			throw new AppError("Content not found", 404);
		}

		if (content.contentType !== "VIDEO_RECORDED") {
			throw new AppError(
				"Only recorded video content can have video uploads",
				400,
			);
		}

		try {
			// Upload raw video to MinIO
			const rawVideoPath = `coaching/contents/${id}/raw_${Date.now()}.mp4`;
			const buffer = await fs.promises.readFile(videoFile.path);
			await minioService.uploadFile(
				rawVideoPath,
				buffer,
				videoFile.mimetype || "video/mp4",
			);

			// Update content with processing status
			await prisma.coachingContent.update({
				where: { id },
				data: {
					videoStatus: "PROCESSING",
					rawVideoUrl: rawVideoPath,
				},
			});

			// Enqueue processing job
			await videoJobs.processVideoHLS(
				id,
				rawVideoPath,
				`coaching/contents/${id}`,
				{
					resolutions: ["1080p", "720p", "480p", "360p"],
					thumbnailTimestamp: 5,
					deleteRawAfterProcessing: false,
				},
			);

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.UPDATE,
				module: "CoachingContent",
				entityId: id,
				description: `Video uploaded for coaching content: ${content.title}`,
				performedById: req.user?.id,
			});

			res.status(202).json({
				success: true,
				message: "Video uploaded and queued for processing",
				contentId: id,
				status: "PROCESSING",
			});
		} catch (error) {
			await prisma.coachingContent.update({
				where: { id },
				data: { videoStatus: "FAILED" },
			});
			throw error;
		}
	},
);

/**
 * Start Live Session
 * POST /api/coaching/contents/:id/start-session
 */
export const startLiveSession = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const content = await prisma.coachingContent.findUnique({
			where: { id },
		});

		if (!content) {
			throw new AppError("Content not found", 404);
		}

		if (content.contentType !== "VIDEO_LIVE") {
			throw new AppError("Only live content can start sessions", 400);
		}

		// Update actual start time
		const updatedContent = await prisma.coachingContent.update({
			where: { id },
			data: {
				actualStartTime: new Date(),
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CHANGE_STATUS,
			module: "CoachingContent",
			entityId: id,
			description: `Live session started: ${content.title}`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			data: {
				jitsiRoomId: updatedContent.jitsiRoomId,
				jitsiRoomToken: updatedContent.jitsiRoomToken,
				actualStartTime: updatedContent.actualStartTime,
			},
		});
	},
);

/**
 * End Live Session
 * POST /api/coaching/contents/:id/end-session
 */
export const endLiveSession = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const content = await prisma.coachingContent.findUnique({
			where: { id },
		});

		if (!content) {
			throw new AppError("Content not found", 404);
		}

		if (content.contentType !== "VIDEO_LIVE") {
			throw new AppError("Only live content can end sessions", 400);
		}

		const updatedContent = await prisma.coachingContent.update({
			where: { id },
			data: {
				actualEndTime: new Date(),
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CHANGE_STATUS,
			module: "CoachingContent",
			entityId: id,
			description: `Live session ended: ${content.title}`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			data: {
				actualStartTime: updatedContent.actualStartTime,
				actualEndTime: updatedContent.actualEndTime,
			},
		});
	},
);

/**
 * Get Contents for Topic
 * GET /api/coaching/topics/:topicId/contents
 */
export const getContents = asyncHandler(async (req: Request, res: Response) => {
	const { topicId } = req.params;

	const contents = await prisma.coachingContent.findMany({
		where: { topicId },
		orderBy: { orderIndex: "asc" },
	});

	res.json({
		success: true,
		data: contents.map((content) => ({
			...content,
			masterPlaylistUrl: content.masterPlaylistUrl
				? toPublicUrl(content.masterPlaylistUrl)
				: null,
			thumbnailUrl: content.thumbnailUrl
				? toPublicUrl(content.thumbnailUrl)
				: null,
		})),
	});
});

/**
 * Update Coaching Content
 * PATCH /api/coaching/contents/:id
 */
export const updateContent = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateCoachingContentSchema.parse(req.body);

		const content = await prisma.coachingContent.update({
			where: { id },
			data: validated,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingContent",
			entityId: id,
			description: `Coaching content updated: ${content.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			data: content,
		});
	},
); /**
 * Delete Coaching Content
 * DELETE /api/coaching/contents/:id
 */
export const deleteContent = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Get content details before deletion
		const content = await prisma.coachingContent.findUnique({
			where: { id },
			select: { id: true, title: true, contentType: true },
		});
		if (!content) {
			throw new AppError("Content not found", 404);
		}

		await prisma.coachingContent.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingContent",
			entityId: id,
			description: `Coaching content deleted: ${content.title} (${content.contentType})`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("coaching-courses:*");

		res.json({
			success: true,
			message: "Content deleted successfully",
		});
	},
);
