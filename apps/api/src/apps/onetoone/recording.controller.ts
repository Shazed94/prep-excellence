import { ZCuid } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { toPublicUrl } from "@/utils/storageUrl";

/**
 * Get Session Recording
 * GET /api/onetoone/sessions/:sessionId/recording
 */

export const getRecording = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: sessionId } = ZCuid.parse(req.params);

		const recording = await prisma.sessionRecording.findUnique({
			where: { sessionId },
			// dose not exists
			// include: {
			// 	session: {
			// 		select: {
			// 			subject: true,
			// 			scheduledAt: true,
			// 			teacherId: true,
			// 			studentId: true,
			// 		},
			// 	},
			// },
		});

		if (!recording) {
			throw new AppError("Recording not found", 404);
		}

		// Check if recording is expired
		if (recording.status === "EXPIRED") {
			throw new AppError("Recording has expired and been deleted", 410);
		}

		if (recording.expiresAt && recording.expiresAt < new Date()) {
			throw new AppError("Recording has expired", 410);
		}

		res.json({
			success: true,
			data: {
				...recording,
				masterPlaylistUrl: recording.masterPlaylistUrl
					? toPublicUrl(recording.masterPlaylistUrl)
					: null,
				thumbnailUrl: recording.thumbnailUrl
					? toPublicUrl(recording.thumbnailUrl)
					: null,
			},
		});
	},
);

/**
 * Download Session Recording
 * GET /api/onetoone/recordings/:id/download
 */
export const downloadRecording = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);

		const recording = await prisma.sessionRecording.findUnique({
			where: { id },
			include: {
				session: true,
			},
		});

		if (!recording) {
			throw new AppError("Recording not found", 404);
		}

		// Check if recording is still available
		if (recording.status === "EXPIRED") {
			throw new AppError("Recording has expired and been deleted", 410);
		}

		if (recording.expiresAt && recording.expiresAt < new Date()) {
			throw new AppError("Recording has expired", 410);
		}

		if (!recording.downloadUrl) {
			throw new AppError("Download not available for this recording", 400);
		}

		// Generate pre-signed URL for download (valid for 1 hour)
		// TODO: Implement getPresignedUrl in MinioService
		// const presignedUrl = await minioService.getPresignedUrl(
		//     recording.downloadUrl,
		//     {
		//         expiresIn: 3600, // 1 hour
		//         responseHeaders: {
		//             "Content-Disposition": `attachment; filename="session_${recording.sessionId}.mp4"`,
		//         },
		//     }
		// );
		const presignedUrl = recording.downloadUrl; // Temporary: use direct URL

		// Increment download count
		await prisma.sessionRecording.update({
			where: { id },
			data: {
				downloadCount: recording.downloadCount + 1,
			},
		});

		res.json({
			success: true,
			data: {
				downloadUrl: presignedUrl,
				expiresIn: 3600,
			},
		});
	},
);

/**
 * Delete Expired Recordings (Cron Job Endpoint)
 * DELETE /api/onetoone/recordings/cleanup
 *
 * This should be called by a cron job daily
 */
export const cleanupExpiredRecordings = asyncHandler(
	async (_req: Request, res: Response) => {
		const now = new Date();

		// Find expired recordings
		const expiredRecordings = await prisma.sessionRecording.findMany({
			where: {
				expiresAt: {
					lt: now,
				},
				status: "AVAILABLE",
			},
		});

		let deletedCount = 0;
		let failedCount = 0;

		// Delete files from storage and update status
		for (const recording of expiredRecordings) {
			try {
				// Delete HLS files
				if (recording.masterPlaylistUrl) {
					// In production, delete entire directory recursively
					// const directory = recording.masterPlaylistUrl.split("/").slice(0, -1).join("/");
					// await minioService.deleteDirectory(directory);
				}

				// Delete download file
				if (recording.downloadUrl) {
					await minioService.deleteFile(recording.downloadUrl);
				}

				// Update status to expired
				await prisma.sessionRecording.update({
					where: { id: recording.id },
					data: {
						status: "EXPIRED",
					},
				});

				deletedCount++;
			} catch (error) {
				console.error(`Failed to delete recording ${recording.id}:`, error);
				failedCount++;
			}
		}

		res.json({
			success: true,
			data: {
				totalExpired: expiredRecordings.length,
				deletedCount,
				failedCount,
			},
		});
	},
);
