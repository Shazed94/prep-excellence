import {
	ZCCoachingExamSchema,
	ZSubmitExamAttemptSchema,
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
