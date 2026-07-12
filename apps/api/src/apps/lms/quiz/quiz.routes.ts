import {
	addQuizQuestionSchema,
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
import * as examController from "../exam/exam.controller";
import * as quizController from "./quiz.controller";

const router = Router({ mergeParams: true });

// ─── Quiz CRUD ────────────────────────────────────────────────────────────

router.post("/", authenticate, quizController.createQuiz);
router.get("/:id", validateId(ZCuid), examController.getExam);
router.patch("/:id", validateId(ZCuid), authenticate, validate(updateLMSExamSchema), examController.updateExam);
router.delete("/:id", validateId(ZCuid), authenticate, examController.deleteExam);

// ─── Question CRUD ────────────────────────────────────────────────────────

router.get("/:id/questions", validateId(ZCuid), quizController.getQuizQuestions);
router.post("/:examId/questions", validateId(z.object({ examId: z.cuid("Invalid quiz ID") })), authenticate, validate(addQuizQuestionSchema), examController.createQuestion);
router.patch("/:id/questions/:questionId", validateId(z.object({ id: z.cuid("Invalid quiz ID") })), validateId(z.object({ questionId: z.cuid("Invalid question ID") })), authenticate, validate(updateQuizQuestionSchema), examController.updateQuestion);
router.delete("/:id/questions/:questionId", validateId(z.object({ id: z.cuid("Invalid quiz ID") })), validateId(z.object({ questionId: z.cuid("Invalid question ID") })), authenticate, examController.deleteQuestion);

// ─── Option CRUD ──────────────────────────────────────────────────────────

router.patch("/:id/questions/:questionId/options/:optionId", validateId(z.object({ id: z.cuid("Invalid quiz ID") })), validateId(z.object({ questionId: z.cuid("Invalid question ID") })), validateId(z.object({ optionId: z.cuid("Invalid option ID") })), authenticate, validate(updateQuizQuestionOptionSchema), examController.updateOption);
router.delete("/:id/questions/:questionId/options/:optionId", validateId(z.object({ id: z.cuid("Invalid quiz ID") })), validateId(z.object({ questionId: z.cuid("Invalid question ID") })), validateId(z.object({ optionId: z.cuid("Invalid option ID") })), authenticate, examController.deleteOption);

// ─── Attempts ─────────────────────────────────────────────────────────────

router.post("/:id/attempts", validateId(ZCuid), authenticate, quizController.submitQuizAttempt);
router.get("/:id/attempts", validateId(ZCuid), authenticate, validateQuery(ZQueryParams), examController.getAttempts);

// ─── Student-facing ───────────────────────────────────────────────────────

router.get("/:id/student", validateId(ZCuid), authenticate, examController.getStudentExam);
router.get("/:id/my-attempts", validateId(ZCuid), authenticate, examController.getMyAttempts);
router.get("/attempts/:attemptId", validateId(z.object({ attemptId: z.cuid("Invalid CUID format") })), authenticate, examController.getAttemptDetail);

// ─── Question operations ──────────────────────────────────────────────────

router.patch("/:id/reorder-questions", validateId(ZCuid), authenticate, quizController.reorderQuizQuestions);
router.post("/:id/questions/:questionId/duplicate", validateId(ZCuid), validateId(z.object({ questionId: z.cuid("Invalid question ID") })), authenticate, quizController.duplicateQuizQuestion);

export default router;
