import {
	addQuizQuestionSchema,
	createLMSQuizSchema,
	submitQuizAttemptSchema,
	updateLMSQuizSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere, castFilterValue } from "@/utils/filters";

/**
 * Create LMS Quiz (Simple - without questions)
 * POST /api/lms/modules/:moduleId/quizzes
 */
export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
	const { moduleId } = req.params;
	const validated = createLMSQuizSchema.parse(req.body);

	const module = await prisma.lMSModule.findUnique({
		where: { id: moduleId },
	});

	if (!module) {
		throw new AppError("Module not found", 404);
	}

	const quiz = await prisma.lMSQuiz.create({
		data: {
			...validated,
			moduleId,
		},
	});

	res.status(201).json({
		success: true,
		data: quiz,
		message: "Quiz created successfully",
	});
});

/**
 * Create LMS Quiz with Questions and Options (Complete)
 * POST /api/lms/modules/:moduleId/quizzes/complete
 */
// export const createQuizWithQuestions = asyncHandler(
// 	async (req: Request, res: Response) => {
// 		const { moduleId } = req.params;
// 		const validated = createLMSQuizWithQuestionsSchema.parse(req.body);

// 		// Verify module exists
// 		const module = await prisma.lMSModule.findUnique({
// 			where: { id: moduleId },
// 		});

// 		if (!module) {
// 			throw new AppError("Module not found", 404);
// 		}

// 		// Use transaction to create quiz with all questions and options
// 		const result = await prisma.$transaction(async (tx) => {
// 			// Create the quiz
// 			const quiz = await tx.lMSQuiz.create({
// 				data: {
// 					title: validated.title,
// 					description: validated.description,
// 					orderIndex: validated.orderIndex,
// 					passingScore: validated.passingScore,
// 					timeLimit: validated.timeLimit,
// 					maxAttempts: validated.maxAttempts,
// 					shuffleQuestions: validated.shuffleQuestions,
// 					showResults: validated.showResults,
// 					moduleId,
// 				},
// 			});

// 			// Create all questions with their options
// 			const questions = await Promise.all(
// 				validated.questions.map(async (questionData) => {
// 					const question = await tx.lMSQuizQuestion.create({
// 						data: {
// 							question: questionData.question,
// 							type: questionData.type,
// 							orderIndex: questionData.orderIndex,
// 							points: questionData.points,
// 							explanation: questionData.explanation,
// 							quizId: quiz.id,
// 						},
// 					});

// 					// Create options if provided (for MCQ types)
// 					if (questionData.options && questionData.options.length > 0) {
// 						const options = await Promise.all(
// 							questionData.options.map((optionData) =>
// 								tx.lMSQuizQuestionOption.create({
// 									data: {
// 										text: optionData.text,
// 										isCorrect: optionData.isCorrect,
// 										orderIndex: optionData.orderIndex,
// 										questionId: question.id,
// 									},
// 								}),
// 							),
// 						);

// 						return {
// 							...question,
// 							options,
// 						};
// 					}

// 					return question;
// 				}),
// 			);

// 			return {
// 				...quiz,
// 				questions,
// 			};
// 		});

// 		res.status(201).json({
// 			success: true,
// 			data: result,
// 			message: "Quiz with questions created successfully",
// 		});
// 	},
// );

/**
 * Add Question to Existing Quiz
 * POST /api/lms/quizzes/:quizId/questions
 */
export const addQuizQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { quizId } = req.params;
		const validated = addQuizQuestionSchema.parse(req.body);

		const quiz = await prisma.lMSQuiz.findUnique({
			where: { id: quizId },
		});

		if (!quiz) {
			throw new AppError("Quiz not found", 404);
		}

		const result = await prisma.$transaction(async (tx) => {
			const question = await tx.lMSQuizQuestion.create({
				data: {
					question: validated.question,
					type: validated.type,
					orderIndex: validated.orderIndex,
					points: validated.points,
					explanation: validated.explanation,
					quizId,
				},
			});

			if (validated.options && validated.options.length > 0) {
				const options = await Promise.all(
					validated.options.map((optionData) =>
						tx.lMSQuizQuestionOption.create({
							data: {
								text: optionData.text,
								isCorrect: optionData.isCorrect,
								orderIndex: optionData.orderIndex,
								questionId: question.id,
							},
						}),
					),
				);

				return {
					...question,
					options,
				};
			}

			return question;
		});

		await invalidateCachePattern(`quiz:${quizId}*`);

		res.status(201).json({
			success: true,
			data: result,
			message: "Question added successfully",
		});
	},
);

/**
 * Get Quiz Details with Questions and Options
 * GET /api/lms/quizzes/:id
 */
