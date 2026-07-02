import {
	publishLMSCourseSchema,
	updateLMSCourseSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { uploadCourseThumbnail } from "@/middleware/upload";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as courseController from "./course.controller";

const router = Router({ mergeParams: true });

router.post(
	"/",
	authenticate,
	uploadCourseThumbnail,
	courseController.createCourse,
);
router.get("/", validateQuery(ZQueryParams), courseController.getCourses);
router.get("/:id", validateId(ZCuid), courseController.getCourse);
router.patch(
	"/:id",
	validateId(ZCuid),
	authenticate,
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
