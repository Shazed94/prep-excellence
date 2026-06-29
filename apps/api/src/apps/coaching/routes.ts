import { Router } from "express";
import assignmentRoutes from "./assignment/assignment.routes";
import attendanceRoutes from "./attendance/attendance.routes";
import courseRoutes from "./course/course.routes";
import enrollmentRoutes from "./enrollment/enrollment.routes";
import examRoutes from "./exam/exam.routes";
import lessonRoutes from "./lesson/lesson.routes";
import moduleRoutes from "./module/module.routes";
import progressRoutes from "./progress/progress.routes";
import scheduleRoutes from "./schedule/schedule.routes";

const router = Router({ mergeParams: true });

router.use("/courses", courseRoutes);
router.use("/courses", moduleRoutes);
router.use("/courses", lessonRoutes);
router.use("/courses", scheduleRoutes);
router.use("/courses", attendanceRoutes);
router.use("/courses", enrollmentRoutes);
router.use("/courses", progressRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/exams", examRoutes);

export default router;
