import {
	ZCCoachingExamQuestionSchema,
	ZCCoachingExamSchema,
	ZReorderExamQuestionsSchema,
	ZSubmitExamAttemptSchema,
	ZUCoachingExamQuestionOptionSchema,
	ZUCoachingExamQuestionSchema,
	ZUCoachingExamSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export const createExam = asyncHandler(async (req: Request, res: Response) => {
	const validated = ZCCoachingExamSchema.parse(req.body);
	const {
		lessonId,
		title,
		description,
		timeLimit,
		passingScore,
		maxAttempts,
		shuffleQuestions,
		showResults,
	} = validated;

	// Validate course type
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: {
			courseModule: { select: { course: { select: { courseType: true } } } },
		},
	});
	if (!lesson) throw AppError.notFound("Lesson not found");
	if (lesson.courseModule.course.courseType !== "COACHING") {
		throw AppError.badRequest("Not a Coaching lesson");
	}

	const existing = await prisma.exam.findUnique({
		where: { lessonId },
	});
	if (existing) {
		throw AppError.badRequest("Exam already exists for this lesson");
	}

	const exam = await prisma.exam.create({
		data: {
			lessonId,
			title,
			description,
			timeLimit: timeLimit ?? null,
			passingScore: passingScore ?? 70,
			maxAttempts: maxAttempts ?? null,
			shuffleQuestions: shuffleQuestions ?? false,
			showResults: showResults ?? true,
		},
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "CoachingExam",
		entityId: exam.id,
		description: `Exam created: ${title}`,
		performedById: req.user?.id,
	});

	res.status(201).json({ success: true, data: exam });
});

export const getExamByLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { lessonId } = req.params;

		const exam = await prisma.exam.findUnique({
			where: { lessonId },
			include: {
				questions: { orderBy: { orderIndex: "asc" } },
				_count: { select: { submissions: true } },
			},
		});
		if (!exam) throw AppError.notFound("Exam not found");

		res.status(200).json({ success: true, data: exam });
	},
);

export const getExam = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const exam = await prisma.exam.findUnique({
		where: { id },
		include: {
			lesson: {
				select: {
					id: true,
					title: true,
					courseModule: { select: { id: true, title: true, courseId: true } },
				},
			},
			questions: { orderBy: { orderIndex: "asc" } },
			submissions: {
				orderBy: { createdAt: "desc" },
				take: 50,
				include: {
					student: {
						select: {
							id: true,
							user: { select: { name: true, email: true } },
						},
					},
				},
			},
		},
	});
	if (!exam) throw AppError.notFound("Exam not found");

	res.status(200).json({ success: true, data: exam });
});

export const updateExam = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const validated = ZUCoachingExamSchema.parse(req.body);
	const {
		title,
		description,
		timeLimit,
		passingScore,
		maxAttempts,
		shuffleQuestions,
		showResults,
	} = validated;

	const exam = await prisma.exam.findUnique({ where: { id } });
	if (!exam) throw AppError.notFound("Exam not found");

	const data: Record<string, unknown> = {};
	if (title !== undefined) data.title = title;
	if (description !== undefined) data.description = description;
	if (timeLimit !== undefined) data.timeLimit = timeLimit;
	if (passingScore !== undefined) data.passingScore = passingScore;
	if (maxAttempts !== undefined) data.maxAttempts = maxAttempts;
	if (shuffleQuestions !== undefined) data.shuffleQuestions = shuffleQuestions;
	if (showResults !== undefined) data.showResults = showResults;

	const updated = await prisma.exam.update({ where: { id }, data });

	await createAuditLogFromRequest(req, {
		action: AuditAction.UPDATE,
		module: "CoachingExam",
		entityId: id,
		description: `Exam updated: ${updated.title}`,
		performedById: req.user?.id,
	});

	res.status(200).json({ success: true, data: updated });
});

export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const exam = await prisma.exam.findUnique({ where: { id } });
	if (!exam) throw AppError.notFound("Exam not found");

	await prisma.exam.delete({ where: { id } });

	await createAuditLogFromRequest(req, {
		action: AuditAction.DELETE,
		module: "CoachingExam",
		entityId: id,
		description: `Exam deleted: ${exam.title}`,
		performedById: req.user?.id,
	});

	res.status(200).json({ success: true, message: "Exam deleted successfully" });
});

/**
 * Start an exam submission (replaces old "startAttempt")
 * POST /api/coaching/exams/:id/start
 */
export const startAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user?.student?.id;

		if (!studentId) throw AppError.notFound("Student profile not found");

		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Exam not found");

		const submissionsCount = await prisma.examSubmission.count({
			where: { examId: id, studentId },
		});
		if (exam.maxAttempts && submissionsCount >= exam.maxAttempts) {
			throw AppError.badRequest("Maximum attempts reached");
		}

		const submission = await prisma.examSubmission.create({
			data: { examId: id, studentId, status: "DRAFT" },
		});

		res.status(201).json({ success: true, data: submission });
	},
);

