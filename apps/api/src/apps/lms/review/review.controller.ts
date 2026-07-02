import {
	createLMSReviewSchema,
	updateLMSReviewSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { enrollmentService } from "@/apps/shared/services";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export const createReview = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSReviewSchema.parse(req.body);
		const { courseId, rating, comment } = validated;
		const studentId = req.user!.id;

		if (rating < 1 || rating > 5) {
			throw AppError.badRequest("Rating must be between 1 and 5");
		}

		const enrolled = await enrollmentService.isEnrolled(courseId, studentId);
		if (!enrolled) {
			throw AppError.forbidden("You must be enrolled to review");
		}

		const existing = await prisma.review.findFirst({
			where: { courseId, studentId },
		});
		if (existing) {
			throw AppError.badRequest("You have already reviewed this course");
		}

		const review = await prisma.review.create({
			data: {
				courseId,
				studentId,
				rating,
				comment,
			},
			include: {
				student: { select: { id: true, name: true, avatarUrl: true } },
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSReview",
			entityId: review.id,
			description: `Review created for course ${courseId}: ${rating}/5`,
			performedById: studentId,
		});

		// Update course average rating
		await updateCourseRating(courseId);

		res.status(201).json({ success: true, data: review });
	},
);

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.params;
	const { page, limit } = req.query as any;
	const pg = page ? Number(page) : 1;
	const lim = limit ? Number(limit) : 10;
	const skip = (pg - 1) * lim;

	const [reviews, total] = await Promise.all([
		prisma.review.findMany({
			where: { courseId, isActive: true },
			orderBy: { createdAt: "desc" },
			skip,
			take: lim,
			include: {
				student: { select: { id: true, name: true, avatarUrl: true } },
			},
		}),
		prisma.review.count({ where: { courseId, isActive: true } }),
	]);

	res.status(200).json({
		success: true,
		reviews,
		total,
		page: pg,
		limit: lim,
		totalPages: Math.ceil(total / lim),
	});
});

export const updateReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateLMSReviewSchema.parse(req.body);
		const studentId = req.user!.id;

		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) throw AppError.notFound("Review not found");
		if (review.studentId !== studentId) {
			throw AppError.forbidden("Not your review");
		}
		if (
			validated.rating !== undefined &&
			(validated.rating < 1 || validated.rating > 5)
		) {
			throw AppError.badRequest("Rating must be between 1 and 5");
		}

		const updated = await prisma.review.update({
			where: { id },
			data: validated,
		});

		await updateCourseRating(review.courseId);

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user!.id;

		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) throw AppError.notFound("Review not found");
		if (review.studentId !== studentId) {
			throw AppError.forbidden("Not your review");
		}

		await prisma.review.delete({
			where: { id }
		});

		await updateCourseRating(review.courseId);

		res
			.status(200)
			.json({ success: true, message: "Review deleted successfully" });
	},
);

// Helper: update course average rating
async function updateCourseRating(courseId: string) {
	const result = await prisma.review.aggregate({
		where: { courseId, isActive: true },
		_avg: { rating: true },
		_count: { rating: true },
	});

	await prisma.course.update({
		where: { id: courseId },
		data: {
			averageRating: result._avg.rating ?? 0,
			totalReviews: result._count.rating,
		},
	});
}
