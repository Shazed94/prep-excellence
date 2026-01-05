import {
	ZGradeTextAnswerSchema,
	ZQueryParams,
	ZRecalculateScoreSchema,
} from "@prepexcellence/shared-validators";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

// ==================== TEACHER GRADING CONTROLLER ====================
export class TeacherGradingController {
	/**
	 * Get all pending text answers that need grading
	 */
	getPendingAnswers = asyncHandler(async (req, res) => {
		const { page, limit } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		// Get attempts that have ungraded text answers
		const [attempts, total] = await Promise.all([
			prisma.studentSATAttempt.findMany({
				where: {
					answers: {
						some: {
							isManuallyGraded: false,
							textAnswer: {
								not: null,
							},
							question: {
								optionType: "SHORT_ANSWER",
							},
						},
					},
				},
				skip,
				take: limit,
				orderBy: {
					createdAt: "desc",
				},
				include: {
					student: {
						select: {
							id: true,
							guardianPhone: true,
							guardianName: true,
							guardianEmail: true,
							user: {
								select: {
									id: true,
									name: true,
									email: true,
								},
							},
						},
					},
					satPractice: {
						select: {
							id: true,
							name: true,
						},
					},
					answers: {
						where: {
							isManuallyGraded: false,
							textAnswer: {
								not: null,
							},
							question: {
								optionType: "SHORT_ANSWER",
							},
						},
						include: {
							question: {
								include: {
									options: {
										orderBy: { orderIndex: "asc" },
									},
								},
							},
						},
						orderBy: {
							createdAt: "asc",
						},
					},
				},
			}),
			prisma.studentSATAttempt.count({
				where: {
					answers: {
						some: {
							isManuallyGraded: false,
							textAnswer: {
								not: null,
							},
							question: {
								optionType: "SHORT_ANSWER",
							},
						},
					},
				},
			}),
		]);

		return res.status(200).json({
			success: true,
			data: attempts,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
			message: "Pending answers retrieved successfully",
		});
	});

	/**
	 * Get graded answers for review
	 */
	getGradedAnswers = asyncHandler(async (req, res) => {
		const { page, limit, orderBy, sortBy } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		// Get attempts that have graded text answers
		const [attempts, total] = await Promise.all([
			prisma.studentSATAttempt.findMany({
				where: {
					answers: {
						some: {
							isManuallyGraded: true,
							textAnswer: {
								not: null,
							},
						},
					},
				},
				skip,
				take: limit,
				orderBy: {
					[orderBy]: sortBy,
				},
				include: {
					student: {
						select: {
							id: true,
							guardianPhone: true,
							guardianName: true,
							guardianEmail: true,
							user: {
								select: {
									id: true,
									name: true,
									email: true,
								},
							},
						},
					},
					satPractice: {
						select: {
							id: true,
							name: true,
						},
					},
					answers: {
						where: {
							isManuallyGraded: true,
							textAnswer: {
								not: null,
							},
						},
						include: {
							question: {
								include: {
									options: {
										orderBy: { orderIndex: "asc" },
									},
								},
							},
							gradedByTeacher: {
								select: {
									id: true,
									user: {
										select: {
											id: true,
											name: true,
											email: true,
										},
									},
								},
							},
						},
						orderBy: {
							gradedAt: "desc",
						},
					},
				},
			}),
			prisma.studentSATAttempt.count({
				where: {
					answers: {
						some: {
							isManuallyGraded: true,
							textAnswer: {
								not: null,
							},
						},
					},
				},
			}),
		]);

		return res.status(200).json({
			success: true,
			data: attempts,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
			message: "Graded answers retrieved successfully",
		});
	});

