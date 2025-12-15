import fs from "node:fs";
import {
	createLMSLessonSchema,
	updateLMSLessonSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { Prisma } from "@/generated/client";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { videoJobs } from "@/lib/queue-processors";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere } from "@/utils/filters";
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
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);
	const studentId = filters?.studentId;

	const skip = (page - 1) * limit;

	const cacheKey = `lessons:${moduleId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}:studentId=${studentId || "anon"}`;

	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		return res.status(200).json({
			success: true,
			message: "Lessons fetched successfully (from cache)",
			data: parsed.data,
			pagination: parsed.pagination,
		});
	}

	const ALLOWED_FILTERS = ["contentType", "videoStatus"];
	const where = buildWhere(filters, ALLOWED_FILTERS);
	where.moduleId = moduleId;

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
		];
	}

	const orderClause: Record<string, "asc" | "desc"> =
		sortBy === "orderIndex" ? { orderIndex: "asc" } : { [sortBy]: orderBy };

	const [lessons, total] = await Promise.all([
		prisma.lMSLesson.findMany({
			where,
			skip,
			take: limit,
			orderBy: orderClause,
		}),
		prisma.lMSLesson.count({ where }),
	]);

	// If studentId provided, check unlock status based on previous lesson completion
	let processedLessons = lessons;
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

		processedLessons = lessons.map((lesson, index) => {
			// First lesson is always unlocked
			if (index === 0) {
				return { ...lesson, isUnlocked: true };
			}

			// Check if previous lesson is completed
			const previousLesson = lessons[index - 1];
			const isPreviousCompleted = completedLessonIds.has(previousLesson.id);

			return { ...lesson, isUnlocked: isPreviousCompleted };
		});
	}

	const totalPages = Math.ceil(total / limit);
	const pagination = {
		total,
		page,
		limit,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	};

	const data = processedLessons.map((lesson) => ({
		...lesson,
		masterPlaylistUrl: lesson.masterPlaylistUrl
			? toPublicUrl(lesson.masterPlaylistUrl)
			: null,
		thumbnailUrl: lesson.thumbnailUrl ? toPublicUrl(lesson.thumbnailUrl) : null,
	}));

	await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

	return res.json({
		success: true,
		data,
		pagination,
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

		// Invalidate lessons cache for this module
		await invalidateCachePattern(`lessons:${lesson.moduleId}:*`);

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

		const lesson = await prisma.lMSLesson.findUnique({ where: { id } });
		if (lesson) {
			// TODO: Delete associated video files from MinIO
			await prisma.lMSLesson.delete({
				where: { id },
			});

			// Invalidate lessons cache for this module
			await invalidateCachePattern(`lessons:${lesson.moduleId}:*`);
		}

		res.json({
			success: true,
			message: "Lesson deleted successfully",
		});
	},
);
