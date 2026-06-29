import {
	bookSessionSchema,
	cancelSessionSchema,
	createOneToOneReviewSchema,
	createTeacherProfileSchema,
	searchTeachersSchema,
	updateSessionStatusSchema,
	updateTeacherProfileSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as availabilityController from "./availability.controller";
import * as recordingController from "./recording.controller";
import * as sessionController from "./session.controller";
import * as teacherController from "./teacher.controller";

const router = Router();

/**
 * @swagger
 * /api/onetoone/teachers/profile:
 *   post:
 *     summary: Create teacher profile
 *     description: Creates a new teacher profile for one-to-one tutoring. Requires teacher role.
 *     tags: [One-to-One - Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *               - onlineHourlyRate
 *               - offlineHourlyRate
 *             properties:
 *               bio:
 *                 type: string
 *                 description: Teacher biography
 *               onlineHourlyRate:
 *                 type: number
 *                 description: Online session hourly rate in USD
 *               offlineHourlyRate:
 *                 type: number
 *                 description: In-person session hourly rate in USD
 *               yearsOfExperience:
 *                 type: integer
 *               education:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher profile created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires teacher role
 */
router.post(
	"/teachers/profile",
	validate(createTeacherProfileSchema),
	authenticate,
	// authorize(PERMISSIONS.TEACHER_PROFILE.ADD),
	teacherController.createTeacherProfile,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/profile:
 *   get:
 *     summary: Get teacher profile
 *     description: Retrieves public teacher profile information
 *     tags: [One-to-One - Teachers]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher profile retrieved successfully
 *       404:
 *         description: Teacher not found
 */
router.get(
	"/teachers/:teacherId/profile",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	teacherController.getTeacherProfile,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/profile:
 *   patch:
 *     summary: Update teacher profile
 *     description: Updates teacher's own profile information
 *     tags: [One-to-One - Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               onlineHourlyRate:
 *                 type: number
 *               offlineHourlyRate:
 *                 type: number
 *               yearsOfExperience:
 *                 type: integer
 *               education:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - can only update own profile
 */
router.patch(
	"/teachers/:teacherId/profile",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	validate(updateTeacherProfileSchema),
	authenticate,
	// authorize(PERMISSIONS.TEACHER_PROFILE.CHANGE),
	teacherController.updateTeacherProfile,
);

/**
 * @swagger
 * /api/onetoone/teachers/search:
 *   get:
 *     summary: Search teachers
 *     description: Searches for available teachers with filters
 *     tags: [One-to-One - Teachers]
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject specialization
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum hourly rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum hourly rate
 *     responses:
 *       200:
 *         description: Search results returned successfully
 */
router.get(
	"/teachers",
	validateQuery(searchTeachersSchema),
	teacherController.getTeachers,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/availability:
 *   post:
 *     summary: Create availability slot
 *     description: Creates a new availability time slot for teacher
 *     tags: [One-to-One - Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               isRecurring:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Availability created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
	"/teachers/:teacherId/availability",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	authenticate,
	// authorize(PERMISSIONS.TEACHER_AVAILABILITY.ADD),
	availabilityController.createAvailability,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/availability:
 *   get:
 *     summary: Get teacher availability
 *     description: Retrieves all availability slots for a teacher
 *     tags: [One-to-One - Availability]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability retrieved successfully
 */
router.get(
	"/teachers/:teacherId/availability",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	availabilityController.getAvailability,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     RecurringAvailabilityUpdate:
 *       type: object
 *       required:
 *         - availabilityType
 *       properties:
 *         availabilityType:
 *           type: string
 *           enum: [RECURRING_WEEKLY]
 *         dayOfWeek:
 *           type: string
 *           enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *         startTime:
 *           type: string
 *           example: "10:00"
 *         endTime:
 *           type: string
 *           example: "12:00"
 *
 *     OneTimeAvailabilityUpdate:
 *       type: object
 *       required:
 *         - availabilityType
 *       properties:
 *         availabilityType:
 *           type: string
 *           enum: [ONE_TIME_SLOT]
 *         specificDate:
 *           type: string
 *           format: date-time
 *         specificStartTime:
 *           type: string
 *           format: date-time
 *         specificEndTime:
 *           type: string
 *           format: date-time
 */
router.put(
	"/teachers/availability/:id",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	availabilityController.updateAvailability,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/available-slots:
 *   get:
 *     summary: Get available time slots
 *     description: Retrieves bookable time slots for a teacher
 *     tags: [One-to-One - Availability]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
 */
router.get(
	"/teachers/:teacherId/available-slots",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	availabilityController.getAvailableSlots,
);

/**
 * @swagger
 * /api/onetoone/availability/{id}:
 *   delete:
 *     summary: Delete availability slot
 *     description: Removes an availability slot
 *     tags: [One-to-One - Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
	"/availability/:id",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	authenticate,
	// authorize(PERMISSIONS.TEACHER_AVAILABILITY.DELETE),
	availabilityController.deleteAvailability,
);

/**
 * @swagger
 * /api/onetoone/sessions/book:
 *   post:
 *     summary: Book a session
 *     description: Books a one-to-one tutoring session with a teacher
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - startTime
 *               - endTime
 *             properties:
 *               teacherId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session booked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires student role
 */
router.post(
	"/sessions/book",
	validate(bookSessionSchema),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.ADD),
	sessionController.bookSession,
);

/**
 * @swagger
 * /api/onetoone/sessions:
 *   get:
 *     summary: Get student sessions
 *     description: Retrieves all sessions for the authenticated student
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, InProgress, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
	"/sessions",
	validateQuery(ZQueryParams),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.VIEW),
	sessionController.getStudentSessions,
);

/**
 * @swagger
 * /api/onetoone/sessions/{id}:
 *   get:
 *     summary: Get session details
 *     description: Retrieves detailed information about a specific session
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Session not found
 */
router.get(
	"/sessions/:id",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.VIEW),
	sessionController.getSession,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/sessions:
 *   get:
 *     summary: Get teacher sessions
 *     description: Retrieves all sessions for a specific teacher
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, InProgress, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
	"/teachers/:teacherId/sessions",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	validateQuery(ZQueryParams),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.VIEW),
	sessionController.getTeacherSessions,
);

/**
 * @swagger
 * /api/onetoone/sessions/{id}/start:
 *   post:
 *     summary: Start session
 *     description: Marks a session as started (teacher only)
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session started successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - teacher only
 */
router.post(
	"/sessions/:id/start",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.CHANGE),
	sessionController.startSession,
);

/**
 * @swagger
 * /api/onetoone/sessions/{id}/end:
 *   post:
 *     summary: End session
 *     description: Marks a session as completed (teacher only)
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *               recordingUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session ended successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - teacher only
 */
router.post(
	"/sessions/:id/end",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	validate(updateSessionStatusSchema),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.CHANGE),
	sessionController.endSession,
);

/**
 * @swagger
 * /api/onetoone/sessions/{id}/cancel:
 *   post:
 *     summary: Cancel session
 *     description: Cancels a scheduled session (student or teacher)
 *     tags: [One-to-One - Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
	"/sessions/:id/cancel",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	validate(cancelSessionSchema),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_SESSION.CHANGE),
	sessionController.cancelSession,
);

/**
 * @swagger
 * /api/onetoone/sessions/{sessionId}/reviews:
 *   post:
 *     summary: Create session review
 *     description: Creates a review for a completed session (student only)
 *     tags: [One-to-One - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student only
 */
router.post(
	"/sessions/:sessionId/reviews",
	validateId(z.object({ sessionId: z.cuid({ message: "Invalid sessionId" }) })),
	validate(createOneToOneReviewSchema),
	authenticate,
	// authorize(PERMISSIONS.ONE_TO_ONE_REVIEW.ADD),
	sessionController.createReview,
);

/**
 * @swagger
 * /api/onetoone/teachers/{teacherId}/reviews:
 *   get:
 *     summary: Get teacher reviews
 *     description: Retrieves all reviews for a teacher
 *     tags: [One-to-One - Reviews]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get(
	"/teachers/:teacherId/reviews",
	validateId(z.object({ teacherId: z.cuid({ message: "Invalid teacherId" }) })),
	validateQuery(ZQueryParams),
	sessionController.getTeacherReviews,
);

/**
 * @swagger
 * /api/onetoone/sessions/{sessionId}/recording:
 *   get:
 *     summary: Get session recording
 *     description: Retrieves recording information for a session (participants only)
 *     tags: [One-to-One - Recordings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recording information retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - participants only
 *       404:
 *         description: Recording not found
 */
router.get(
	"/sessions/:sessionId/recording",
	validateId(z.object({ sessionId: z.cuid({ message: "Invalid sessionId" }) })),
	authenticate,
	// authorize(PERMISSIONS.SESSION_RECORDING.VIEW),
	recordingController.getRecording,
);

// Jibri / Orchestrator uploads raw MP4 to API (or notifies API of MinIO path)
router.post(
	"/sessions/:sessionId/recording/upload",
	validateId(z.object({ sessionId: z.cuid({ message: "Invalid sessionId" }) })),
	recordingController.uploadRawRecording,
);

/**
 * @swagger
 * /api/onetoone/recordings/{id}/download:
 *   get:
 *     summary: Download recording
 *     description: Downloads session recording (participants only)
 *     tags: [One-to-One - Recordings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recording download initiated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - participants only
 */
router.get(
	"/recordings/:id/download",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	authenticate,
	// authorize(PERMISSIONS.SESSION_RECORDING.VIEW),
	recordingController.downloadRecording,
);

/**
 * @swagger
 * /api/onetoone/recordings/cleanup:
 *   delete:
 *     summary: Cleanup expired recordings
 *     description: Removes recordings that have exceeded retention period (staff only)
 *     tags: [One-to-One - Recordings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - staff only
 */
router.delete(
	"/recordings/cleanup",
	recordingController.cleanupExpiredRecordings,
);

export default router;
