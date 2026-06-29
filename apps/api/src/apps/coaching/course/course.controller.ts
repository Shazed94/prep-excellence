import {
  ZCCoachingCourseSchema,
  ZPublishCoachingCourseSchema,
  ZUCoachingCourseSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import { coachingCourseService } from "./course.service";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import prisma from "@/infrastructure/database/connection";
import { AuditAction } from "@/generated/enums";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = ZCCoachingCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(
        parsed.error.issues[0]?.message || "Validation failed",
      );
    }


    const user = req.user as UserWithRoleAndPermissions;

	const course = await prisma.course.create({
		data: {
			...parsed.data,
			courseType: "COACHING",
			tags: parsed.data.tags ?? [],
		},
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "CoachingCourse",
		entityId: course.id,
		description: `Coaching course created: ${parsed.data.title}`,
		performedById: user.id,
	});

    res.status(201).json({ success: true, data: course });
  },
);





export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortBy, orderBy, search, filters } = req.query as any;
  const result = await coachingCourseService.list({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sortBy: sortBy as string,
    orderBy: orderBy as "asc" | "desc",
    search: search as string,
    filters: filters ? JSON.parse(filters as string) : undefined,
    isPublished: true,
  });
  res.status(200).json({ success: true, ...result });
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await coachingCourseService.getById(req.params.id);
  res.status(200).json({ success: true, data: course });
});

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = ZUCoachingCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(
        parsed.error.issues[0]?.message || "Validation failed",
      );
    }

    const course = await coachingCourseService.update(
      req.params.id,
      parsed.data,
      req,
    );
    res.status(200).json({ success: true, data: course });
  },
);

export const publishCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = ZPublishCoachingCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(
        parsed.error.issues[0]?.message || "Validation failed",
      );
    }

    const course = await coachingCourseService.publish(
      req.params.id,
      parsed.data.isPublished,
      req,
    );
    res.status(200).json({ success: true, data: course });
  },
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    await coachingCourseService.delete(req.params.id, req);
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  },
);
