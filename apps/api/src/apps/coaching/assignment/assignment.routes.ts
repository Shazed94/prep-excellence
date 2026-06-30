import {
	ZCCoachingAssignmentSchema,
	ZCuid,
	ZGradeSubmissionSchema,
	ZQueryParams,
	ZSubmitAssignmentSchema,
	ZUCoachingAssignmentSchema,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as assignmentController from "./assignment.controller";

const router = Router({ mergeParams: true });

// Assignment CRUD
router.post(
	"/",
	authenticate,
	validate(ZCCoachingAssignmentSchema),
	assignmentController.createAssignment,
);
router.get(
	"/lessons/:lessonId/assignment",
	validateId(z.object({ lessonId: z.cuid("Invalid CUID format"), })),
	assignmentController.getAssignmentByLesson,
);
router.get("/:id", validateId(ZCuid), assignmentController.getAssignment);
router.patch(
	"/:id",
	validateId(ZCuid),
	authenticate,
	validate(ZUCoachingAssignmentSchema),
	assignmentController.updateAssignment,
);
router.delete(
	"/:id",
	validateId(ZCuid),
	authenticate,
	assignmentController.deleteAssignment,
);

// Submissions
router.post(
	"/:id/submit",
	validateId(ZCuid),
	authenticate,
	validate(ZSubmitAssignmentSchema),
	assignmentController.submitAssignment,
);
router.get(
	"/:id/submissions",
	validateId(ZCuid),
	authenticate,
	validateQuery(ZQueryParams),
	assignmentController.getSubmissions,
);
router.patch(
	"/submissions/:submissionId/grade",
	validateId(z.object({ submissionId: z.cuid("Invalid CUID format"), })),
	authenticate,
	validate(ZGradeSubmissionSchema),
	assignmentController.gradeSubmission,
);

export default router;
