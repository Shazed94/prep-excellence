import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as assignmentController from "./assignment.controller";

const router = Router({ mergeParams: true });

// Assignment CRUD
router.post("/", authenticate, assignmentController.createAssignment);
router.get(
	"/lessons/:lessonId/assignment",
	assignmentController.getAssignmentByLesson,
);
router.get("/:id", assignmentController.getAssignment);
router.patch("/:id", authenticate, assignmentController.updateAssignment);
router.delete("/:id", authenticate, assignmentController.deleteAssignment);

// Submissions
router.post("/:id/submit", authenticate, assignmentController.submitAssignment);
router.get(
	"/:id/submissions",
	authenticate,
	assignmentController.getSubmissions,
);
router.patch(
	"/submissions/:submissionId/grade",
	authenticate,
	assignmentController.gradeSubmission,
);

export default router;
