import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.get(
	"/teacher/analytics/summary",
	authenticate,
	analyticsController.teacherSummary,
);
router.get(
	"/teacher/students",
	authenticate,
	analyticsController.teacherStudents,
);
router.get(
	"/student/analytics/summary",
	authenticate,
	analyticsController.studentSummary,
);

export default router;
