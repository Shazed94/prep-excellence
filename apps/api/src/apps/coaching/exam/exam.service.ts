import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export interface CreateExamInput {
	lessonId: string;
	title: string;
	description?: string;
	duration?: number;
	totalPoints?: number;
	passingPoints?: number;
	maxAttempts?: number;
}

export interface UpdateExamInput {
	title?: string;
	description?: string;
	duration?: number;
	totalPoints?: number;
	passingPoints?: number;
	maxAttempts?: number;
	isPublished?: boolean;
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
				duration: data.duration,
				totalPoints: data.totalPoints ?? 100,
				passingPoints: data.passingPoints ?? 40,
				maxAttempts: data.maxAttempts ?? 1,
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
				_count: { select: { attempts: true } },
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
		return exam;
	}

	async update(id: string, data: UpdateExamInput, req: Request) {
		const exam = await prisma.exam.findUnique({ where: { id } });
		if (!exam) throw AppError.notFound("Exam not found");

		const updated = await prisma.exam.update({ where: { id }, data });
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

		const attemptsCount = await prisma.examAttempt.count({
			where: { examId, studentId },
		});
		if (exam.maxAttempts && attemptsCount >= exam.maxAttempts) {
			throw AppError.badRequest("Maximum attempts reached");
		}

		return prisma.examAttempt.create({
			data: { examId, studentId, startedAt: new Date() },
		});
	}

	async submitAttempt(
		attemptId: string,
		answers: { questionId: string; answer: string }[],
	) {
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

		return prisma.examAttempt.update({
			where: { id: attemptId },
			data: { answers, score, passed, completedAt: new Date() },
		});
	}

	async getAttempts(examId: string) {
		return prisma.examAttempt.findMany({
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
