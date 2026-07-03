import {
	ZCCoachingAssignmentSchema,
	ZGradeSubmissionSchema,
	ZUCoachingAssignmentSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { notificationService } from "@/apps/shared/services/notification.service";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

export const createAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = ZCCoachingAssignmentSchema.parse(req.body);
		const {
			lessonId,
			title,
			description,
			instructions,
			dueDate,
			totalPoints,
			allowLateSubmission,
			lateSubmissionPenalty,
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

		const existing = await prisma.assignment.findUnique({
			where: { lessonId },
		});
		if (existing) {
			throw AppError.badRequest("Assignment already exists for this lesson");
		}

		const assignment = await prisma.assignment.create({
			data: {
				lessonId,
				title,
				description,
				instructions,
				dueDate: dueDate ? new Date(dueDate) : null,
				totalPoints: totalPoints ?? 100,
				allowLateSubmission: allowLateSubmission ?? false,
				lateSubmissionPenalty: lateSubmissionPenalty ?? null,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "CoachingAssignment",
			entityId: assignment.id,
			description: `Assignment created: ${title}`,
			performedById: req.user?.id,
		});

		res.status(201).json({ success: true, data: assignment });
	},
);

export const getAssignmentByLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const { lessonId } = req.params;

		const assignment = await prisma.assignment.findUnique({
			where: { lessonId },
			include: {
				submissions: {
					orderBy: { createdAt: "desc" },
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
		if (!assignment) throw AppError.notFound("Assignment not found");

		res.status(200).json({ success: true, data: assignment });
	},
);

export const getAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

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
		if (!assignment) throw AppError.notFound("Assignment not found");

		res.status(200).json({ success: true, data: assignment });
	},
);

export const updateAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = ZUCoachingAssignmentSchema.parse(req.body);
		const {
			title,
			description,
			instructions,
			dueDate,
			totalPoints,
			allowLateSubmission,
			lateSubmissionPenalty,
		} = validated;

		const assignment = await prisma.assignment.findUnique({ where: { id } });
		if (!assignment) throw AppError.notFound("Assignment not found");

		const data: Record<string, unknown> = {};
		if (title !== undefined) data.title = title;
		if (description !== undefined) data.description = description;
		if (instructions !== undefined) data.instructions = instructions;
		if (dueDate !== undefined) data.dueDate = new Date(dueDate);
		if (totalPoints !== undefined) data.totalPoints = totalPoints;
		if (allowLateSubmission !== undefined)
			data.allowLateSubmission = allowLateSubmission;
		if (lateSubmissionPenalty !== undefined)
			data.lateSubmissionPenalty = lateSubmissionPenalty;

		const updated = await prisma.assignment.update({ where: { id }, data });

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "CoachingAssignment",
			entityId: id,
			description: `Assignment updated: ${updated.title}`,
			performedById: req.user?.id,
		});

		res.status(200).json({ success: true, data: updated });
	},
);

export const deleteAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const assignment = await prisma.assignment.findUnique({ where: { id } });
		if (!assignment) throw AppError.notFound("Assignment not found");

		await prisma.assignment.delete({ where: { id } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "CoachingAssignment",
			entityId: id,
			description: `Assignment deleted: ${assignment.title}`,
			performedById: req.user?.id,
		});

		res
			.status(200)
			.json({ success: true, message: "Assignment deleted successfully" });
	},
);

export const submitAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const textAnswer =
			typeof req.body?.textAnswer === "string" && req.body.textAnswer.trim()
				? req.body.textAnswer.trim()
				: undefined;
		const files = (req.files as Express.Multer.File[] | undefined) ?? [];
		const studentId = req.user!.student?.id;

		if (!studentId) throw AppError.notFound("Student profile not found");
		if (!textAnswer && files.length === 0) {
			throw AppError.badRequest(
				"Provide an answer or attach at least one file",
			);
		}

		const assignment = await prisma.assignment.findUnique({ where: { id } });
		if (!assignment) throw AppError.notFound("Assignment not found");

		const existing = await prisma.assignmentSubmission.findFirst({
			where: { assignmentId: id, studentId },
		});
		if (existing) throw AppError.badRequest("Already submitted");

		// Upload any attached files to MinIO first.
		const minioService = (await import("@/infrastructure/storage/minio"))
			.default;
		const uploaded: { title: string; fileUrl: string; fileType: string }[] = [];
		for (const file of files) {
			const key = `coaching-submissions/${generateFileName(
				file.originalname,
				"submission_",
			)}`;
			await minioService.uploadFile(key, file.buffer, file.mimetype, {
				originalName: file.originalname,
				uploadedAt: new Date().toISOString(),
			});
			uploaded.push({
				title: file.originalname,
				fileUrl: key,
				fileType: file.mimetype,
			});
		}

		const submission = await prisma.assignmentSubmission.create({
			data: {
				assignmentId: id,
				studentId,
				textAnswer,
				submittedAt: new Date(),
				status: "SUBMITTED",
				attachments: uploaded.length
					? {
							create: uploaded.map((u, i) => ({
								title: u.title,
								fileUrl: u.fileUrl,
								fileType: u.fileType,
								orderIndex: i,
							})),
						}
					: undefined,
			},
			include: { attachments: true },
		});

		res.status(201).json({ success: true, data: submission });
	},
);

export const gradeSubmission = asyncHandler(
	async (req: Request, res: Response) => {
		const { submissionId } = req.params;
		const { grade, feedback } = ZGradeSubmissionSchema.parse(req.body);
		const reviewedById = req.user?.teacher?.id;

		const submission = await prisma.assignmentSubmission.findUnique({
			where: { id: submissionId },
			include: { assignment: true },
		});
		if (!submission) throw AppError.notFound("Submission not found");

		const isPassed =
			grade >= Math.ceil(submission.assignment.totalPoints * 0.6);

		const updated = await prisma.assignmentSubmission.update({
			where: { id: submissionId },
			data: {
				score: grade,
				teacherFeedback: feedback,
				reviewedById: reviewedById ?? null,
				reviewedAt: new Date(),
				isPassed,
				status: "GRADED",
			},
		});

		// Notify the student that their assignment was graded. Never let a
		// notification failure break the grading response.
		try {
			await notificationService.send({
				type: "RESULT_PUBLISHED",
				title: "Assignment graded",
				message: `Your submission for "${submission.assignment.title}" has been graded: ${grade}/${submission.assignment.totalPoints}.`,
				studentId: submission.studentId,
				referenceId: submission.assignmentId,
				referenceType: "assignment",
			});
		} catch (err) {
			console.error("Failed to send grading notification", err);
		}

		res.status(200).json({ success: true, data: updated });
	},
);

export const getSubmissions = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const assignment = await prisma.assignment.findUnique({ where: { id } });
		if (!assignment) throw AppError.notFound("Assignment not found");

		const submissions = await prisma.assignmentSubmission.findMany({
			where: { assignmentId: id },
			orderBy: { createdAt: "desc" },
			include: {
				student: {
					select: {
						id: true,
						user: { select: { name: true, email: true } },
					},
				},
			},
		});

		res.status(200).json({ success: true, data: submissions });
	},
);
