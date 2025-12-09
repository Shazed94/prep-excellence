import { updateLMSProgressSchema } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Update LMS Progress (mark lesson as viewed/completed)
 * PATCH /api/lms/progress/:enrollmentId/lessons/:lessonId
 *
 * When completionPercent >= 90, mark lesson as completed
 */
export const updateProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const { enrollmentId, lessonId } = req.params;
		const validated = updateLMSProgressSchema.parse(req.body);

		// Check if enrollment exists and is active
		const enrollment = await prisma.lMSEnrollment.findUnique({
			where: { id: enrollmentId },
		});

		if (!enrollment) {
			throw new AppError("Enrollment not found", 404);
		}

		if (enrollment.status !== "ACTIVE") {
			throw new AppError("Enrollment is not active", 403);
		}

		const studentId = enrollment.studentId;

		// Find or create progress record
		let progress = await prisma.lMSProgress.findFirst({
			where: {
				studentId,
				lessonId,
			},
		});

		const isCompleted =
			validated.isCompleted !== undefined
				? validated.isCompleted
				: (validated.completionPercent || 0) >= 90;

		if (progress) {
			// Update existing progress
			progress = await prisma.lMSProgress.update({
				where: { id: progress.id },
				data: {
					...validated,
					isCompleted,
					completedAt:
						isCompleted && !progress.completedAt
							? new Date()
							: progress.completedAt,
				},
			});
		} else {
			// Create new progress
			progress = await prisma.lMSProgress.create({
				data: {
					studentId,
					...validated,
					isCompleted,
					completedAt: isCompleted ? new Date() : null,
				},
			});
		}

		res.json({
			success: true,
			data: progress,
		});
	},
);

/**
 * Get Progress for Enrollment
 * GET /api/lms/progress/:enrollmentId
 */
export const getEnrollmentProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const { enrollmentId } = req.params;

		// Get enrollment to find studentId
		const enrollment = await prisma.lMSEnrollment.findUnique({
			where: { id: enrollmentId },
		});

		if (!enrollment) {
			throw new AppError("Enrollment not found", 404);
		}

		const progress = await prisma.lMSProgress.findMany({
			where: { studentId: enrollment.studentId },
			include: {
				lesson: {
					select: {
						id: true,
						title: true,
						videoDuration: true,
						orderIndex: true,
						moduleId: true,
					},
				},
			},
			orderBy: {
				lesson: {
					orderIndex: "asc",
				},
			},
		});

		res.json({
			success: true,
			data: progress,
		});
	},
);

/**
 * Get Progress for Specific Lesson
 * GET /api/lms/progress/:enrollmentId/lessons/:lessonId
 */
export const getLessonProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const { enrollmentId, lessonId } = req.params;

		// Get enrollment to find studentId
		const enrollment = await prisma.lMSEnrollment.findUnique({
			where: { id: enrollmentId },
		});

		if (!enrollment) {
			throw new AppError("Enrollment not found", 404);
		}

		const progress = await prisma.lMSProgress.findFirst({
			where: {
				studentId: enrollment.studentId,
				lessonId,
			},
			include: {
				lesson: {
					select: {
						id: true,
						title: true,
						videoDuration: true,
					},
				},
			},
		});

		if (!progress) {
			return res.json({
				success: true,
				data: {
					watchTimeSeconds: 0,
					lastPosition: 0,
					completionPercent: 0,
					isCompleted: false,
				},
			});
		}

		return res.json({
			success: true,
			data: progress,
		});
	},
);
