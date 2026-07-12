import { Router } from "express";
import { createLMSQuizSchema } from "@prepexcellence/shared-validators";
import assignmentRoutes from "./assignment/assignment.routes";
import courseRoutes from "./course/course.routes";
import enrollmentRoutes from "./enrollment/enrollment.routes";
import examRoutes from "./exam/exam.routes";
import lessonRoutes from "./lesson/lesson.routes";
import moduleRoutes from "./module/module.routes";
import progressRoutes from "./progress/progress.routes";
import quizRoutes from "./quiz/quiz.routes";
import reviewRoutes from "./review/review.routes";
import videoRoutes from "./video/video.routes";
import { authenticate } from "@/middleware/authenticate";
import { validate } from "@/middleware/validate";
import * as quizController from "./quiz/quiz.controller";

const router = Router({ mergeParams: true });

router.use("/courses", courseRoutes);
router.use("/courses", moduleRoutes);
router.use("/courses", lessonRoutes);
router.use("/courses", videoRoutes);
router.use("/courses", enrollmentRoutes);
router.use("/courses", progressRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/exams", examRoutes);
router.use("/courses", reviewRoutes);
router.use("/quizzes", quizRoutes);

// Module-level quiz (exam) routes
router.get(
	"/modules/:moduleId/quiz",
	authenticate,
	quizController.getQuizByModule,
);
router.post(
	"/modules/:moduleId/quizzes",
	authenticate,
	validate(createLMSQuizSchema),
	quizController.createQuizForModule,
);

export default router;
