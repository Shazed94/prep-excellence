import { ZCuid } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as lessonController from "./lesson.controller";

const router = Router({ mergeParams: true });

const moduleIdSchema = z.object({ moduleId: ZCuid });

router.post(
	"/:moduleId/lessons",
	validateId(moduleIdSchema),
	authenticate,
	lessonController.createLesson,
);
router.get(
	"/:moduleId/lessons",
	validateId(moduleIdSchema),
	lessonController.getLessons,
);
router.get("/lessons/:id", validateId(ZCuid), lessonController.getLesson);
router.patch(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	lessonController.updateLesson,
);
router.delete(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	lessonController.deleteLesson,
);

export default router;
