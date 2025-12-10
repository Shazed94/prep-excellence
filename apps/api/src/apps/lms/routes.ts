import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import * as courseController from "./course.controller";
import * as enrollmentController from "./enrollment.controller";
import * as lessonController from "./lesson.controller";
import * as moduleController from "./module.controller";
import * as progressController from "./progress.controller";
import * as quizController from "./quiz.controller";

const router = Router();

// Course routes
router.post(
	"/courses",
	authenticate,
	authorize(PERMISSIONS.COURSE.ADD),
	courseController.createCourse,
);
router.get("/courses", courseController.getCourses); // Public
router.get("/courses/:id", courseController.getCourse); // Public
router.patch(
	"/courses/:id",
	authenticate,
	authorize(PERMISSIONS.COURSE.CHANGE),
	courseController.updateCourse,
);
router.patch(
	"/courses/:id/publish",
	authenticate,
	authorize(PERMISSIONS.COURSE.PUBLISH),
	courseController.publishCourse,
);
router.delete(
	"/courses/:id",
	authenticate,
	authorize(PERMISSIONS.COURSE.DELETE),
	courseController.deleteCourse,
);

// Module routes
router.post(
	"/courses/:courseId/modules",
	authenticate,
	authorize(PERMISSIONS.COURSE.MANAGE_CONTENT),
	moduleController.createModule,
);
router.get("/courses/:courseId/modules", moduleController.getModules); // Public
router.patch(
	"/modules/:id",
	authenticate,
	authorize(PERMISSIONS.COURSE.MANAGE_CONTENT),
	moduleController.updateModule,
);
router.delete(
	"/modules/:id",
	authenticate,
	authorize(PERMISSIONS.COURSE.MANAGE_CONTENT),
	moduleController.deleteModule,
);

// Lesson routes
router.post(
	"/modules/:moduleId/lessons",
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	lessonController.createLesson,
);
router.get(
	"/modules/:moduleId/lessons",
	authenticate,
	lessonController.getLessons,
); // Needs auth to check unlock status
router.post(
	"/lessons/:id/upload-video",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	lessonController.uploadLessonVideo,
);
router.post(
	"/lessons/:id/thumbnail/select",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	lessonController.selectLessonThumbnail,
);
router.patch(
	"/lessons/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	lessonController.updateLesson,
);
router.delete(
	"/lessons/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.DELETE),
	lessonController.deleteLesson,
);

// Quiz routes
router.post(
	"/modules/:moduleId/quizzes",
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	quizController.createQuiz,
);
router.get(
	"/quizzes/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.VIEW_ENROLLED),
	quizController.getQuiz,
);
router.patch(
	"/quizzes/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	quizController.updateQuiz,
);
router.post(
	"/quizzes/:quizId/attempts",
	authenticate,
	quizController.submitQuizAttempt,
); // Students only
router.get(
	"/quizzes/:quizId/attempts",
	authenticate,
	quizController.getQuizAttempts,
); // Students only
router.delete(
	"/quizzes/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.DELETE),
	quizController.deleteQuiz,
);

// Progress routes
router.patch(
	"/progress/:enrollmentId/lessons/:lessonId",
	authenticate,
	progressController.updateProgress,
); // Students only
router.get(
	"/progress/:enrollmentId",
	authenticate,
	progressController.getEnrollmentProgress,
); // Students or instructors
router.get(
	"/progress/:enrollmentId/lessons/:lessonId",
	authenticate,
	progressController.getLessonProgress,
); // Students or instructors

// Enrollment routes
router.post(
	"/courses/:courseId/enroll",
	authenticate,
	enrollmentController.enrollInCourse,
); // Students only
router.get(
	"/enrollments",
	authenticate,
	enrollmentController.getStudentEnrollments,
); // Students only

// Discussion routes
router.post(
	"/courses/:courseId/discussions",
	authenticate,
	enrollmentController.createDiscussion,
); // Authenticated users
router.get(
	"/courses/:courseId/discussions",
	authenticate,
	enrollmentController.getCourseDiscussions,
); // Enrolled students

// Review routes
router.post(
	"/courses/:courseId/reviews",
	authenticate,
	enrollmentController.createReview,
); // Enrolled students
router.get("/courses/:courseId/reviews", enrollmentController.getCourseReviews); // Public

export default router;
