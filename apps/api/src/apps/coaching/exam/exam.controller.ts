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
		duration,
		totalPoints,
		passingPoints,
		maxAttempts,
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
			duration,
			totalPoints: totalPoints ?? 100,
			passingPoints: passingPoints ?? 40,
			maxAttempts: maxAttempts ?? 1,
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
				_count: { select: { attempts: true } },
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
			attempts: {
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
		duration,
		totalPoints,
		passingPoints,
		maxAttempts,
		isPublished,
	} = validated;

	const exam = await prisma.exam.findUnique({ where: { id } });
	if (!exam) throw AppError.notFound("Exam not found");

	const data: Record<string, unknown> = {};
	if (title !== undefined) data.title = title;
	if (description !== undefined) data.description = description;
	if (duration !== undefined) data.duration = duration;
	if (totalPoints !== undefined) data.totalPoints = totalPoints;
	if (passingPoints !== undefined) data.passingPoints = passingPoints;
	if (maxAttempts !== undefined) data.maxAttempts = maxAttempts;
	if (isPublished !== undefined) data.isPublished = isPublished;

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

export const startAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user!.id;

		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Exam not found");

		const attemptsCount = await prisma.examAttempt.count({
			where: { examId: id, studentId },
		});
		if (exam.maxAttempts && attemptsCount >= exam.maxAttempts) {
			throw AppError.badRequest("Maximum attempts reached");
		}

		const attempt = await prisma.examAttempt.create({
			data: { examId: id, studentId, startedAt: new Date() },
		});

		res.status(201).json({ success: true, data: attempt });
	},
);

export const submitAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { attemptId } = req.params;
		const { answers } = ZSubmitExamAttemptSchema.parse(req.body);

		const attempt = await prisma.examAttempt.findUnique({
			where: { id: attemptId },
			include: { exam: { include: { questions: true } } },
		});
		if (!attempt) throw AppError.notFound("Attempt not found");

		let score = 0;
		for (const ans of answers) {
			const question = attempt.exam.questions.find(
				(q) => q.id === ans.questionId,
			);
			if (question && question.correctAnswer === ans.answer) {
				score += question.points ?? 1;
			}
		}

		const passed = score >= (attempt.exam.passingPoints ?? 40);

		const updated = await prisma.examAttempt.update({
			where: { id: attemptId },
			data: { answers, score, passed, completedAt: new Date() },
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const getAttempts = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const attempts = await prisma.examAttempt.findMany({
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
