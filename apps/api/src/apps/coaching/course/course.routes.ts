import {
  ZCCoachingCourseSchema,
  ZCuid,
  ZPublishCoachingCourseSchema,
  ZUCoachingCourseSchema,
  ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { uploadCourseThumbnail } from "@/middleware/upload";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as courseController from "./course.controller";

const router = Router({ mergeParams: true });

/**
 * Coerce multipart/form-data string fields to proper JS types
 * so the Zod validation middleware can validate them correctly.
 */
const coerceCourseFormData = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const body = { ...req.body };
  ["price", "discount", "duration", "capacity"].forEach((field) => {
    if (body[field]) body[field] = Number(body[field]);
  });
  ["tags", "requirements", "whatYouLearn", "schedules"].forEach((field) => {
    if (typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field]);
      } catch {
        body[field] = [];
      }
    }
  });
  if (body.startDate) body.startDate = new Date(body.startDate);
  if (body.endDate) body.endDate = new Date(body.endDate);
  req.body = body;
  next();
};

router.post(
  "/",
  authenticate,
  uploadCourseThumbnail,
  coerceCourseFormData,
  validate(ZCCoachingCourseSchema),
  courseController.createCourse,
);
router.get("/", validateQuery(ZQueryParams), courseController.getCourses);
router.get("/:id", validateId(ZCuid), courseController.getCourse);
router.patch(
  "/:id",
  validateId(ZCuid),
  authenticate,
  validate(ZUCoachingCourseSchema),
  courseController.updateCourse,
);
router.patch(
  "/:id/publish",
  authenticate,
  validate(ZPublishCoachingCourseSchema),
  courseController.publishCourse,
);
router.delete("/:id", authenticate, courseController.deleteCourse);

export default router;
