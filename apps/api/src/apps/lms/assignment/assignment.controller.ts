import type { Request, Response } from "express";
import {
  createLMSAssignmentSchema,
  gradeLMSAssignmentSchema,
  submitLMSAssignmentSchema,
  updateLMSAssignmentSchema,
} from "@prepexcellence/shared-validators";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export const createAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const validated = createLMSAssignmentSchema.parse(req.body);
    const {
      lessonId,
      title,
      description,
      instructions,
      dueDate,
      maxScore,
      passingScore,
    } = validated;

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
        totalPoints: maxScore,
      },
    });

    await createAuditLogFromRequest(req, {
      action: AuditAction.CREATE,
      module: "LMSAssignment",
      entityId: assignment.id,
      description: `Assignment created: ${title}`,
      performedById: req.user?.id,
    });

    await invalidateCachePattern("lms:course:*");

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
            student: { select: { id: true, name: true, email: true } },
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
            student: { select: { id: true, name: true, email: true } },
            attachments: true,
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
    const validated = updateLMSAssignmentSchema.parse(req.body);

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw AppError.notFound("Assignment not found");

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...validated,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
      },
    });

    await createAuditLogFromRequest(req, {
      action: AuditAction.UPDATE,
      module: "LMSAssignment",
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
      module: "LMSAssignment",
      entityId: id,
      description: `Assignment deleted: ${assignment.title}`,
      performedById: req.user?.id,
    });
    await invalidateCachePattern("lms:course:*");

    res
      .status(200)
      .json({ success: true, message: "Assignment deleted successfully" });
  },
);

export const submitAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const validated = submitLMSAssignmentSchema.parse(req.body);
    const { submissionText, attachmentUrls } = validated;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });
    if (!assignment) throw AppError.notFound("Assignment not found");

    const existing = await prisma.assignmentSubmission.findFirst({
      where: { assignmentId: id, studentId: req.user!.id },
    });
    if (existing) {
      throw AppError.badRequest("Already submitted");
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId: id,
        studentId: req.user!.id,
        textAnswer: submissionText,
        submittedAt: new Date(),
        status: "SUBMITTED",
      },
    });

    res.status(201).json({ success: true, data: submission });
  },
);

export const gradeSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const validated = gradeLMSAssignmentSchema.parse(req.body);
    const { score: grade, feedback } = validated;

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });
    if (!submission) throw AppError.notFound("Submission not found");

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: grade,
        teacherFeedback: feedback,
        reviewedById: req.user!.id,
        reviewedAt: new Date(),
        status: "GRADED",
        isPassed: grade >= (submission.assignment.totalPoints * 60) / 100,
      },
    });

    res.status(200).json({ success: true, data: updated });
  },
);

export const getSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId: id },
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        attachments: true,
      },
    });
    res.status(200).json({ success: true, data: submissions });
  },
);
