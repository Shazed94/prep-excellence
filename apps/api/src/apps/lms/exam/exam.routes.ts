import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as examController from "./exam.controller";

const router = Router({ mergeParams: true });

// Exam CRUD
router.post("/", authenticate, examController.createExam);
router.get("/lessons/:lessonId/exam", examController.getExamByLesson);
router.get("/:id", examController.getExam);
router.patch("/:id", authenticate, examController.updateExam);
router.delete("/:id", authenticate, examController.deleteExam);

// Attempts
router.post("/:id/attempts/start", authenticate, examController.startAttempt);
router.post(
	"/:id/attempts/:attemptId/submit",
	authenticate,
	examController.submitAttempt,
);
router.get("/:id/attempts", authenticate, examController.getAttempts);

export default router;