/**
 * Submit exam answers
 * POST /api/coaching/exams/:attemptId/submit
 */
export const submitAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { attemptId } = req.params;
		const { answers } = ZSubmitExamAttemptSchema.parse(req.body);

		const submission = await prisma.examSubmission.findUnique({
			where: { id: attemptId },
			include: {
				exam: {
					include: {
						questions: { include: { options: true } },
					},
				},
			},
		});
		if (!submission) throw AppError.notFound("Submission not found");
		if (submission.status !== "DRAFT") {
			throw AppError.badRequest("Submission already completed");
		}

		let earnedPoints = 0;
		let correctAnswers = 0;
		const totalQuestions = submission.exam.questions.length;

		// Create ExamAnswer records and grade MCQ answers
		const answerCreates = answers.map((ans) => {
			const question = submission.exam.questions.find(
				(q) => q.id === ans.questionId,
			);
			let isCorrect = false;
			let pointsEarned = 0;

			if (ans.selectedOptionId && question) {
				const option = question.options.find(
					(o) => o.id === ans.selectedOptionId,
				);
				isCorrect = option?.isCorrect ?? false;
				if (isCorrect) {
					pointsEarned = question.points ?? 1;
					earnedPoints += pointsEarned;
					correctAnswers++;
				}
			}

			return prisma.examAnswer.create({
				data: {
					submissionId: attemptId,
					questionId: ans.questionId,
					selectedOptionId: ans.selectedOptionId ?? null,
					textAnswer: ans.textAnswer ?? null,
					isCorrect,
					pointsEarned,
				},
			});
		});

		await Promise.all(answerCreates);

		const totalPoints = submission.exam.questions.reduce(
			(sum, q) => sum + (q.points ?? 1),
			0,
		);
		const score =
			totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
		const isPassed = score >= (submission.exam.passingScore ?? 70);

		const updated = await prisma.examSubmission.update({
			where: { id: attemptId },
			data: {
				score,
				earnedPoints,
				totalPoints,
				totalQuestions,
				correctAnswers,
				isPassed,
				completedAt: new Date(),
				submittedAt: new Date(),
				status: "SUBMITTED",
			},
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const getAttempts = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const submissions = await prisma.examSubmission.findMany({
		where: { examId: id },
		orderBy: { createdAt: "desc" },
		include: {
			student: {
				select: { id: true, user: { select: { name: true, email: true } } },
			},
		},
	});

	res.status(200).json({ success: true, data: submissions });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Exam Question CRUD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a question (with optional options) for an exam
 * POST /api/coaching/exams/:examId/questions
 */
export const createQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { examId } = req.params;
		const validated = ZCCoachingExamQuestionSchema.parse(req.body);
		const { question, type, orderIndex, points, explanation, options } =
			validated;

		const exam = await prisma.exam.findUnique({ where: { id: examId } });
		if (!exam) throw AppError.notFound("Exam not found");

		const created = await prisma.examQuestion.create({
			data: {
				examId,
				question,
				type: type ?? "MCQ_SINGLE",
				orderIndex,
				points: points ?? 1,
				explanation,
				options: options?.length
					? {
							create: options.map((opt) => ({
								text: opt.text,
								isCorrect: opt.isCorrect,
								orderIndex: opt.orderIndex,
							})),
						}
					: undefined,
			},
			include: { options: { orderBy: { orderIndex: "asc" } } },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingExam",
			entityId: created.id,
			description: `Exam question created: ${question.substring(0, 50)}`,
			performedById: req.user?.id,
		});

		res.status(201).json({ success: true, data: created });
	},
);

/**
 * Update a question
 * PATCH /api/coaching/exams/:examId/questions/:questionId
 */
export const updateQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { questionId } = req.params;
		const validated = ZUCoachingExamQuestionSchema.parse(req.body);

		const existing = await prisma.examQuestion.findUnique({
			where: { id: questionId },
		});
		if (!existing) throw AppError.notFound("Question not found");

		const updated = await prisma.examQuestion.update({
			where: { id: questionId },
			data: validated,
			include: { options: { orderBy: { orderIndex: "asc" } } },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingExam",
			entityId: questionId,
			description: "Exam question updated",
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: updated });
	},
);

/**
 * Delete a question
 * DELETE /api/coaching/exams/:examId/questions/:questionId
 */
export const deleteQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { questionId } = req.params;

		const existing = await prisma.examQuestion.findUnique({
			where: { id: questionId },
		});
		if (!existing) throw AppError.notFound("Question not found");

		await prisma.examQuestion.delete({ where: { id: questionId } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingExam",
			entityId: questionId,
			description: "Exam question deleted",
			performedById: req.user?.id,
		});

		res
			.status(200)
			.json({ success: true, message: "Question deleted successfully" });
	},
);

