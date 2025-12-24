import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireStaff } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import * as availabilityController from "./availability.controller";
import * as recordingController from "./recording.controller";
import * as sessionController from "./session.controller";
import * as teacherController from "./teacher.controller";

const router = Router();

// Teacher profile routes
router.post(
	"/teachers/profile",
	authenticate,
	teacherController.createTeacherProfile,
); // Teachers only
router.get("/teachers/:teacherId/profile", teacherController.getTeacherProfile); // Public
router.patch(
	"/teachers/:teacherId/profile",
	authenticate,
	teacherController.updateTeacherProfile,
); // Teacher own profile
router.get("/teachers/search", teacherController.searchTeachers); // Public

// Specialization routes
router.post(
	"/teachers/:teacherId/specializations",
	authenticate,
	teacherController.addSpecialization,
); // Teacher own profile
router.delete(
	"/specializations/:id",
	authenticate,
	teacherController.deleteSpecialization,
); // Teacher own profile

// Availability routes
router.post(
	"/teachers/:teacherId/availability",
	authenticate,
	availabilityController.createAvailability,
); // Teacher only
router.get(
	"/teachers/:teacherId/availability",
	availabilityController.getAvailability,
); // Public
router.get(
	"/teachers/:teacherId/available-slots",
	availabilityController.getAvailableSlots,
); // Public
// router.patch("/availability/:id", authenticate, availabilityController.updateAvailability); // Not implemented
router.delete(
	"/availability/:id",
	authenticate,
	availabilityController.deleteAvailability,
); // Teacher only

// Session routes
router.post("/sessions/book", authenticate, sessionController.bookSession); // Students only
router.get("/sessions", authenticate, sessionController.getStudentSessions); // Students only
router.get(
	"/sessions/:id",
	authenticate,
	authorize(PERMISSIONS.ONE_TO_ONE_SESSION.VIEW),
	sessionController.getSession,
);
router.get(
	"/teachers/:teacherId/sessions",
	authenticate,
	sessionController.getTeacherSessions,
); // Teacher only
router.post(
	"/sessions/:id/start",
	authenticate,
	sessionController.startSession,
); // Teacher only
router.post("/sessions/:id/end", authenticate, sessionController.endSession); // Teacher only
router.post(
	"/sessions/:id/cancel",
	authenticate,
	sessionController.cancelSession,
); // Student or Teacher

// Review routes
router.post(
	"/sessions/:sessionId/reviews",
	authenticate,
	sessionController.createReview,
); // Students only
router.get("/teachers/:teacherId/reviews", sessionController.getTeacherReviews); // Public

// Recording routes
router.get(
	"/sessions/:sessionId/recording",
	authenticate,
	recordingController.getRecording,
); // Session participants only
router.get(
	"/recordings/:id/download",
	authenticate,
	recordingController.downloadRecording,
); // Session participants only
router.delete(
	"/recordings/cleanup",
	requireStaff(),
	recordingController.cleanupExpiredRecordings,
); // Staff only

export default router;
