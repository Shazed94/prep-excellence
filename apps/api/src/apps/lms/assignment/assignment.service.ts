import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export interface CreateAssignmentInput {
	lessonId: string;
	title: string;
	description?: string;
	instructions?: string;
	dueDate?: string;
	totalPoints?: number;
	passingPoints?: number;
}

export interface UpdateAssignmentInput {
	title?: string;
	description?: string;
	instructions?: string;
	dueDate?: string;
	totalPoints?: number;
	passingPoints?: number;
	isPublished?: boolean;
}

class LMSAssignmentService {
	async create(data: CreateAssignmentInput, req: Request) {
		const lesson = await prisma.lesson.findUnique({
			where: { id: data.lessonId },
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

		const existing = await prisma.assignment.findUnique({
			where: { lessonId: data.lessonId },
		});
		if (existing) {
			throw AppError.badRequest("Assignment already exists for this lesson");
		}

		const assignment = await prisma.assignment.create({
			data: {
				lessonId: data.lessonId,
				title: data.title,
				description: data.description,
				instructions: data.instructions,
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
				totalPoints: data.totalPoints ?? 100,
				passingPoints: data.passingPoints ?? 60,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSAssignment",
			entityId: assignment.id,
			description: `Assignment created: ${data.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("lms:course:*");
		return assignment;
	}

	async getByLesson(lessonId: string) {
		const assignment = await prisma.assignment.findUnique({
			where: { lessonId },
			include: {
				submissions: {
					orderBy: { createdAt: "desc" },
					include: {
						student: { select: { id: true, name: true, email: true } },
					},
				},
			},
		});
		if (!assignment) throw AppError.notFound("Assignment not found");
		return assignment;
	}

	async getById(id: string) {
		const assignment = await prisma.assignment.findUnique({
			where: { id },
			include: {
				lesson: {
					select: {
						id: true,
						title: true,
						courseModule: { select: { id: true, title: true, courseId: true } },
					},
				},
				submissions: {
					orderBy: { createdAt: "desc" },
					include: {
						student: { select: { id: true, name: true, email: true } },
						attachments: true,
					},
				},
			},
		});
		if (!assignment) throw AppError.notFound("Assignment not found");
		return assignment;
	}

	async update(id: string, data: UpdateAssignmentInput, req: Request) {
		const assignment = await prisma.assignment.findUnique({ where: { id } });
		if (!assignment) throw AppError.notFound("Assignment not found");

		const updated = await prisma.assignment.update({
			where: { id },
			data: {
				...data,
				dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSAssignment",
			entityId: id,
			description: `Assignment updated: ${updated.title}`,
			performedById: req.user?.id,
		});
		return updated;
	}

	async delete(id: string, req: Request) {
		const assignment = await prisma.assignment.findUnique({ where: { id } });
		if (!assignment) throw AppError.notFound("Assignment not found");

		await prisma.assignment.delete({ where: { id } });
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSAssignment",
			entityId: id,
			description: `Assignment deleted: ${assignment.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern("lms:course:*");
	}

	// --- Submission management ---

	async submit(
		assignmentId: string,
		studentId: string,
		fileUrl: string,
		notes?: string,
	) {
		const assignment = await prisma.assignment.findUnique({
			where: { id: assignmentId },
		});
		if (!assignment) throw AppError.notFound("Assignment not found");

		const existing = await prisma.assignmentSubmission.findFirst({
			where: { assignmentId, studentId },
		});
		if (existing) {
			throw AppError.badRequest("Already submitted");
		}

		return prisma.assignmentSubmission.create({
			data: { assignmentId, studentId, fileUrl, notes },
		});
	}

	async grade(
		submissionId: string,
		grade: number,
		feedback?: string,
		gradedById?: string,
	) {
		const submission = await prisma.assignmentSubmission.findUnique({
			where: { id: submissionId },
			include: { assignment: true },
		});
		if (!submission) throw AppError.notFound("Submission not found");

		const updated = await prisma.assignmentSubmission.update({
			where: { id: submissionId },
			data: {
				grade,
				feedback,
				gradedById,
				gradedAt: new Date(),
				status:
					grade >= (submission.assignment.passingPoints ?? 60)
						? "PASSED"
						: "FAILED",
			},
		});

		return updated;
	}

	async getSubmissions(assignmentId: string) {
		return prisma.assignmentSubmission.findMany({
			where: { assignmentId },
			orderBy: { createdAt: "desc" },
			include: {
				student: { select: { id: true, name: true, email: true } },
				attachments: true,
			},
		});
	}
}

export const lmsAssignmentService = new LMSAssignmentService();
