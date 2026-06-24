import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

/**
 * Create a new course category
 */
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, isActive } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new AppError("Category name is required", 400);
    }

    // Check if category with same name already exists
    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      throw new AppError("A category with this name already exists", 409);
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    await createAuditLogFromRequest(req, {
      action: AuditAction.CREATE,
      module: "Category",
      entityId: category.id,
      description: `Course category created: ${category.name}`,
      performedById: userId,
    });

    await invalidateCachePattern("coaching-categories:*");

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  },
);

/**
 * Get all course categories
 */
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { isActive } = req.query;

    const where: Record<string, unknown> = {};
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  },
);

/**
 * Get a single category by ID
 */
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { courses: true },
      },
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.json({
    success: true,
    data: category,
  });
});

/**
 * Update a category
 */
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    // If name is being updated, check for uniqueness
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throw new AppError("Category name cannot be empty", 400);
      }

      const duplicate = await prisma.category.findFirst({
        where: {
          name: name.trim(),
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError("A category with this name already exists", 409);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    await createAuditLogFromRequest(req, {
      action: AuditAction.UPDATE,
      module: "Category",
      entityId: id,
      description: `Course category updated: ${category.name}`,
      performedById: userId,
    });

    await invalidateCachePattern("coaching-categories:*");

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  },
);

/**
 * Delete a category
 */
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { courses: true } },
      },
    });

    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    if (existing._count.courses > 0) {
      throw new AppError(
        "Cannot delete category with associated courses. Remove or reassign courses first.",
        400,
      );
    }

    await prisma.category.delete({ where: { id } });

    await createAuditLogFromRequest(req, {
      action: AuditAction.DELETE,
      module: "Category",
      entityId: id,
      description: `Course category deleted: ${existing.name}`,
      performedById: userId,
    });

    await invalidateCachePattern("coaching-categories:*");

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  },
);
