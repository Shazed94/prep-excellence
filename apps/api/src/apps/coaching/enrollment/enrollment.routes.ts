import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as enrollmentController from "./enrollment.controller";

const router = Router({ mergeParams: true });

router.post(
	"/:courseId/enrollments",
	validateId(z.object({ courseId: z.cuid("Invalid CUID format") })),
	authenticate,
	enrollmentController.enrollStudent,
);
router.get(
	"/:courseId/enrollments",
	authenticate,
	enrollmentController.getEnrollments,
);
router.get(
	"/enrollments/mine",
	authenticate,
	enrollmentController.getMyEnrollments,
);
router.get(
	"/:courseId/enrollments/check",
	validateId(z.object({ courseId: z.cuid("Invalid CUID format") })),
	authenticate,
	enrollmentController.checkEnrollment,
);
router.patch(
	"/enrollments/:id/status",
	authenticate,
	enrollmentController.updateEnrollmentStatus,
);
router.post(
	"/:courseId/enrollments/cancel",
	validateId(z.object({ courseId: z.cuid("Invalid CUID format") })),
	authenticate,
	enrollmentController.cancelEnrollment,
);

export default router;
