import {
	createLMSAssignmentSchema,
	gradeLMSAssignmentSchema,
	submitLMSAssignmentSchema,
	updateLMSAssignmentSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as assignmentController from "./assignment.controller";

const router = Router({ mergeParams: true });

// Assignment CRUD
router.post(
	"/",
	authenticate,
	validate(createLMSAssignmentSchema),
	assignmentController.createAssignment,
);
router.get(
	"/lessons/:lessonId/assignment",
	validateId(ZCuid),
	assignmentController.getAssignmentByLesson,
);
router.get("/:id", validateId(ZCuid), assignmentController.getAssignment);
router.patch(
	"/:id",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSAssignmentSchema),
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
	validate(submitLMSAssignmentSchema.omit({ assignmentId: true })),
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
	validateId(ZCuid),
	authenticate,
	validate(gradeLMSAssignmentSchema),
	assignmentController.gradeSubmission,
);

export default router;
