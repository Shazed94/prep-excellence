import {
	updateLMSProgressSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as progressController from "./progress.controller";

const router = Router({ mergeParams: true });

router.get(
	"/:courseId/progress",
	authenticate,
	validateId(ZCuid),
	validateQuery(ZQueryParams),
	progressController.getCourseProgress,
);
router.get(
	"/lessons/:lessonId/progress",
	authenticate,
	validateId(ZCuid),
	validateQuery(ZQueryParams),
	progressController.getLessonProgress,
);
router.patch(
	"/lessons/:lessonId/progress",
	authenticate,
	validateId(ZCuid),
	validate(updateLMSProgressSchema),
	progressController.updateProgress,
);

export default router;