	/**
	 * Grade a text answer
	 */
	gradeTextAnswer = asyncHandler(async (req, res) => {
		const data = ZGradeTextAnswerSchema.parse(req.body);
		const { answerId, isCorrect, pointsEarned, teacherFeedback } = data;

		const gradedByTeacherId = req.user?.teacher?.id as string;

		if (!gradedByTeacherId) {
			throw AppError.forbidden(
				"Only teachers can create or update SAT practices",
			);
		}
		// Get the answer
		const answer = await prisma.studentAnswer.findUnique({
			where: { id: answerId },
			include: {
				question: true,
				attempt: true,
			},
		});

		if (!answer) {
			throw new AppError("Answer not found", 404);
		}

		if (!answer.textAnswer) {
			throw new AppError("This is not a text answer", 400);
		}

		if (answer.isManuallyGraded) {
			throw new AppError("This answer has already been graded", 400);
		}

		// Validate points earned doesn't exceed question points
		if (pointsEarned > answer.question.points) {
			throw new AppError(
				`Points earned cannot exceed question points (${answer.question.points})`,
				400,
			);
		}

		// Update the answer
		const gradedAnswer = await prisma.studentAnswer.update({
			where: { id: answerId },
			data: {
				isCorrect,
				pointsEarned,
				teacherFeedback,
				isManuallyGraded: true,
				gradedByTeacherId,
				gradedAt: new Date(),
			},
			include: {
				question: {
					include: {
						options: {
							orderBy: { orderIndex: "asc" },
						},
					},
				},
				gradedByTeacher: {
					select: {
						id: true,
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
				},
			},
		});

		// Recalculate the attempt score
		await this.recalculateScoreInternal(answer.attemptId);

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "StudentAnswer",
			entityId: gradedAnswer.id,
			description: `Graded text answer: ${isCorrect ? "Correct" : "Incorrect"} (${pointsEarned} points)`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: gradedAnswer,
			message: "Answer graded successfully",
		});
	});

	/**
	 * Update an existing graded answer
	 */
	updateGradedAnswer = asyncHandler(async (req, res) => {
		const answerId = req.params.answerId as string;
		const data = ZGradeTextAnswerSchema.omit({ answerId: true }).parse(
			req.body,
		);
		const { isCorrect, pointsEarned, teacherFeedback } = data;

		const gradedByTeacherId = req.user?.teacher?.id as string;

		if (!gradedByTeacherId) {
			throw new AppError(
				"You must be logged in as a teacher to grade answers.",
				403,
			);
		}

		// Get the answer
		const answer = await prisma.studentAnswer.findUnique({
			where: { id: answerId },
			include: {
				question: true,
				attempt: true,
			},
		});

		if (!answer) {
			throw new AppError("Answer not found", 404);
		}

		if (!answer.textAnswer) {
			throw new AppError("This is not a text answer", 400);
		}

		// Validate points earned doesn't exceed question points
		if (pointsEarned > answer.question.points) {
			throw new AppError(
				`Points earned cannot exceed question points (${answer.question.points})`,
				400,
			);
		}

		// Update the answer
		const updatedAnswer = await prisma.studentAnswer.update({
			where: { id: answerId },
			data: {
				isCorrect,
				pointsEarned,
				teacherFeedback,
				isManuallyGraded: true,
				gradedByTeacherId,
				gradedAt: new Date(),
			},
			include: {
				question: {
					include: {
						options: {
							orderBy: { orderIndex: "asc" },
						},
					},
				},
				gradedByTeacher: {
					select: {
						id: true,
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
				},
			},
		});

		// Recalculate the attempt score
		await this.recalculateScoreInternal(answer.attemptId);

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "StudentAnswer",
			entityId: updatedAnswer.id,
			description: `Updated graded answer: ${isCorrect ? "Correct" : "Incorrect"} (${pointsEarned} points)`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updatedAnswer,
			message: "Graded answer updated successfully",
		});
	});

	/**
	 * Bulk grade multiple answers
	 */
	bulkGradeAnswers = asyncHandler(async (req, res) => {
		const { answers } = req.body as {
			answers: Array<{
				answerId: string;
				isCorrect: boolean;
				pointsEarned: number;
				teacherFeedback?: string;
			}>;
		};

		const gradedByTeacherId = req.body.gradedByTeacherId as string;

		if (!Array.isArray(answers) || answers.length === 0) {
			throw new AppError("Answers array is required", 400);
		}

		// Grade all answers in a transaction
		const results = await prisma.$transaction(
			answers.map((ans) =>
				prisma.studentAnswer.update({
					where: { id: ans.answerId },
					data: {
						isCorrect: ans.isCorrect,
						pointsEarned: ans.pointsEarned,
						teacherFeedback: ans.teacherFeedback,
						isManuallyGraded: true,
						gradedByTeacherId,
						gradedAt: new Date(),
					},
					include: {
						attempt: {
							select: {
								id: true,
							},
						},
					},
				}),
			),
		);

		// Get unique attempt IDs and recalculate scores
		const attemptIds = [...new Set(results.map((r) => r.attempt.id))];

		for (const attemptId of attemptIds) {
			await this.recalculateScoreInternal(attemptId);
		}

		return res.status(200).json({
			success: true,
			data: results,
			message: `${results.length} answers graded successfully`,
		});
	});

	/**
	 * Recalculate score for an attempt
	 */
	recalculateScore = asyncHandler(async (req, res) => {
		const { attemptId } = ZRecalculateScoreSchema.parse(req.body);

		await this.recalculateScoreInternal(attemptId);

		const attempt = await prisma.studentSATAttempt.findUnique({
			where: { id: attemptId },
			include: {
				answers: {
					include: {
						question: true,
					},
				},
			},
		});

		return res.status(200).json({
			success: true,
			data: attempt,
			message: "Score recalculated successfully",
		});
	});

	/**
	 * Internal helper to recalculate score
	 */
	private recalculateScoreInternal = async (attemptId: string) => {
		// Get all answers for this attempt
		const answers = await prisma.studentAnswer.findMany({
			where: { attemptId },
			include: {
				question: true,
			},
		});

		// Calculate total score
		const totalScore = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
		const maxScore = answers.reduce((sum, a) => sum + a.question.points, 0);
		const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

		// Check if there are any ungraded text answers
		const hasUngradedAnswers = answers.some(
			(a) => a.textAnswer && !a.isManuallyGraded,
		);

		// Update attempt status and scores
		await prisma.studentSATAttempt.update({
			where: { id: attemptId },
			data: {
				status: hasUngradedAnswers ? "SUBMITTED" : "GRADED",
				totalScore,
				maxScore,
				percentageScore,
			},
		});
	};

	/**
	 * Get grading statistics for a SAT practice test
	 */
	getGradingStats = asyncHandler(async (req, res) => {
		const satPracticeId = req.params.satPracticeId as string;

		// Get all attempts for this SAT practice
		const attempts = await prisma.studentSATAttempt.findMany({
			where: { satPracticeId: satPracticeId },
			include: {
				answers: {
					where: {
						textAnswer: {
							not: null,
						},
					},
				},
			},
		});

		const totalAttempts = attempts.length;
		const totalTextAnswers = attempts.reduce(
			(sum, a) => sum + a.answers.length,
			0,
		);
		const gradedAnswers = attempts.reduce(
			(sum, a) => sum + a.answers.filter((ans) => ans.isManuallyGraded).length,
			0,
		);
		const pendingAnswers = totalTextAnswers - gradedAnswers;

		const stats = {
			totalAttempts,
			totalTextAnswers,
			gradedAnswers,
			pendingAnswers,
			gradingProgress:
				totalTextAnswers > 0
					? ((gradedAnswers / totalTextAnswers) * 100).toFixed(2)
					: "0.00",
			fullyGradedAttempts: attempts.filter((a) => a.status === "GRADED").length,
			partiallyGradedAttempts: attempts.filter((a) => a.status === "SUBMITTED")
				.length,
		};

		return res.status(200).json({
			success: true,
			data: stats,
			message: "Grading statistics retrieved successfully",
		});
	});
}
