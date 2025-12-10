import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import * as contentController from "./content.controller";
import * as courseController from "./course.controller";
import * as enrollmentController from "./enrollment.controller";
import * as moduleController from "./module.controller";

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

// Content routes
router.post(
	"/topics/:topicId/contents",
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	contentController.createContent,
);
router.get(
	"/topics/:topicId/contents",
	authenticate,
	authorize(PERMISSIONS.CONTENT.VIEW_ENROLLED),
	contentController.getContents,
);
router.post(
	"/contents/:id/upload-video",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	contentController.uploadContentVideo,
);
router.post(
	"/contents/:id/start-session",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	contentController.startLiveSession,
);
router.post(
	"/contents/:id/end-session",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	contentController.endLiveSession,
);
router.patch(
	"/contents/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	contentController.updateContent,
);
router.delete(
	"/contents/:id",
	authenticate,
	authorize(PERMISSIONS.CONTENT.DELETE),
	contentController.deleteContent,
);

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

// Assignment submission routes
router.post(
	"/contents/:contentId/submissions",
	authenticate,
	enrollmentController.submitAssignment,
); // Students only
router.get(
	"/contents/:contentId/submissions",
	authenticate,
	authorize(PERMISSIONS.CONTENT.VIEW_ENROLLED),
	enrollmentController.getContentSubmissions,
);
router.patch(
	"/submissions/:id/grade",
	authenticate,
	authorize(PERMISSIONS.CONTENT.MODERATE),
	enrollmentController.gradeSubmission,
);

// Attendance routes
router.post(
	"/contents/:contentId/attendance",
	authenticate,
	enrollmentController.recordAttendance,
); // Students only
router.get(
	"/contents/:contentId/attendance",
	authenticate,
	authorize(PERMISSIONS.CONTENT.VIEW_ENROLLED),
	enrollmentController.getContentAttendance,
);

export default router;
