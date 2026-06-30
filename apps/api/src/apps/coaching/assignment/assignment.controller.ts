import {
  ZCCoachingAssignmentSchema,
  ZGradeSubmissionSchema,
  ZSubmitAssignmentSchema,
  ZUCoachingAssignmentSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
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
      passingPoints,
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
        passingPoints: passingPoints ?? 60,
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
                user: {
                  select: { firstName: true, lastName: true, email: true },
                },
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
                user: {
                  select: { firstName: true, lastName: true, email: true },
                },
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
      passingPoints,
      isPublished,
    } = validated;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw AppError.notFound("Assignment not found");

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (instructions !== undefined) data.instructions = instructions;
    if (dueDate !== undefined) data.dueDate = new Date(dueDate);
    if (totalPoints !== undefined) data.totalPoints = totalPoints;
    if (passingPoints !== undefined) data.passingPoints = passingPoints;
    if (isPublished !== undefined) data.isPublished = isPublished;

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
    const { fileUrl, notes } = ZSubmitAssignmentSchema.parse(req.body);
    const studentId = req.user!.id;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw AppError.notFound("Assignment not found");

    const existing = await prisma.assignmentSubmission.findFirst({
      where: { assignmentId: id, studentId },
    });
    if (existing) throw AppError.badRequest("Already submitted");

    const submission = await prisma.assignmentSubmission.create({
      data: { assignmentId: id, studentId, fileUrl, notes },
    });

    res.status(201).json({ success: true, data: submission });
  },
);

export const gradeSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const { grade, feedback } = ZGradeSubmissionSchema.parse(req.body);
    const gradedById = req.user!.id;

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
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    res.status(200).json({ success: true, data: submissions });
  },
);
