import {
	createLMSDiscussionSchema,
	createLMSReviewSchema,
	enrollInLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Enroll in LMS Course
 * POST /api/lms/courses/:courseId/enroll
 */
export const enrollInCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		enrollInLMSCourseSchema.parse(req.body); // Validate but don't use
		const studentId = req.user?.student?.id;

		if (!studentId) {
			throw new AppError("Student profile not found", 403);
		}

		// Check if course exists and is published
		const course = await prisma.lMSCourse.findUnique({
			where: { id: courseId },
		});

		if (!course) {
			throw new AppError("Course not found", 404);
		}

		if (!course.isPublished) {
			throw new AppError("Course is not published", 403);
		}

		// Check if student already enrolled
		const existingEnrollment = await prisma.lMSEnrollment.findFirst({
			where: {
				courseId,
				studentId,
			},
		});

		if (existingEnrollment) {
			throw new AppError("Already enrolled in this course", 409);
		}

		// Create enrollment (payment handling done separately)
		const enrollment = await prisma.lMSEnrollment.create({
			data: {
				courseId,
				studentId,
				status: "ACTIVE", // Activated immediately for now, payment flow to be implemented
			},
			include: {
				course: {
					select: {
						title: true,
						thumbnail: true,
						price: true,
					},
				},
			},
		});

		res.status(201).json({
			success: true,
			data: enrollment,
			message: "Enrollment created successfully.",
		});
	},
);

/**
 * Get Student's Enrollments
 * GET /api/lms/enrollments
 */
export const getStudentEnrollments = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId } = req.query;

		if (!studentId) {
			throw new AppError("studentId is required", 400);
		}

		const enrollments = await prisma.lMSEnrollment.findMany({
			where: { studentId: studentId as string },
			include: {
				course: {
					select: {
						id: true,
						title: true,
						thumbnail: true,
						level: true,
						instructor: {
							include: {
								user: { select: { name: true, image: true } },
							},
						},
					},
				},
			},
			orderBy: { enrolledAt: "desc" },
		});

		res.json({
			success: true,
			data: enrollments,
		});
	},
);

/**
 * Create Discussion Post
 * POST /api/lms/courses/:courseId/discussions
 */
export const createDiscussion = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSDiscussionSchema.parse(req.body);
		const authorId = req.user?.id;

		if (!authorId) {
			throw new AppError("User not authenticated", 401);
		}

		const discussion = await prisma.lMSDiscussion.create({
			data: {
				...validated,
				authorId,
			},
			include: {
				author: {
					select: { name: true, image: true },
				},
			},
		});

		res.status(201).json({
			success: true,
			data: discussion,
		});
	},
);

/**
 * Get Course Discussions
 * GET /api/lms/courses/:courseId/discussions
 */
export const getCourseDiscussions = asyncHandler(
	async (req: Request, res: Response) => {
		const { lessonId } = req.query;

		if (!lessonId) {
			throw new AppError("lessonId is required", 400);
		}

		const discussions = await prisma.lMSDiscussion.findMany({
			where: { lessonId: lessonId as string },
			include: {
				author: {
					select: { name: true, image: true },
				},
				lesson: {
					select: { title: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		res.json({
			success: true,
			data: discussions,
		});
	},
);

/**
 * Create Course Review
 * POST /api/lms/courses/:courseId/reviews
 */
export const createReview = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const validated = createLMSReviewSchema.parse(req.body);
		const studentId = req.user?.student?.id;

		if (!studentId) {
			throw new AppError("Student profile not found", 403);
		}

		// Check if student has an active enrollment
		const enrollment = await prisma.lMSEnrollment.findFirst({
			where: {
				courseId,
				studentId,
				status: "ACTIVE",
			},
		});

		if (!enrollment) {
			throw new AppError(
				"You must be enrolled in the course to leave a review",
				403,
			);
		}

		// Check if student already reviewed
		const existingReview = await prisma.lMSReview.findFirst({
			where: {
				courseId,
				studentId,
			},
		});

		if (existingReview) {
			throw new AppError("You have already reviewed this course", 409);
		}

		const review = await prisma.lMSReview.create({
			data: {
				courseId,
				studentId,
				rating: validated.rating,
				comment: validated.comment,
			},
			include: {
				student: {
					include: {
						user: { select: { name: true, image: true } },
					},
				},
			},
		});

		// Update course average rating
		const stats = await prisma.lMSReview.aggregate({
			where: { courseId },
			_avg: { rating: true },
			_count: true,
		});

		await prisma.lMSCourse.update({
			where: { id: courseId },
			data: {
				averageRating: stats._avg.rating || 0,
				totalReviews: stats._count,
			},
		});

		res.status(201).json({
			success: true,
			data: review,
		});
	},
);

/**
 * Get Course Reviews
 * GET /api/lms/courses/:courseId/reviews
 */
export const getCourseReviews = asyncHandler(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const { page = 1, limit = 20, rating } = req.query;

		const where: any = { courseId };
		if (rating) {
			where.rating = Number(rating);
		}

		const [reviews, total] = await Promise.all([
			prisma.lMSReview.findMany({
				where,
				include: {
					student: {
						include: {
							user: { select: { name: true, image: true } },
						},
					},
				},
				skip: (Number(page) - 1) * Number(limit),
				take: Number(limit),
				orderBy: { createdAt: "desc" },
			}),
			prisma.lMSReview.count({ where }),
		]);

		res.json({
			success: true,
			data: reviews,
			pagination: {
				page: Number(page),
				limit: Number(limit),
				total,
				totalPages: Math.ceil(total / Number(limit)),
			},
		});
	},
);
