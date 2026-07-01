import {
	addQuizQuestionSchema,
	createLMSExamSchema,
	submitLMSExamAttemptSchema,
	updateLMSExamSchema,
	updateQuizQuestionOptionSchema,
	updateQuizQuestionSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as examController from "./exam.controller";

const router = Router({ mergeParams: true });

// ─── Exam CRUD ──────────────────────────────────────────────────────────────

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

// ─── Question CRUD ──────────────────────────────────────────────────────────

router.post(
	"/:examId/questions",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	authenticate,
	validate(addQuizQuestionSchema),
	examController.createQuestion,
);
router.patch(
	"/:examId/questions/:questionId",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	validateId(z.object({ questionId: z.cuid("Invalid question ID") })),
	authenticate,
	validate(updateQuizQuestionSchema),
	examController.updateQuestion,
);
router.delete(
	"/:examId/questions/:questionId",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	validateId(z.object({ questionId: z.cuid("Invalid question ID") })),
	authenticate,
	examController.deleteQuestion,
);

// ─── Option CRUD ────────────────────────────────────────────────────────────

router.patch(
	"/:examId/questions/:questionId/options/:optionId",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	validateId(z.object({ questionId: z.cuid("Invalid question ID") })),
	validateId(z.object({ optionId: z.cuid("Invalid option ID") })),
	authenticate,
	validate(updateQuizQuestionOptionSchema),
	examController.updateOption,
);
router.delete(
	"/:examId/questions/:questionId/options/:optionId",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	validateId(z.object({ questionId: z.cuid("Invalid question ID") })),
	validateId(z.object({ optionId: z.cuid("Invalid option ID") })),
	authenticate,
	examController.deleteOption,
);

// ─── Attempts ───────────────────────────────────────────────────────────────

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

// ─── Student-facing ─────────────────────────────────────────────────────────

router.get(
	"/:id/student",
	validateId(ZCuid),
	authenticate,
	examController.getStudentExam,
);
router.get(
	"/:id/my-attempts",
	validateId(ZCuid),
	authenticate,
	examController.getMyAttempts,
);
router.get(
	"/attempts/:attemptId",
	validateId(z.object({ attemptId: z.cuid("Invalid CUID format") })),
	authenticate,
	examController.getAttemptDetail,
);

export default router;
