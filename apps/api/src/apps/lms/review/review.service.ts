import type { Request } from "express";
import { enrollmentService } from "@/apps/shared/services";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export interface CreateReviewInput {
	courseId: string;
	rating: number;
	comment?: string;
}

class LMSReviewService {
	async create(data: CreateReviewInput, studentId: string, req: Request) {
		if (data.rating < 1 || data.rating > 5) {
			throw AppError.badRequest("Rating must be between 1 and 5");
		}

		const enrolled = await enrollmentService.isEnrolled(
			data.courseId,
			studentId,
		);
		if (!enrolled) {
			throw AppError.forbidden("You must be enrolled to review");
		}

		const existing = await prisma.review.findFirst({
			where: { courseId: data.courseId, studentId },
		});
		if (existing) {
			throw AppError.badRequest("You have already reviewed this course");
		}

		const review = await prisma.review.create({
			data: {
				courseId: data.courseId,
				studentId,
				rating: data.rating,
				comment: data.comment,
			},
			include: {
				student: { select: { id: true, name: true, avatarUrl: true } },
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSReview",
			entityId: review.id,
			description: `Review created for course ${data.courseId}: ${data.rating}/5`,
			performedById: studentId,
		});

		// Update course average rating
		await this.#updateCourseRating(data.courseId);
		return review;
	}

	async list(courseId: string, page = 1, limit = 10) {
		const skip = (page - 1) * limit;
		const [reviews, total] = await Promise.all([
			prisma.review.findMany({
				where: { courseId, isActive: true },
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
				include: {
					student: { select: { id: true, name: true, avatarUrl: true } },
				},
			}),
			prisma.review.count({ where: { courseId, isActive: true } }),
		]);
		return {
			reviews,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async update(
		id: string,
		data: { rating?: number; comment?: string },
		studentId: string,
		_req: Request,
	) {
		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) throw AppError.notFound("Review not found");
		if (review.studentId !== studentId) {
			throw AppError.forbidden("Not your review");
		}
		if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
			throw AppError.badRequest("Rating must be between 1 and 5");
		}

		const updated = await prisma.review.update({
			where: { id },
			data,
		});

		await this.#updateCourseRating(review.courseId);
		return updated;
	}

	async delete(id: string, studentId: string, _req: Request) {
		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) throw AppError.notFound("Review not found");
		if (review.studentId !== studentId) {
			throw AppError.forbidden("Not your review");
		}

		await prisma.review.update({
			where: { id },
			data: { isActive: false },
		});
		await this.#updateCourseRating(review.courseId);
	}

	async #updateCourseRating(courseId: string) {
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
}

export const lmsReviewService = new LMSReviewService();
