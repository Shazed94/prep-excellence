import {
  ZCuid,
  ZQueryParams,
  enrollInLMSCourseSchema,
  updateLMSEnrollmentStatusSchema,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as enrollmentController from "./enrollment.controller";

const router = Router({ mergeParams: true });

router.post(
  "/:courseId/enrollments",
  authenticate,
  validateId(ZCuid),
  validate(enrollInLMSCourseSchema),
  enrollmentController.enrollStudent,
);
router.get(
  "/enrollments/mine",
  authenticate,
  validateQuery(ZQueryParams),
  enrollmentController.getMyEnrollments,
);
router.get(
  "/:courseId/enrollments",
  authenticate,
  validateId(ZCuid),
  validateQuery(ZQueryParams),
  enrollmentController.getEnrollments,
);
router.get(
  "/:courseId/enrollments/check",
  authenticate,
  validateId(ZCuid),
  enrollmentController.checkEnrollment,
);
router.patch(
  "/enrollments/:id/status",
  validateId(ZCuid),
  authenticate,
  validate(updateLMSEnrollmentStatusSchema),
  enrollmentController.updateEnrollmentStatus,
);
router.delete(
  "/enrollments/:id",
  validateId(ZCuid),
  authenticate,
  enrollmentController.cancelEnrollment,
);

export default router;
