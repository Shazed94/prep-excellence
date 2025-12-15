import {
	createLMSQuizSchema,
	submitQuizAttemptSchema,
	updateLMSQuizSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/client";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere, castFilterValue } from "@/utils/filters";

/**
 * Create LMS Quiz
 * POST /api/lms/modules/:moduleId/quizzes
 */
export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
	const { moduleId } = req.params;
	const validated = createLMSQuizSchema.parse(req.body);

	const quiz = await prisma.lMSQuiz.create({
		data: {
			...validated,
			moduleId,
		},
	});

	res.status(201).json({
		success: true,
		data: quiz,
	});
});

/**
 * Get Quiz Details
 * GET /api/lms/quizzes/:id
 */
export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const quiz = await prisma.lMSQuiz.findUnique({
		where: { id },
	});

	if (!quiz) {
		throw new AppError("Quiz not found", 404);
	}

	res.json({
		success: true,
		data: quiz,
	});
});

/**
 * Update LMS Quiz
 * PATCH /api/lms/quizzes/:id
 */
export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const validated = updateLMSQuizSchema.parse(req.body);

	const quiz = await prisma.lMSQuiz.update({
		where: { id },
		data: validated,
	});

	// Invalidate quiz attempts cache
	await invalidateCachePattern(`quiz-attempts:${id}:*`);

	res.json({
		success: true,
		data: quiz,
	});
});

/**
 * Submit Quiz Attempt
 * POST /api/lms/quizzes/:quizId/attempts
 */
export const submitQuizAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { quizId } = req.params;
		const validated = submitQuizAttemptSchema.parse(req.body);
		const { enrollmentId, answers, timeSpent } = validated;
		const studentId = req.user?.student?.id;

		if (!studentId) {
			throw new AppError("Student profile not found", 403);
		}

		// Get quiz details
		const quiz = await prisma.lMSQuiz.findUnique({
			where: { id: quizId },
		});

		if (!quiz) {
			throw new AppError("Quiz not found", 404);
		}

		// Check enrollment
		const enrollment = await prisma.lMSEnrollment.findUnique({
			where: { id: enrollmentId },
		});

		if (
			!enrollment ||
			enrollment.status !== "ACTIVE" ||
			enrollment.studentId !== studentId
		) {
			throw new AppError("Invalid or inactive enrollment", 403);
		}

		// Calculate score
		const questions = quiz.questions as Array<{
			id: string;
			question: string;
			questionType: string;
			correctAnswer: string;
			points?: number;
		}>;
		let correctAnswers = 0;
		let totalPoints = 0;

		questions.forEach((question) => {
			totalPoints += question.points || 1;
			const userAnswer = answers[question.id];

			if (userAnswer === question.correctAnswer) {
				correctAnswers += question.points || 1;
			}
		});

		const score = (correctAnswers / totalPoints) * 100;
		const isPassed = score >= (quiz.passingScore || 70);

		// Create attempt
		const attempt = await prisma.lMSQuizAttempt.create({
			data: {
				quizId,
				studentId,
				answers: answers as Prisma.InputJsonValue,
				score,
				isPassed,
				timeSpent,
			},
		});

		res.status(201).json({
			success: true,
			data: {
				...attempt,
				correctAnswers,
				totalQuestions: questions.length,
				totalPoints,
			},
		});
	},
);

/**
 * Get Quiz Attempts for Enrollment
 * GET /api/lms/quizzes/:quizId/attempts
 */
export const getQuizAttempts = asyncHandler(
	async (req: Request, res: Response) => {
		const { quizId } = req.params;
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const cacheKey = `quiz-attempts:${quizId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Quiz attempts fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS = ["enrollmentId", "isPassed"];
		const where = buildWhere(filters, ALLOWED_FILTERS);
		where.quizId = quizId;

		if (filters?.isPassed !== undefined) {
			where.isPassed = castFilterValue(filters.isPassed);
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [attempts, total] = await Promise.all([
			prisma.lMSQuizAttempt.findMany({
				where,
				skip,
				take: limit,
				orderBy: orderClause,
			}),
			prisma.lMSQuizAttempt.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const pagination = {
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		await cached.set(
			cacheKey,
			JSON.stringify({ data: attempts, pagination }),
			60,
		);

		res.json({
			success: true,
			data: attempts,
			pagination,
		});
	},
);

/**
 * Delete LMS Quiz
 * DELETE /api/lms/quizzes/:id
 */
export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	await prisma.lMSQuiz.delete({
		where: { id },
	});

	// Invalidate quiz attempts cache
	await invalidateCachePattern(`quiz-attempts:${id}:*`);

	res.json({
		success: true,
		message: "Quiz deleted successfully",
	});
});