/**
 * Reorder questions
 * PATCH /api/coaching/exams/:examId/questions/reorder
 */
export const reorderQuestions = asyncHandler(
	async (req: Request, res: Response) => {
		const { examId } = req.params;
		const { questions } = ZReorderExamQuestionsSchema.parse(req.body);

		const exam = await prisma.exam.findUnique({ where: { id: examId } });
		if (!exam) throw AppError.notFound("Exam not found");

		await prisma.$transaction(
			questions.map((q) =>
				prisma.examQuestion.update({
					where: { id: q.id },
					data: { orderIndex: q.orderIndex },
				}),
			),
		);

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingExam",
			entityId: examId,
			description: `Reordered ${questions.length} exam questions`,
			performedById: req.user?.id,
		});

		res
			.status(200)
			.json({ success: true, message: "Questions reordered successfully" });
	},
);

// ─────────────────────────────────────────────────────────────────────────────
//  Exam Question Option CRUD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update a question option
 * PATCH /api/coaching/exams/:examId/questions/:questionId/options/:optionId
 */
export const updateOption = asyncHandler(
	async (req: Request, res: Response) => {
		const { optionId } = req.params;
		const validated = ZUCoachingExamQuestionOptionSchema.parse(req.body);

		const existing = await prisma.examQuestionOption.findUnique({
			where: { id: optionId },
		});
		if (!existing) throw AppError.notFound("Option not found");

		const updated = await prisma.examQuestionOption.update({
			where: { id: optionId },
			data: validated,
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingExam",
			entityId: optionId,
			description: "Exam question option updated",
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: updated });
	},
);

/**
 * Delete a question option
 * DELETE /api/coaching/exams/:examId/questions/:questionId/options/:optionId
 */
export const deleteOption = asyncHandler(
	async (req: Request, res: Response) => {
		const { optionId } = req.params;

		const existing = await prisma.examQuestionOption.findUnique({
			where: { id: optionId },
		});
		if (!existing) throw AppError.notFound("Option not found");

		await prisma.examQuestionOption.delete({ where: { id: optionId } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingExam",
			entityId: optionId,
			description: "Exam question option deleted",
			performedById: req.user?.id,
		});

		res
			.status(200)
			.json({ success: true, message: "Option deleted successfully" });
	},
);

// ─────────────────────────────────────────────────────────────────────────────
//  Student-facing Exam Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get exam with questions for a student (without revealing correct answers)
 * GET /api/coaching/exams/:id/student
 */
export const getStudentExam = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user?.student?.id;
		if (!studentId) throw AppError.notFound("Student profile not found");

		const exam = await prisma.exam.findUnique({
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
								// isCorrect intentionally excluded
							},
						},
					},
				},
			},
		});
		if (!exam) throw AppError.notFound("Exam not found");

		// Add student's previous attempts info
		const previousAttempts = await prisma.examSubmission.findMany({
			where: { examId: id, studentId },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				score: true,
				status: true,
				isPassed: true,
				createdAt: true,
				completedAt: true,
			},
		});

		res.status(200).json({
			success: true,
			data: {
				...exam,
				previousAttempts,
			},
		});
	},
);

/**
 * Get student's own attempts for an exam
 * GET /api/coaching/exams/:id/my-attempts
 */
export const getMyAttempts = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user?.student?.id;
		if (!studentId) throw AppError.notFound("Student profile not found");

		const attempts = await prisma.examSubmission.findMany({
			where: { examId: id, studentId },
			orderBy: { createdAt: "desc" },
			include: {
				answers: {
					include: {
						question: {
							select: { id: true, question: true, type: true, points: true },
						},
						selectedOption: { select: { id: true, text: true } },
					},
				},
			},
		});

		res.status(200).json({ success: true, data: attempts });
	},
);

/**
 * Get a specific attempt detail (student's own)
 * GET /api/coaching/exams/attempts/:attemptId
 */
export const getAttemptDetail = asyncHandler(
	async (req: Request, res: Response) => {
		const { attemptId } = req.params;
		const studentId = req.user?.student?.id;
		if (!studentId) throw AppError.notFound("Student profile not found");

		const submission = await prisma.examSubmission.findUnique({
			where: { id: attemptId },
			include: {
				exam: {
					select: {
						id: true,
						title: true,
						description: true,
						passingScore: true,
						showResults: true,
						timeLimit: true,
					},
				},
				answers: {
					include: {
						question: {
							select: {
								id: true,
								question: true,
								type: true,
								points: true,
								explanation: true,
							},
						},
						selectedOption: {
							select: { id: true, text: true, isCorrect: true },
						},
					},
				},
			},
		});
		if (!submission) throw AppError.notFound("Submission not found");
		if (submission.studentId !== studentId) {
			throw AppError.forbidden("Not your attempt");
		}

		res.status(200).json({ success: true, data: submission });
	},
);
