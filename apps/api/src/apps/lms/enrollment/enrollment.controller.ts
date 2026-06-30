import type { Request, Response } from "express";
import { updateLMSEnrollmentStatusSchema } from "@prepexcellence/shared-validators";
import { enrollmentService } from "@/apps/shared/services";
import { asyncHandler } from "@/utils/asyncHandler";

export const enrollStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await enrollmentService.enroll({
      courseId: req.params.courseId,
      studentId: req.body.studentId ?? req.user!.id,
      enrolledById: req.user!.id,
      courseType: "LMS",
    });
    res.status(201).json({ success: true, data: enrollment });
  },
);

export const getEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, status } = req.query as any;
    const result = await enrollmentService.list(
      { courseId: req.params.courseId, status, courseType: "LMS" },
      { page: page ? Number(page) : 1, limit: limit ? Number(limit) : 10 },
    );
    res.status(200).json({ success: true, ...result });
  },
);

export const updateEnrollmentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const validated = updateLMSEnrollmentStatusSchema.parse(req.body);
    const enrollment = await enrollmentService.updateStatus(
      id,
      validated.status,
      req.user!.id,
    );
    res.status(200).json({ success: true, data: enrollment });
  },
);

export const cancelEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    await enrollmentService.cancel(req.params.id, req.user!.id);
    res.status(200).json({ success: true, message: "Enrollment cancelled" });
  },
);

export const getMyEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = req.query as any;
    const result = await enrollmentService.list(
      { studentId: req.user!.id, courseType: "LMS" },
      { page: page ? Number(page) : 1, limit: limit ? Number(limit) : 10 },
    );
    res.status(200).json({ success: true, ...result });
  },
);

export const checkEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrolled = await enrollmentService.isEnrolled(
      req.params.courseId,
      req.user!.id,
    );
    res.status(200).json({ success: true, data: { enrolled } });
  },
);
