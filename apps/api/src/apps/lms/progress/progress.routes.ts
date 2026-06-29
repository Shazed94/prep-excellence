import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as progressController from "./progress.controller";

const router = Router({ mergeParams: true });

router.get(
	"/:courseId/progress",
	authenticate,
	progressController.getCourseProgress,
);
router.get(
	"/lessons/:lessonId/progress",
	authenticate,
	progressController.getLessonProgress,
);
router.patch(
	"/lessons/:lessonId/progress",
	authenticate,
	progressController.updateProgress,
);

export default router;
