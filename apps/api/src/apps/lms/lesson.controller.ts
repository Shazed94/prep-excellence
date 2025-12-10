import fs from "node:fs";
import {
	createLMSLessonSchema,
	updateLMSLessonSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { Prisma } from "@/generated/client";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { videoJobs } from "@/lib/queue-processors";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { toPublicUrl, toStoragePath } from "@/utils/storageUrl";

/**
 * Create LMS Lesson (without video)
 * POST /api/lms/modules/:moduleId/lessons
 */
export const createLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { moduleId } = req.params;
		const validated = createLMSLessonSchema.parse(req.body);

		const lesson = await prisma.lMSLesson.create({
			data: {
				...validated,
				moduleId,
			},
		});

		res.status(201).json({
			success: true,
			data: lesson,
		});
	},
);

/**
 * Upload Video to Lesson
 * POST /api/lms/lessons/:id/upload-video
 *
 * Flow:
 * 1. Upload raw video to MinIO
 * 2. Enqueue RabbitMQ job for HLS processing
 * 3. Return 202 Accepted
 * 4. Go processor will callback with HLS results
 */
export const uploadLessonVideo = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const videoFile = req.file; // Multer uploaded file

		if (!videoFile) {
			throw new AppError("No video file provided", 400);
		}

		const lesson = await prisma.lMSLesson.findUnique({
			where: { id },
		});

		if (!lesson) {
			throw new AppError("Lesson not found", 404);
		}

		try {
			// Step 1: Upload raw video to MinIO
			const rawVideoPath = `lessons/${id}/raw_${Date.now()}.mp4`;
			const buffer = await fs.promises.readFile(videoFile.path);
			await minioService.uploadFile(
				rawVideoPath,
				buffer,
				videoFile.mimetype || "video/mp4",
			);

			// Step 2: Update lesson with processing status
			await prisma.lMSLesson.update({
				where: { id },
				data: {
					videoStatus: "PROCESSING",
					rawVideoUrl: rawVideoPath,
				},
			});

			// Step 3: Enqueue processing job
			await videoJobs.processVideoHLS(id, rawVideoPath, `lessons/${id}`, {
				resolutions: ["1080p", "720p", "480p", "360p"],
				thumbnailTimestamp: 5,
				deleteRawAfterProcessing: false, // Keep for re-processing if needed
			});

			res.status(202).json({
				success: true,
				message: "Video uploaded and queued for processing",
				lessonId: id,
				status: "PROCESSING",
			});
		} catch (error) {
			// Rollback on error
			await prisma.lMSLesson.update({
				where: { id },
				data: { videoStatus: "FAILED" },
			});

			throw error;
		}
	},
);

/**
 * Select Thumbnail for Lesson Video
 * POST /api/lms/lessons/:id/thumbnail/select
 * Body: { thumbnailId: "thumb_2" }
 */
export const selectLessonThumbnail = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { thumbnailId } = req.body;

		const lesson = await prisma.lMSLesson.findUnique({
			where: { id },
		});

		if (!lesson) {
			throw new AppError("Lesson not found", 404);
		}

		const thumbnailOptions = lesson.thumbnailOptions as Array<{
			id: string;
			url: string;
			timestamp: number;
		}> | null;

		if (!thumbnailOptions || thumbnailOptions.length === 0) {
			throw new AppError("No thumbnail options available", 400);
		}

		// Find selected thumbnail
		const selectedThumbnail = thumbnailOptions.find(
			(t) => t.id === thumbnailId,
		);

		if (!selectedThumbnail) {
			throw new AppError("Invalid thumbnail ID", 400);
		}

		// Delete unused thumbnails from storage
		const deletePromises = thumbnailOptions
			.filter((t) => t.id !== thumbnailId)
			.map((t) => {
				const path = toStoragePath(t.url);
				return path
					? minioService
							.deleteFile(path)
							.catch((err) => console.error(`Failed to delete ${path}:`, err))
					: Promise.resolve();
			});
		await Promise.all(deletePromises);

		// Update lesson with final thumbnail
		await prisma.lMSLesson.update({
			where: { id },
			data: {
				thumbnailUrl: selectedThumbnail.url,
				thumbnailOptions: Prisma.JsonNull,
			},
		});

		res.json({
			success: true,
			thumbnailUrl: toPublicUrl(selectedThumbnail.url),
		});
	},
);

/**
 * Get Lessons for Module (with sequential unlock logic)
 * GET /api/lms/modules/:moduleId/lessons
 */
export const getLessons = asyncHandler(async (req: Request, res: Response) => {
	const { moduleId } = req.params;
	const { studentId } = req.query;

	const lessons = await prisma.lMSLesson.findMany({
		where: { moduleId },
		orderBy: { orderIndex: "asc" },
	});

	// If studentId provided, check unlock status based on previous lesson completion
	if (studentId) {
		const progress = await prisma.lMSProgress.findMany({
			where: {
				studentId: studentId as string,
			},
			select: {
				lessonId: true,
				isCompleted: true,
			},
		});

		const completedLessonIds = new Set(
			progress.filter((p) => p.isCompleted).map((p) => p.lessonId),
		);

		const lessonsWithUnlockStatus = lessons.map((lesson, index) => {
			// First lesson is always unlocked
			if (index === 0) {
				return { ...lesson, isUnlocked: true };
			}

			// Check if previous lesson is completed
			const previousLesson = lessons[index - 1];
			const isPreviousCompleted = completedLessonIds.has(previousLesson.id);

			return { ...lesson, isUnlocked: isPreviousCompleted };
		});

		return res.json({
			success: true,
			data: lessonsWithUnlockStatus.map((lesson) => ({
				...lesson,
				masterPlaylistUrl: lesson.masterPlaylistUrl
					? toPublicUrl(lesson.masterPlaylistUrl)
					: null,
				thumbnailUrl: lesson.thumbnailUrl
					? toPublicUrl(lesson.thumbnailUrl)
					: null,
			})),
		});
	}

	// Without studentId, return all lessons
	return res.json({
		success: true,
		data: lessons.map((lesson) => ({
			...lesson,
			masterPlaylistUrl: lesson.masterPlaylistUrl
				? toPublicUrl(lesson.masterPlaylistUrl)
				: null,
			thumbnailUrl: lesson.thumbnailUrl
				? toPublicUrl(lesson.thumbnailUrl)
				: null,
		})),
	});
});

/**
 * Update LMS Lesson
 * PATCH /api/lms/lessons/:id
 */
export const updateLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSLessonSchema.parse(req.body);

		const lesson = await prisma.lMSLesson.update({
			where: { id },
			data: validated,
		});

		res.json({
			success: true,
			data: lesson,
		});
	},
);

/**
 * Delete LMS Lesson
 * DELETE /api/lms/lessons/:id
 */
export const deleteLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// TODO: Delete associated video files from MinIO
		await prisma.lMSLesson.delete({
			where: { id },
		});

		res.json({
			success: true,
			message: "Lesson deleted successfully",
		});
	},
);
