import {
  publishLMSCourseSchema,
  updateLMSCourseSchema,
  ZCuid,
  ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { uploadCourseMedia } from "@/middleware/upload";
import {
  parseMultipartBody,
  validate,
  validateId,
  validateQuery,
} from "@/middleware/validate";
import * as courseController from "./course.controller";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  uploadCourseMedia,
  parseMultipartBody,
  courseController.createCourse,
);
router.get(
  "/",
  authenticate,
  validateQuery(ZQueryParams),
  courseController.getCourses,
);
// Auth-scoped list of the current teacher's own courses (must precede "/:id").
router.get("/mine", authenticate, courseController.getMyCourses);
router.get(
  "/published",
  validateQuery(ZQueryParams),
  courseController.getPublishedCourses,
);
router.get(
  "/published/:id",
  validateId(ZCuid),
  courseController.getPublishedCourse,
);
router.get(
  "/popular",
  validateQuery(ZQueryParams),
  courseController.getPopularCourses,
);
router.get("/:id", validateId(ZCuid), courseController.getCourse);
router.patch(
  "/:id",
  validateId(ZCuid),
  authenticate,
  uploadCourseMedia,
  parseMultipartBody,
  validate(updateLMSCourseSchema),
  courseController.updateCourse,
);
router.patch(
  "/:id/publish",
  authenticate,
  validate(publishLMSCourseSchema),
  courseController.publishCourse,
);
router.delete("/:id", authenticate, courseController.deleteCourse);

export default router;
