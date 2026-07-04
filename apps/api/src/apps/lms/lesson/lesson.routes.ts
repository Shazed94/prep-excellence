import {
	createLMSLessonSchema,
	updateLMSLessonSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import z from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as lessonController from "./lesson.controller";

const router = Router({ mergeParams: true });
export const ZModuleId = z.object({
	moduleId: z.cuid("Invalid CUID format"),
});

router.post(
	"/:moduleId/lessons",
	authenticate,
	validateId(ZModuleId),
	validate(createLMSLessonSchema),
	lessonController.createLesson,
);
router.get(
	"/:moduleId/lessons",
	validateId(ZModuleId),
	validateQuery(ZQueryParams),
	lessonController.getLessons,
);
router.get("/lessons/:id", validateId(ZCuid), lessonController.getLesson);
router.patch(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSLessonSchema),
	lessonController.updateLesson,
);
router.delete(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	lessonController.deleteLesson,
);

export default router;
