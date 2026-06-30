import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export interface CreateExamInput {
	lessonId: string;
	title: string;
	description?: string;
	timeLimit?: number;
	passingScore?: number;
	maxAttempts?: number;
	shuffleQuestions?: boolean;
	showResults?: boolean;
}

export interface UpdateExamInput {
	title?: string;
	description?: string;
	timeLimit?: number;
	passingScore?: number;
	maxAttempts?: number;
	shuffleQuestions?: boolean;
	showResults?: boolean;
}

class CoachingExamService {
	async #validateCourseType(lessonId: string) {
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
		return lesson;
	}

	async create(data: CreateExamInput, req: Request) {
		await this.#validateCourseType(data.lessonId);

		const existing = await prisma.exam.findUnique({
			where: { lessonId: data.lessonId },
		});
		if (existing)
			throw AppError.badRequest("Exam already exists for this lesson");

		const exam = await prisma.exam.create({
			data: {
				lessonId: data.lessonId,
				title: data.title,
				description: data.description,
				timeLimit: data.timeLimit ?? null,
				passingScore: data.passingScore ?? 70,
				maxAttempts: data.maxAttempts ?? null,
				shuffleQuestions: data.shuffleQuestions ?? false,
				showResults: data.showResults ?? true,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingExam",
			entityId: exam.id,
			description: `Exam created: ${data.title}`,
			performedById: req.user?.id,
		});
		return exam;
	}

	async getByLesson(lessonId: string) {
		const exam = await prisma.exam.findUnique({
			where: { lessonId },
			include: {
				questions: { orderBy: { orderIndex: "asc" } },
				_count: { select: { submissions: true } },
			},
		});
		if (!exam) throw AppError.notFound("Exam not found");
		return exam;
	}

	async getById(id: string) {
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
		return exam;
	}

	async update(id: string, data: UpdateExamInput, req: Request) {
		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Exam not found");

		const updated = await prisma.exam.update({
			where: { id },
			data: {
				title: data.title,
				description: data.description,
				timeLimit: data.timeLimit,
				passingScore: data.passingScore,
				maxAttempts: data.maxAttempts,
				shuffleQuestions: data.shuffleQuestions,
				showResults: data.showResults,
			},
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingExam",
			entityId: id,
			description: `Exam updated: ${updated.title}`,
			performedById: req.user?.id,
		});
		return updated;
	}

	async delete(id: string, req: Request) {
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
	}

	async startAttempt(examId: string, studentId: string) {
		const exam = await prisma.exam.findUnique({ where: { id: examId } });
		if (!exam) throw AppError.notFound("Exam not found");

		const submissionsCount = await prisma.examSubmission.count({
			where: { examId, studentId },
		});
		if (exam.maxAttempts && submissionsCount >= exam.maxAttempts) {
			throw AppError.badRequest("Maximum attempts reached");
		}

		return prisma.examSubmission.create({
			data: { examId, studentId, status: "DRAFT" },
		});
	}

	async submitAttempt(
		submissionId: string,
		answers: {
			questionId: string;
			selectedOptionId?: string;
			textAnswer?: string;
		}[],
	) {
		const submission = await prisma.examSubmission.findUnique({
			where: { id: submissionId },
			include: {
				exam: { include: { questions: { include: { options: true } } } },
			},
		});
		if (!submission) throw AppError.notFound("Submission not found");

		let earnedPoints = 0;
		let correctAnswers = 0;

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
					submissionId,
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
		const totalQuestions = submission.exam.questions.length;
		const score =
			totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
		const isPassed = score >= (submission.exam.passingScore ?? 70);

		return prisma.examSubmission.update({
			where: { id: submissionId },
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
	}

	async getAttempts(examId: string) {
		return prisma.examSubmission.findMany({
			where: { examId },
			orderBy: { createdAt: "desc" },
			include: {
				student: {
					select: { id: true, user: { select: { name: true, email: true } } },
				},
			},
		});
	}
}

export const coachingExamService = new CoachingExamService();