export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
	const { id } = ZCuid.parse(req.params);
	const { includeAnswers } = req.query;

	const cacheKey = `quiz:${id}:answers=${includeAnswers || false}`;
	const cachedData = await cached.get(cacheKey);

	if (cachedData) {
		return res.json({
			success: true,
			data: JSON.parse(cachedData),
			message: "Quiz fetched successfully (from cache)",
		});
	}

	const quiz = await prisma.lMSQuiz.findUnique({
		where: { id },
		include: {
			questions: {
				orderBy: { orderIndex: "asc" },
				include: {
					options: {
						orderBy: { orderIndex: "asc" },
						select: {
							id: true,
							text: true,
							orderIndex: true,
							// Only include isCorrect for admin/instructor view
							isCorrect: includeAnswers === "true",
						},
					},
				},
			},
			module: {
				select: {
					id: true,
					title: true,
					courseId: true,
				},
			},
		},
	});

	if (!quiz) {
		throw new AppError("Quiz not found", 404);
	}

	await cached.set(cacheKey, JSON.stringify(quiz), 300);

	return res.json({
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
		const { answers, timeSpent } = validated;
		const studentId = req.user?.student?.id;

		if (!studentId) {
			throw new AppError("Student profile not found", 403);
		}

		// Get quiz with questions and options
		const quiz = await prisma.lMSQuiz.findUnique({
			where: { id: quizId },
			include: {
				questions: {
					include: {
						options: true,
					},
				},
				module: {
					include: {
						course: {
							include: {
								enrollments: {
									where: {
										studentId,
										status: "ACTIVE",
									},
								},
							},
						},
					},
				},
			},
		});

		if (!quiz) {
			throw new AppError("Quiz not found", 404);
		}

		// Verify enrollment
		if (
			!quiz.module.course.enrollments ||
			quiz.module.course.enrollments.length === 0
		) {
			throw new AppError(
				"You must be enrolled in the course to take this quiz",
				403,
			);
		}

		// Check max attempts
		if (quiz.maxAttempts) {
			const attemptCount = await prisma.lMSQuizAttempt.count({
				where: {
					quizId,
					studentId,
				},
			});

			if (attemptCount >= quiz.maxAttempts) {
				throw new AppError(
					`Maximum attempts (${quiz.maxAttempts}) reached for this quiz`,
					400,
				);
			}
		}

		// Use transaction to create attempt and answers
		const result = await prisma.$transaction(async (tx) => {
			let correctAnswersCount = 0;
			let totalPoints = 0;
			let earnedPoints = 0;

			// Create the attempt first
			const attempt = await tx.lMSQuizAttempt.create({
				data: {
					quizId,
					studentId,
					totalQuestions: quiz.questions.length,
					timeSpent,
					submittedAt: new Date(),
				},
			});

			// Process each answer
			const answerRecords = await Promise.all(
				answers.map(async (answer) => {
					const question = quiz.questions.find(
						(q) => q.id === answer.questionId,
					);

					if (!question) {
						throw new AppError(`Question ${answer.questionId} not found`, 400);
					}

					totalPoints += question.points;
					let isCorrect = false;
					let pointsEarned = 0;

					// Check answer based on question type
					if (
						question.type === "MCQ_SINGLE" ||
						question.type === "TRUE_FALSE"
					) {
						if (answer.selectedOptionId) {
							const selectedOption = question.options.find(
								(opt) => opt.id === answer.selectedOptionId,
							);
							if (selectedOption?.isCorrect) {
								isCorrect = true;
								pointsEarned = question.points;
								correctAnswersCount++;
							}
						}
					} else if (question.type === "MCQ_MULTIPLE") {
						// For multiple choice, would need to compare all selected options
						// Simplified: check if selected option is one of the correct ones
						if (answer.selectedOptionId) {
							const selectedOption = question.options.find(
								(opt) => opt.id === answer.selectedOptionId,
							);
							if (selectedOption?.isCorrect) {
								isCorrect = true;
								pointsEarned = question.points;
								correctAnswersCount++;
							}
						}
					}
					// For SHORT and LONG types, manual grading would be needed
					// Can be implemented later with instructor review

					// Create answer record
					return tx.lMSQuizAnswer.create({
						data: {
							attemptId: attempt.id,
							questionId: question.id,
							selectedOptionId: answer.selectedOptionId,
							textAnswer: answer.textAnswer,
							isCorrect,
							pointsEarned,
						},
					});
				}),
			);

			earnedPoints = answerRecords.reduce(
				(sum, ans) => sum + ans.pointsEarned,
				0,
			);

			// Calculate final score percentage
			const scorePercentage =
				totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
			const isPassed = scorePercentage >= quiz.passingScore;

			// Update attempt with final scores
			const updatedAttempt = await tx.lMSQuizAttempt.update({
				where: { id: attempt.id },
				data: {
					score: scorePercentage,
					correctAnswers: correctAnswersCount,
					isPassed,
					completedAt: new Date(),
				},
				include: {
					answers: {
						include: {
							question: {
								select: {
									id: true,
									question: true,
									type: true,
									explanation: true,
									points: true,
								},
							},
							selectedOption: {
								select: {
									id: true,
									text: true,
									isCorrect: true,
								},
							},
						},
					},
				},
			});

			return {
				attempt: updatedAttempt,
				totalQuestions: quiz.questions.length,
				correctAnswers: correctAnswersCount,
				totalPoints,
				earnedPoints,
			};
		});

		res.status(201).json({
			success: true,
			data: result,
			message: result.attempt.isPassed
				? "Congratulations! You passed the quiz."
				: "Quiz completed. Keep practicing!",
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

		return res.json({
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
