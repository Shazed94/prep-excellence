import { Router } from "express";
import assignmentRoutes from "./assignment/assignment.routes";
import courseRoutes from "./course/course.routes";
import enrollmentRoutes from "./enrollment/enrollment.routes";
import examRoutes from "./exam/exam.routes";
import lessonRoutes from "./lesson/lesson.routes";
import moduleRoutes from "./module/module.routes";
import progressRoutes from "./progress/progress.routes";
import reviewRoutes from "./review/review.routes";
import videoRoutes from "./video/video.routes";

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

export default router;
