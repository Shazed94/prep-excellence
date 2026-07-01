import {
	ZCCoachingExamQuestionSchema,
	ZCCoachingExamSchema,
	ZCuid,
	ZQueryParams,
	ZReorderExamQuestionsSchema,
	ZSubmitExamAttemptSchema,
	ZUCoachingExamQuestionOptionSchema,
	ZUCoachingExamQuestionSchema,
	ZUCoachingExamSchema,
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
	validate(ZCCoachingExamSchema),
	examController.createExam,
);
router.get(
	"/lessons/:lessonId/exam",
	validateId(z.object({ lessonId: z.cuid("Invalid CUID format") })),
	examController.getExamByLesson,
);
router.get("/:id", validateId(ZCuid), examController.getExam);
router.patch(
	"/:id",
	validateId(ZCuid),
	authenticate,
	validate(ZUCoachingExamSchema),
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
	validate(ZCCoachingExamQuestionSchema),
	examController.createQuestion,
);
router.patch(
	"/:examId/questions/reorder",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	authenticate,
	validate(ZReorderExamQuestionsSchema),
	examController.reorderQuestions,
);
router.patch(
	"/:examId/questions/:questionId",
	validateId(z.object({ examId: z.cuid("Invalid exam ID") })),
	validateId(z.object({ questionId: z.cuid("Invalid question ID") })),
	authenticate,
	validate(ZUCoachingExamQuestionSchema),
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
	validate(ZUCoachingExamQuestionOptionSchema),
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
	validateId(z.object({ attemptId: z.cuid("Invalid CUID format") })),
	authenticate,
	validate(ZSubmitExamAttemptSchema),
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
