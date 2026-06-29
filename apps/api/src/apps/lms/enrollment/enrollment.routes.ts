import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as enrollmentController from "./enrollment.controller";

const router = Router({ mergeParams: true });

router.post(
	"/:courseId/enrollments",
	authenticate,
	enrollmentController.enrollStudent,
);
router.get(
	"/enrollments/mine",
	authenticate,
	enrollmentController.getMyEnrollments,
);
router.get(
	"/:courseId/enrollments",
	authenticate,
	enrollmentController.getEnrollments,
);
router.get(
	"/:courseId/enrollments/check",
	authenticate,
	enrollmentController.checkEnrollment,
);
router.patch(
	"/enrollments/:id/status",
	authenticate,
	enrollmentController.updateEnrollmentStatus,
);
router.delete(
	"/enrollments/:id",
	authenticate,
	enrollmentController.cancelEnrollment,
);

export default router;
