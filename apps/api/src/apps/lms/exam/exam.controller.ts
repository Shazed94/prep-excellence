import {
	createLMSExamSchema,
	submitLMSExamAttemptSchema,
	updateLMSExamSchema,
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
					student: { select: { id: true, name: true, email: true } },
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
				exam: { include: { questions: true } },
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
				const option = question.options?.find(
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
			student: { select: { id: true, name: true, email: true } },
		},
	});
	res.status(200).json({ success: true, data: attempts });
});
