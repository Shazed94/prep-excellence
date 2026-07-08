import {
  ZCCoachingCourseSchema,
  ZCuid,
  ZPublishCoachingCourseSchema,
  ZQueryParams,
  ZUCoachingCourseSchema,
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
  validate(ZCCoachingCourseSchema),
  courseController.createCourse,
);
router.get("/", validateQuery(ZQueryParams), courseController.getCourses);
router.get("/my-courses", authenticate, courseController.getMyCourses);
router.get("/:id", validateId(ZCuid), courseController.getCourse);
// Teacher-scoped list of the courses THIS teacher teaches (not enrollments).
router.get("/teaching", authenticate, courseController.getMyTeachingCourses);
router.get(
  "/teachers",
  authenticate,
  validateQuery(ZQueryParams),
  courseController.listTeachers,
);
// router.get(
//   "/published",
//   validateQuery(ZQueryParams),
//   courseController.getPublishedCourses,
// );
router.get("/popular", courseController.getPopularCourses);
router.get("/:id", validateId(ZCuid), courseController.getCourse);
router.patch(
  "/:id",
  validateId(ZCuid),
  authenticate,
  uploadCourseMedia,
  parseMultipartBody,
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
