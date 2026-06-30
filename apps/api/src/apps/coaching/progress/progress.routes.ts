import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as progressController from "./progress.controller";

const router = Router({ mergeParams: true });

router.get(
	"/:courseId/progress",
	validateId(z.object({ courseId: z.cuid("Invalid CUID format"), })),
	authenticate,
	progressController.getCourseProgress,
);
router.get(
	"/progress/lessons/:lessonId",
	validateId(z.object({ lessonId: z.cuid("Invalid CUID format"), })),
	authenticate,
	progressController.getLessonProgress,
);
router.patch(
	"/progress/lessons/:lessonId",
	validateId(z.object({ lessonId: z.cuid("Invalid CUID format"), })),
	authenticate,
	progressController.updateProgress,
);

export default router;
