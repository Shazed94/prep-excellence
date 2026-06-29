import { ZCuid } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as progressController from "./progress.controller";

const router = Router({ mergeParams: true });

router.get(
	"/:courseId/progress",
	validateId(z.object({ courseId: ZCuid })),
	authenticate,
	progressController.getCourseProgress,
);
router.get(
	"/progress/lessons/:lessonId",
	validateId(ZCuid),
	authenticate,
	progressController.getLessonProgress,
);
router.patch(
	"/progress/lessons/:lessonId",
	validateId(ZCuid),
	authenticate,
	progressController.updateProgress,
);

export default router;
