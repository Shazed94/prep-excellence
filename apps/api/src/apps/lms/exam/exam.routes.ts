import {
	createLMSExamSchema,
	submitLMSExamAttemptSchema,
	updateLMSExamSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as examController from "./exam.controller";

const router = Router({ mergeParams: true });

// Exam CRUD
router.post(
	"/",
	authenticate,
	validate(createLMSExamSchema),
	examController.createExam,
);
router.get(
	"/lessons/:lessonId/exam",
	validateId(ZCuid),
	examController.getExamByLesson,
);
router.get("/:id", validateId(ZCuid), examController.getExam);
router.patch(
	"/:id",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSExamSchema),
	examController.updateExam,
);
router.delete(
	"/:id",
	validateId(ZCuid),
	authenticate,
	examController.deleteExam,
);

// Attempts
router.post(
	"/:id/attempts/start",
	validateId(ZCuid),
	authenticate,
	examController.startAttempt,
);
router.post(
	"/:id/attempts/:attemptId/submit",
	validateId(ZCuid),
	authenticate,
	validate(submitLMSExamAttemptSchema),
	examController.submitAttempt,
);
router.get(
	"/:id/attempts",
	validateId(ZCuid),
	authenticate,
	validateQuery(ZQueryParams),
	examController.getAttempts,
);

export default router;
