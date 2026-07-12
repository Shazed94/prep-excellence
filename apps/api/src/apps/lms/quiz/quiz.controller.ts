import { createLMSQuizSchema } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { z } from "zod";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

const ZReorderQuestions = z.object({
	questions: z.array(z.object({ id: z.string().cuid(), orderIndex: z.number().int().min(0) })),
});

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
	const validated = createLMSQuizSchema.parse(req.body);
	const { moduleId } = req.body as { moduleId?: string };

	console.log("modulrrrrrrrrrrrrrr", moduleId)

	let lessonId: string | undefined = req.body.lessonId;

	if (!lessonId && !moduleId) {
		throw AppError.badRequest("Either lessonId or moduleId is required");
	}

	if (!lessonId && moduleId) {
		const module = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			include: { lessons: { where: { isActive: true }, orderBy: { orderIndex: "asc" }, take: 1 } },
		});
		if (!module) throw AppError.notFound("Module not found");
		if (module.lessons.length === 0) {
			throw AppError.badRequest("Module has no lessons. Create a lesson first.");
		}
		lessonId = module.lessons[0].id;
	}

	if (!lessonId) throw AppError.badRequest("Could not resolve lessonId");

	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: { courseModule: { select: { course: { select: { id: true, courseType: true } } } } },
	});

	if (!lesson) throw AppError.notFound("Lesson not found");
	// if (lesson.courseModule.course.courseType !== "LMS") {
	// 	throw AppError.badRequest("Not an LMS lesson");
	// }



	const existing = await prisma.exam.findUnique({ where: { lessonId } });
	if (existing) {
		throw AppError.badRequest("Exam already exists for this lesson");
	}

	const exam = await prisma.exam.create({
		data: {
			lessonId,
			title: validated.title,
			description: validated.description,
			timeLimit: validated.timeLimit,
			passingScore: validated.passingScore,
			maxAttempts: validated.maxAttempts,
			shuffleQuestions: validated.shuffleQuestions,
			showResults: validated.showResults,
		},
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "LMSExam",
		entityId: exam.id,
		description: `Quiz created: ${validated.title}`,
		performedById: req.user?.id,
	});

	await invalidateCachePattern("lms:course:*");

	res.status(201).json({ success: true, data: exam });
});

export const createQuizForModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { moduleId } = req.params;
		const validated = createLMSQuizSchema.parse(req.body);

		const module = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			include: { course: { select: { id: true, courseType: true } } },
		});
		if (!module) throw AppError.notFound("Module not found");
		// if (module.course.courseType !== "LMS") {
		// 	throw AppError.badRequest("Not an LMS module");
		// }

		let lesson = await prisma.lesson.findFirst({
			where: { courseModuleId: moduleId, isActive: true, lessonType: "EXAM" },
		});

		if (!lesson) {
			const maxOrder = await prisma.lesson.aggregate({
				where: { courseModuleId: moduleId },
				_max: { orderIndex: true },
			});
			lesson = await prisma.lesson.create({
				data: {
					title: validated.title || "Quiz",
					description: validated.description,
					orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
					lessonType: "EXAM",
					courseModuleId: moduleId,
					isPublished: true,
					publishedAt: new Date(),
				},
			});
		}

		const existing = await prisma.exam.findUnique({
			where: { lessonId: lesson.id },
		});
		if (existing) {
			throw AppError.badRequest("Quiz already exists for this module");
		}

		const exam = await prisma.exam.create({
			data: {
				lessonId: lesson.id,
				title: validated.title,
				description: validated.description,
				timeLimit: validated.timeLimit,
				passingScore: validated.passingScore,
				maxAttempts: validated.maxAttempts,
				shuffleQuestions: validated.shuffleQuestions,
				showResults: validated.showResults,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSExam",
			entityId: exam.id,
			description: `Quiz created in module: ${validated.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");

		res.status(201).json({ success: true, data: exam });
	},
);

export const getQuizByModule = asyncHandler(
	async (req: Request, res: Response) => {
		const { moduleId } = req.params;

		const module = await prisma.courseModule.findUnique({
			where: { id: moduleId },
			select: { id: true },
		});
		if (!module) throw AppError.notFound("Module not found");

		const exam = await prisma.exam.findFirst({
			where: { lesson: { courseModuleId: moduleId } },
			include: {
				questions: { orderBy: { orderIndex: "asc" } },
				_count: { select: { submissions: true } },
			},
		});
		if (!exam) throw AppError.notFound("Quiz not found for this module");

		res.status(200).json({ success: true, data: exam });
	},
);

export const getQuizQuestions = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Quiz not found");

		const questions = await prisma.examQuestion.findMany({
			where: { examId: id },
			orderBy: { orderIndex: "asc" },
			include: {
				options: { orderBy: { orderIndex: "asc" } },
			},
		});

		res.status(200).json({ success: true, data: questions });
	},
);

export const reorderQuizQuestions = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = ZReorderQuestions.parse(req.body);

		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Quiz not found");

		await prisma.$transaction(
			validated.questions.map((q) =>
				prisma.examQuestion.update({
					where: { id: q.id },
					data: { orderIndex: q.orderIndex },
				}),
			),
		);

		await invalidateCachePattern("lms:course:*");

		res.status(200).json({ success: true, message: "Questions reordered" });
	},
);

export const duplicateQuizQuestion = asyncHandler(
	async (req: Request, res: Response) => {
		const { id, questionId } = req.params;

		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Quiz not found");

		const source = await prisma.examQuestion.findUnique({
			where: { id: questionId },
			include: { options: { orderBy: { orderIndex: "asc" } } },
		});
		if (!source) throw AppError.notFound("Question not found");

		const maxOrder = await prisma.examQuestion.aggregate({
			where: { examId: id },
			_max: { orderIndex: true },
		});

		const duplicated = await prisma.examQuestion.create({
			data: {
				examId: id,
				question: source.question,
				type: source.type,
				orderIndex: (maxOrder._max.orderIndex ?? 0) + 1,
				points: source.points,
				explanation: source.explanation,
				options: source.options.length
					? {
							create: source.options.map((opt) => ({
								text: opt.text,
								isCorrect: opt.isCorrect,
								orderIndex: opt.orderIndex,
							})),
						}
					: undefined,
			},
			include: { options: { orderBy: { orderIndex: "asc" } } },
		});

		await invalidateCachePattern("lms:course:*");

		res.status(201).json({ success: true, data: duplicated });
	},
);

export const submitQuizAttempt = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const studentId = req.user!.id;

		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Quiz not found");

		const attemptsCount = await prisma.examSubmission.count({
			where: { examId: id, studentId },
		});
		if (exam.maxAttempts && attemptsCount >= exam.maxAttempts) {
			throw AppError.badRequest("Maximum attempts reached");
		}

		const attempt = await prisma.examSubmission.create({
			data: {
				examId: id,
				studentId,
				submittedAt: new Date(),
			},
		});

		res.status(201).json({ success: true, data: attempt });
	},
);
