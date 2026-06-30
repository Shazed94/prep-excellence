import type { Request, Response } from "express";
import {
  createLMSModuleSchema,
  updateLMSModuleSchema,
} from "@prepexcellence/shared-validators";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export const createModule = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const validated = createLMSModuleSchema
      .omit({ courseId: true })
      .parse(req.body);
    const { title, description, orderIndex } = validated;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, courseType: true, title: true },
    });
    if (!course) throw AppError.notFound("Course not found");
    if (course.courseType !== "LMS") {
      throw AppError.badRequest("Not an LMS course");
    }

    const existing = await prisma.courseModule.findUnique({
      where: {
        courseId_orderIndex: { courseId, orderIndex },
      },
    });
    if (existing) {
      throw AppError.badRequest(
        `Module with orderIndex ${orderIndex} already exists`,
      );
    }

    const mod = await prisma.courseModule.create({
      data: { title, description, orderIndex, courseId, unlockAtPercent: 0 },
      include: { lessons: true },
    });

    await createAuditLogFromRequest(req, {
      action: AuditAction.CREATE,
      module: "LMSModule",
      entityId: mod.id,
      description: `Module created: ${title} in course ${course.title}`,
      performedById: req.user?.id,
    });

    await invalidateCachePattern(`lms:course:${courseId}`);

    res.status(201).json({ success: true, data: mod });
  },
);

export const getModules = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const modules = await prisma.courseModule.findMany({
    where: { courseId, isActive: true },
    orderBy: { orderIndex: "asc" },
    include: {
      lessons: {
        where: { isActive: true, isPublished: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          title: true,
          orderIndex: true,
          lessonType: true,
          isPublished: true,
          videoContent: {
            select: { id: true, duration: true, status: true },
          },
        },
      },
      _count: { select: { lessons: true } },
    },
  });
  res.status(200).json({ success: true, data: modules });
});

export const updateModule = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const validated = updateLMSModuleSchema.parse(req.body);

    const mod = await prisma.courseModule.findUnique({ where: { id } });
    if (!mod) throw AppError.notFound("Module not found");

    if (
      validated.orderIndex !== undefined &&
      validated.orderIndex !== mod.orderIndex
    ) {
      const existing = await prisma.courseModule.findUnique({
        where: {
          courseId_orderIndex: {
            courseId: mod.courseId,
            orderIndex: validated.orderIndex,
          },
        },
      });
      if (existing && existing.id !== id) {
        throw AppError.badRequest(
          `Module with orderIndex ${validated.orderIndex} already exists`,
        );
      }
    }

    const updated = await prisma.courseModule.update({
      where: { id },
      data: validated,
    });
    await createAuditLogFromRequest(req, {
      action: AuditAction.UPDATE,
      module: "LMSModule",
      entityId: id,
      description: `Module updated: ${updated.title}`,
      performedById: req.user?.id,
    });
    await invalidateCachePattern(`lms:course:${mod.courseId}`);

    res.status(200).json({ success: true, data: updated });
  },
);

export const deleteModule = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const mod = await prisma.courseModule.findUnique({ where: { id } });
    if (!mod) throw AppError.notFound("Module not found");

    await prisma.courseModule.update({
      where: { id },
      data: { isActive: false },
    });
    await createAuditLogFromRequest(req, {
      action: AuditAction.DELETE,
      module: "LMSModule",
      entityId: id,
      description: `Module deleted: ${mod.title}`,
      performedById: req.user?.id,
    });
    await invalidateCachePattern(`lms:course:${mod.courseId}`);

    res
      .status(200)
      .json({ success: true, message: "Module deleted successfully" });
  },
);
