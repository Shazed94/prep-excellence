import {
	addQuizQuestionSchema,
	createLMSExamSchema,
	submitLMSExamAttemptSchema,
	updateLMSExamSchema,
	ZUExamQuestionOptionSchema,
	ZUExamQuestionSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export const createExam = asyncHandler(async (req: Request, res: Response) => {
	const validated = createLMSExamSchema.parse(req.body);
	const { lessonId, title, description, duration, passingScore } = validated;

	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: {
			courseModule: {
				select: { course: { select: { id: true, courseType: true } } },
			},
		},
	});
	if (!lesson) throw AppError.notFound("Lesson not found");
	if (lesson.courseModule.course.courseType !== "LMS") {
		throw AppError.badRequest("Not an LMS lesson");
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
			timeLimit: duration,
			passingScore,
		},
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "LMSExam",
		entityId: exam.id,
		description: `Exam created: ${title}`,
		performedById: req.user?.id,
	});

	await invalidateCachePattern("lms:course:*");

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
						select: { id: true, user: { select: { name: true, email: true } } },
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
	const validated = updateLMSExamSchema.parse(req.body);

	const exam = await prisma.exam.findUnique({ where: { id } });
	if (!exam) throw AppError.notFound("Exam not found");

	const updated = await prisma.exam.update({ where: { id }, data: validated });
	await createAuditLogFromRequest(req, {
		action: AuditAction.UPDATE,
		module: "LMSExam",
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
		module: "LMSExam",
		entityId: id,
		description: `Exam deleted: ${exam.title}`,
		performedById: req.user?.id,
	});
	await invalidateCachePattern("lms:course:*");

	res.status(200).json({ success: true, message: "Exam deleted successfully" });
});

export const startAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const examId = req.params.id;
		const studentId = req.user!.id;

		const exam = await prisma.exam.findUnique({ where: { id: examId } });
		if (!exam) throw AppError.notFound("Exam not found");

		const attemptsCount = await prisma.examSubmission.count({
			where: { examId, studentId },
		});
		if (exam.maxAttempts && attemptsCount >= exam.maxAttempts) {
			throw AppError.badRequest("Maximum attempts reached");
		}

		const attempt = await prisma.examSubmission.create({
			data: {
				examId,
				studentId,
				submittedAt: new Date(),
			},
		});

		res.status(201).json({ success: true, data: attempt });
	},
);

export const submitAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { attemptId } = req.params;
		const validated = submitLMSExamAttemptSchema.parse(req.body);
		const { answers, timeSpent } = validated;

		const attempt = await prisma.examSubmission.findUnique({
			where: { id: attemptId },
			include: {
				exam: { include: { questions: { include: { options: true } } } },
			},
		});
		if (!attempt) throw AppError.notFound("Attempt not found");

		let totalPoints = 0;
		let earnedPoints = 0;
		let correctAnswers = 0;
		const totalQuestions = attempt.exam.questions.length;

		for (const ans of answers) {
			const question = attempt.exam.questions.find(
				(q) => q.id === ans.questionId,
			);
			if (!question) continue;

			totalPoints += question.points;

			if (ans.selectedOptionId) {
				const option = question?.options?.find(
					(o) => o.id === ans.selectedOptionId,
				);
				if (option?.isCorrect) {
					earnedPoints += question.points;
					correctAnswers++;
				}
			}
		}

		const isPassed = earnedPoints >= attempt.exam.passingScore;

		const updated = await prisma.examSubmission.update({
			where: { id: attemptId },
			data: {
				answers: {
					create: answers.map((a) => ({
						questionId: a.questionId,
						selectedOptionId: a.selectedOptionId,
						textAnswer: a.textAnswer,
					})),
				},
				score: earnedPoints,
				totalPoints,
				earnedPoints,
				totalQuestions,
				correctAnswers,
				isPassed,
				timeSpent,
				completedAt: new Date(),
				status: "SUBMITTED",
			},
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const getAttempts = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const attempts = await prisma.examSubmission.findMany({
		where: { examId: id },
		orderBy: { createdAt: "desc" },
		include: {
			student: {
				select: { id: true, user: { select: { name: true, email: true } } },
			},
		},
	});
	res.status(200).json({ success: true, data: attempts });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Exam Question CRUD (LMS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a question (with optional options) for an exam
 * POST /api/v1/lms/exams/:examId/questions
 */
export const createQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { examId } = req.params;
		const validated = addQuizQuestionSchema.parse(req.body);
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
			module: "LMSExam",
			entityId: created.id,
			description: `Exam question created: ${question.substring(0, 50)}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");

		res.status(201).json({ success: true, data: created });
	},
);

/**
 * Update a question
 * PATCH /api/v1/lms/exams/:examId/questions/:questionId
 */
export const updateQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { questionId } = req.params;
		const validated = ZUExamQuestionSchema.parse(req.body);

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
			module: "LMSExam",
			entityId: questionId,
			description: "Exam question updated",
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");

		res.status(200).json({ success: true, data: updated });
	},
);

/**
 * Delete a question
 * DELETE /api/v1/lms/exams/:examId/questions/:questionId
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
			module: "LMSExam",
			entityId: questionId,
			description: "Exam question deleted",
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");

		res
			.status(200)
			.json({ success: true, message: "Question deleted successfully" });
	},
);

// ─────────────────────────────────────────────────────────────────────────────
//  Exam Question Option CRUD (LMS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update a question option
 * PATCH /api/v1/lms/exams/:examId/questions/:questionId/options/:optionId
 */
export const updateOption = asyncHandler(
	async (req: Request, res: Response) => {
		const { optionId } = req.params;
		const validated = ZUExamQuestionOptionSchema.parse(req.body);

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
			module: "LMSExam",
			entityId: optionId,
			description: "Exam question option updated",
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");

		res.status(200).json({ success: true, data: updated });
	},
);

/**
 * Delete a question option
 * DELETE /api/v1/lms/exams/:examId/questions/:questionId/options/:optionId
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
			module: "LMSExam",
			entityId: optionId,
			description: "Exam question option deleted",
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");

		res
			.status(200)
			.json({ success: true, message: "Option deleted successfully" });
	},
);

// ─────────────────────────────────────────────────────────────────────────────
//  Student-facing Exam Endpoints (LMS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get exam with questions for a student (without revealing correct answers)
 * GET /api/v1/lms/exams/:id/student
 */
export const getStudentExam = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user?.student?.id ?? req.user!.id;

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
 * GET /api/v1/lms/exams/:id/my-attempts
 */
export const getMyAttempts = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user?.student?.id ?? req.user!.id;

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
 * GET /api/v1/lms/exams/attempts/:attemptId
 */
export const getAttemptDetail = asyncHandler(
	async (req: Request, res: Response) => {
		const { attemptId } = req.params;
		const studentId = req.user?.student?.id ?? req.user!.id;

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
