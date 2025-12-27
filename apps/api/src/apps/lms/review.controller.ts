import {
	createLMSReviewSchema,
	updateLMSReviewSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

export const createReview = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSReviewSchema.parse(req.body);
		const user = req.user as UserWithRoleAndPermissions;

		const student = await prisma.student.findUnique({
			where: { userId: user.id },
		});

		if (!student) {
			throw new AppError("Student profile not found", 404);
		}

		const course = await prisma.lMSCourse.findUnique({
			where: { id: validated.courseId },
		});
		if (!course) {
			throw new AppError("Course not found", 404);
		}

		const enrollment = await prisma.lMSEnrollment.findUnique({
			where: {
				courseId_studentId: {
					courseId: validated.courseId,
					studentId: student.id,
				},
			},
		});

		if (!enrollment) {
			throw new AppError(
				"You must be enrolled in the course to leave a review",
				403,
			);
		}

		const existingReview = await prisma.lMSReview.findUnique({
			where: {
				courseId_studentId: {
					courseId: validated.courseId,
					studentId: student.id,
				},
			},
		});

		if (existingReview) {
			throw new AppError(
				"You have already reviewed this course. Use update instead.",
				400,
			);
		}

		const review = await prisma.lMSReview.create({
			data: {
				courseId: validated.courseId,
				studentId: student.id,
				rating: validated.rating,
				comment: validated.comment,
			},
			include: {
				student: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
				},
			},
		});

		await updateCourseRatingStats(validated.courseId);

		await invalidateCachePattern(`courses:${validated.courseId}*`);
		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSReview",
			entityId: review.id,
			description: `Created review for course ${validated.courseId} with rating ${validated.rating}`,
			performedById: user.id,
		});
		res.status(201).json({
			success: true,
			data: review,
			message: "Review submitted successfully",
		});
	},
);

export const getCourseReviews = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: courseId } = ZCuid.parse(req.params.courseId);
		const { page = 1, limit = 20 } = ZQueryParams.parse(req.query);

		const course = await prisma.lMSCourse.findUnique({
			where: { id: courseId },
		});
		if (!course) {
			throw new AppError("Course not found", 404);
		}

		const skip = (page - 1) * limit;

		const [reviews, total] = await Promise.all([
			prisma.lMSReview.findMany({
				where: { courseId },
				include: {
					student: {
						include: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.lMSReview.count({
				where: { courseId },
			}),
		]);

		const ratingDistribution = await prisma.lMSReview.groupBy({
			by: ["rating"],
			where: { courseId },
			_count: { rating: true },
		});

		const distribution = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		};

		for (const item of ratingDistribution) {
			distribution[item.rating as 1 | 2 | 3 | 4 | 5] = item._count.rating;
		}

		res.status(200).json({
			success: true,
			data: reviews,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
			stats: {
				averageRating: course.averageRating,
				totalReviews: course.totalReviews,
				distribution,
			},
		});
	},
);

export const getReviewById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);

		const review = await prisma.lMSReview.findUnique({
			where: { id },
			include: {
				student: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
				},
				course: {
					select: {
						id: true,
						title: true,
						slug: true,
						thumbnail: true,
					},
				},
			},
		});

		if (!review) {
			throw new AppError("Review not found", 404);
		}

		res.status(200).json({
			success: true,
			data: review,
		});
	},
);

export const getMyReview = asyncHandler(async (req: Request, res: Response) => {
	const { id: courseId } = ZCuid.parse(req.params.courseId);
	const user = req.user as UserWithRoleAndPermissions;

	const student = await prisma.student.findUnique({
		where: { userId: user.id },
	});

	if (!student) {
		throw new AppError("Student profile not found", 404);
	}

	const review = await prisma.lMSReview.findUnique({
		where: {
			courseId_studentId: {
				courseId,
				studentId: student.id,
			},
		},
		include: {
			student: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
			},
		},
	});

	if (!review) {
		return res.status(200).json({
			success: true,
			data: null,
			message: "No review found",
		});
	}

	return res.status(200).json({
		success: true,
		data: review,
	});
});

export const updateReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params);
		const validated = updateLMSReviewSchema.parse(req.body);
		const user = req.user as UserWithRoleAndPermissions;

		const student = await prisma.student.findUnique({
			where: { userId: user.id },
		});

		if (!student) {
			throw new AppError("Student profile not found", 404);
		}

		const review = await prisma.lMSReview.findUnique({
			where: { id },
		});

		if (!review) {
			throw new AppError("Review not found", 404);
		}

		if (review.studentId !== student.id) {
			throw new AppError("You can only edit your own reviews", 403);
		}

		const updated = await prisma.lMSReview.update({
			where: { id },
			data: {
				rating: validated.rating,
				comment: validated.comment,
			},
			include: {
				student: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
				},
			},
		});

		await updateCourseRatingStats(review.courseId);

		await invalidateCachePattern(`courses:${review.courseId}*`);
		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSReview",
			entityId: id,
			description: `Updated review for course ${review.courseId}`,
			performedById: user.id,
		});
		res.status(200).json({
			success: true,
			data: updated,
			message: "Review updated successfully",
		});
	},
);

export const deleteReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params.id);
		const user = req.user as UserWithRoleAndPermissions;

		const student = await prisma.student.findUnique({
			where: { userId: user.id },
		});

		if (!student) {
			throw new AppError("Student profile not found", 404);
		}

		const review = await prisma.lMSReview.findUnique({
			where: { id },
		});

		if (!review) {
			throw new AppError("Review not found", 404);
		}

		if (review.studentId !== student.id) {
			throw new AppError("You can only delete your own reviews", 403);
		}

		const courseId = review.courseId;

		await prisma.lMSReview.delete({
			where: { id },
		});

		await updateCourseRatingStats(courseId);

		await invalidateCachePattern(`courses:${courseId}*`);
		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSReview",
			entityId: id,
			description: `Deleted review for course ${courseId}`,
			performedById: user.id,
		});
		res.status(200).json({
			success: true,
			message: "Review deleted successfully",
		});
	},
);

async function updateCourseRatingStats(courseId: string) {
	const stats = await prisma.lMSReview.aggregate({
		where: { courseId },
		_avg: { rating: true },
		_count: { rating: true },
	});

	await prisma.lMSCourse.update({
		where: { id: courseId },
		data: {
			averageRating: stats._avg.rating || 0,
			totalReviews: stats._count.rating,
		},
	});
}
