/**
 * @fileoverview LMS (Learning Management System) API Routes
 *
 * This file contains all route definitions for the LMS module with comprehensive
 * Swagger/OpenAPI documentation for each endpoint.
 *
 * @module lms/routes
 *
 * Route Organization:
 * ==================
 *
 * COURSES (LMS - Courses):
 *   POST   /courses                    - Create course (LMS_COURSE.ADD)
 *   GET    /courses                    - Get all courses (public)
 *   GET    /courses/:id                - Get single course (public)
 *   PATCH  /courses/:id                - Update course (LMS_COURSE.CHANGE)
 *   PATCH  /courses/:id/publish        - Publish/unpublish course (LMS_COURSE.PUBLISH)
 *   DELETE /courses/:id                - Delete course (LMS_COURSE.DELETE)
 *
 * MODULES (LMS - Modules):
 *   POST   /courses/:courseId/modules  - Create module (LMS_MODULE.ADD)
 *   GET    /courses/:courseId/modules  - Get course modules (public)
 *   PATCH  /modules/:id                - Update module (LMS_MODULE.CHANGE)
 *   DELETE /modules/:id                - Delete module (LMS_MODULE.DELETE)
 *
 * LESSONS (LMS - Lessons):
 *   POST   /modules/:moduleId/lessons  - Create lesson (LMS_LESSON.ADD)
 *   GET    /modules/:moduleId/lessons  - Get module lessons (authenticated)
 *   PATCH  /lessons/:id                - Update lesson (LMS_LESSON.CHANGE)
 *   DELETE /lessons/:id                - Delete lesson (LMS_LESSON.DELETE)
 *   POST   /lessons/:id/upload-video   - Upload lesson video (LMS_LESSON.CHANGE)
 *   POST   /lessons/:id/thumbnail/select - Select lesson thumbnail (LMS_LESSON.CHANGE)
 *
 * QUIZZES (LMS - Quizzes):
 *   POST   /modules/:moduleId/quizzes  - Create quiz (LMS_QUIZ.ADD)
 *   GET    /quizzes/:id                - Get quiz (LMS_QUIZ.VIEW)
 *   PATCH  /quizzes/:id                - Update quiz (LMS_QUIZ.CHANGE)
 *   DELETE /quizzes/:id                - Delete quiz (LMS_QUIZ.DELETE)
 *   POST   /quizzes/:quizId/questions  - Add question (LMS_QUIZ.ADD)
 *   PATCH  /quizzes/:quizId/questions/:questionId - Update question (LMS_QUIZ.CHANGE)
 *   DELETE /quizzes/:quizId/questions/:questionId - Delete question (LMS_QUIZ.DELETE)
 *   POST   /quizzes/:quizId/attempts   - Submit quiz attempt (authenticated)
 *   GET    /quizzes/:quizId/attempts   - Get quiz attempts (authenticated)
 *
 * ENROLLMENT (LMS - Enrollment):
 *   POST   /courses/:courseId/enroll   - Enroll in course (authenticated)
 *   GET    /enrollments                - Get student enrollments (LMS_ENROLLMENT.VIEW_OWN)
 *
 * PROGRESS (LMS - Progress):
 *   PATCH  /progress/:enrollmentId/lessons/:lessonId - Update lesson progress (authenticated)
 *   GET    /progress/:enrollmentId     - Get enrollment progress (LMS_PROGRESS.VIEW_OWN)
 *   GET    /progress/:enrollmentId/lessons/:lessonId - Get lesson progress (LMS_PROGRESS.VIEW_OWN)
 *
 * REVIEWS (LMS - Reviews):
 *   POST   /reviews                    - Create review (authenticated)
 *   GET    /courses/:courseId/reviews-list - Get course reviews with stats (public)
 *   GET    /courses/:courseId/my-review - Get user's review (authenticated)
 *   GET    /reviews/:id                - Get review by ID (public)
 *   PATCH  /reviews/:id                - Update review (authenticated, owner only)
 *   DELETE /reviews/:id                - Delete review (authenticated, owner only)
 *
 * DISCUSSIONS (LMS - Discussions):
 *   POST   /discussions                - Create discussion/reply (authenticated)
 *   GET    /lessons/:lessonId/discussions - Get lesson discussions (public)
 *   GET    /discussions/:id            - Get discussion by ID (public)
 *   PATCH  /discussions/:id            - Update discussion (authenticated, owner only)
 *   DELETE /discussions/:id            - Delete discussion (authenticated, owner only)
 *
 * LEGACY ENDPOINTS (Deprecated):
 *   POST   /courses/:courseId/discussions - Use /discussions instead
 *   GET    /courses/:courseId/discussions - Use /lessons/:lessonId/discussions
 *   POST   /courses/:courseId/reviews  - Use /reviews instead
 *   GET    /courses/:courseId/reviews  - Use /courses/:courseId/reviews-list
 *
 * Permission System:
 * ==================
 * All permissions follow the pattern: LMS_{RESOURCE}.{ACTION}
 *
 * Available Permissions:
 * - LMS_COURSE: ADD, CHANGE, DELETE, PUBLISH, VIEW, VIEW_ENROLLED, VIEW_OWN
 * - LMS_MODULE: ADD, CHANGE, DELETE, VIEW, VIEW_ENROLLED, UNLOCK
 * - LMS_LESSON: ADD, CHANGE, DELETE, VIEW, VIEW_ENROLLED, COMPLETE
 * - LMS_QUIZ: ADD, CHANGE, DELETE, VIEW, CREATE, TAKE, GRADE, VIEW_RESULTS, VIEW_OWN_RESULTS
 * - LMS_ENROLLMENT: ADD, CHANGE, DELETE, VIEW_OWN, APPROVE, REJECT
 * - LMS_PROGRESS: ADD, CHANGE, DELETE, VIEW_OWN, VIEW_ENROLLED, TRACK
 * - LMS_DISCUSSION: ADD, CHANGE, DELETE, VIEW, CREATE_THREAD, POST_MESSAGE, MODERATE
 * - LMS_REVIEW: ADD, CHANGE, DELETE, VIEW, VIEW_OWN, MODERATE, APPROVE
 *
 * Validation:
 * ===========
 * All input validation is handled using Zod schemas from @prepexcellence/shared-validators
 * Request bodies and query parameters are validated in controllers using these schemas.
 *
 * Response Format:
 * ================
 * All responses follow the standard format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: object | array,
 *   pagination?: { page, limit, total, totalPages }
 * }
 *
 * @see {@link file://../../middleware/authenticate.ts} - Authentication middleware
 * @see {@link file://../../middleware/authorize.ts} - Authorization middleware
 * @see {@link file://../../utils/permission.ts} - Permission definitions
 * @see {@link file://../../../../packages/shared-validators/src/lms.ts} - Validation schemas
 */

import {
	addQuizQuestionSchema,
	createLMSCourseSchema,
	createLMSDiscussionSchema,
	createLMSLessonSchema,
	createLMSModuleSchema,
	createLMSQuizSchema,
	createLMSReviewSchema,
	submitQuizAttemptSchema,
	updateLMSCourseSchema,
	updateLMSDiscussionSchema,
	updateLMSLessonSchema,
	updateLMSProgressSchema,
	updateLMSQuizSchema,
	updateLMSReviewSchema,
	updateQuizQuestionSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { uploadCourseThumbnail } from "@/middleware/upload";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import * as courseController from "./course.controller";
import * as discussionController from "./discussion.controller";
import * as enrollmentController from "./enrollment.controller";
import * as lessonController from "./lesson.controller";
import * as moduleController from "./module.controller";
import * as progressController from "./progress.controller";
import * as quizController from "./quiz.controller";
import * as reviewController from "./review.controller";

const router = Router();

// Course routes

/**
 * @swagger
 * /api/v1/lms/courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new LMS course (requires authentication and LMS_COURSE.ADD permission)
 *     tags: [LMS - Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - instructorId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Introduction to Web Development
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 example: Learn the basics of HTML, CSS, and JavaScript
 *               thumbnail:
 *                 type: string
 *                 format: url
 *                 example: https://example.com/courses/web-dev-intro.jpg
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 49.99
 *               discount:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 10
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *                 default: BEGINNER
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3600
 *               category:
 *                 type: string
 *                 example: Programming
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "web development"]
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Basic computer knowledge"]
 *               whatYouLearn:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Build modern web applications"]
 *               instructorId:
 *                 type: string
 *                 format: cuid
 *                 example: clxyz123abc
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/courses",
	validate(createLMSCourseSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_COURSE.ADD),
	uploadCourseThumbnail,
	courseController.createCourse,
);

// validateQuery(ZQueryParams),
// 	validateId(ZCuid),
// 	validate(ZUUser),

/**
 * @swagger
 * /api/v1/lms/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a paginated list of courses with optional filtering and search
 *     tags: [LMS - Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in course title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *           enum: [createdAt, updatedAt, title, price]
 *         description: Field to sort by
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *         description: Additional filters (category, level, instructorId, isPublished)
 *         style: deepObject
 *         explode: true
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Courses retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: cuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       thumbnail:
 *                         type: string
 *                         format: url
 *                       price:
 *                         type: number
 *                       discount:
 *                         type: number
 *                       level:
 *                         type: string
 *                         enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *                       category:
 *                         type: string
 *                       isPublished:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get(
	"/courses",
	validateQuery(ZQueryParams),
	courseController.getCourses,
);

/**
 * @swagger
 * /api/v1/lms/courses/{id}:
 *   get:
 *     summary: Get a single course
 *     description: Retrieve detailed information about a specific course with modules and lessons
 *     tags: [LMS - Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     thumbnail:
 *                       type: string
 *                       format: url
 *                     price:
 *                       type: number
 *                     discount:
 *                       type: number
 *                     level:
 *                       type: string
 *                       enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *                     duration:
 *                       type: integer
 *                     category:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     requirements:
 *                       type: array
 *                       items:
 *                         type: string
 *                     whatYouLearn:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isPublished:
 *                       type: boolean
 *                     instructorId:
 *                       type: string
 *                       format: cuid
 *                     modules:
 *                       type: array
 *                       items:
 *                         type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/courses/:id", validateId(ZCuid), courseController.getCourse);

/**
 * @swagger
 * /api/v1/lms/courses/{id}:
 *   patch:
 *     summary: Update a course
 *     description: Update course details (requires authentication and LMS_COURSE.CHANGE permission)
 *     tags: [LMS - Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 minLength: 10
 *               thumbnail:
 *                 type: string
 *                 format: url
 *               price:
 *                 type: number
 *                 minimum: 0
 *               discount:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *               duration:
 *                 type: integer
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               whatYouLearn:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
	"/courses/:id",
	validateId(ZCuid),
	validate(updateLMSCourseSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_COURSE.CHANGE),
	courseController.updateCourse,
);

/**
 * @swagger
 * /api/v1/lms/courses/{id}/publish:
 *   patch:
 *     summary: Publish a course
 *     description: Publish or unpublish a course (requires LMS_COURSE.PUBLISH permission)
 *     tags: [LMS - Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - isPublished
 *             properties:
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Course published status updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/courses/:id/publish",
	authenticate,
	authorize(PERMISSIONS.LMS_COURSE.PUBLISH),
	courseController.publishCourse,
);

/**
 * @swagger
 * /api/v1/lms/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete a course (requires LMS_COURSE.DELETE permission)
 *     tags: [LMS - Courses]
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
 *         description: Course deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/courses/:id",
	authenticate,
	authorize(PERMISSIONS.LMS_COURSE.DELETE),
	courseController.deleteCourse,
);

// Module routes

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/modules:
 *   post:
 *     summary: Create a module in a course
 *     description: Add a new module to a course (requires LMS_MODULE.ADD permission)
 *     tags: [LMS - Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *               - title
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Getting Started
 *               description:
 *                 type: string
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *     responses:
 *       201:
 *         description: Module created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/courses/:courseId/modules",
	validateId(z.object({ courseId: z.cuid({ message: "Invalid courseId" }) })),
	validate(createLMSModuleSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_MODULE.ADD),
	moduleController.createModule,
);

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/modules:
 *   get:
 *     summary: Get all modules in a course
 *     description: Retrieve all modules for a specific course
 *     tags: [LMS - Modules]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
 */
router.get(
	"/courses/:courseId/modules",
	validateId(z.object({ courseId: z.cuid({ message: "Invalid courseId" }) })),
	moduleController.getModules,
);

/**
 * @swagger
 * /api/v1/lms/modules/{id}:
 *   patch:
 *     summary: Update a module
 *     description: Update module details (requires LMS_MODULE.CHANGE permission)
 *     tags: [LMS - Modules]
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
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/modules/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_MODULE.CHANGE),
	moduleController.updateModule,
);

/**
 * @swagger
 * /api/v1/lms/modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     description: Delete a module from a course (requires LMS_MODULE.DELETE permission)
 *     tags: [LMS - Modules]
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
 *         description: Module deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete(
	"/modules/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_MODULE.DELETE),
	moduleController.deleteModule,
);

// Lesson routes

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/lessons:
 *   post:
 *     summary: Create a lesson in a module
 *     description: Add a new lesson to a module (requires LMS_LESSON.ADD permission)
 *     tags: [LMS - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
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
 *               - title
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Introduction to Variables
 *               description:
 *                 type: string
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *               contentType:
 *                 type: string
 *                 enum: [VIDEO_RECORDED, VIDEO_LIVE, VIDEO_SCHEDULED, QUIZ, ASSIGNMENT, TEST, READING_MATERIAL, DISCUSSION]
 *                 default: VIDEO_RECORDED
 *               content:
 *                 type: string
 *                 description: Rich text for READING_MATERIAL
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: []
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/modules/:moduleId/lessons",
	validateId(z.object({ moduleId: z.cuid({ message: "Invalid moduleId" }) })),
	// Ensure authentication runs before body validation so unauthenticated requests return 401
	authenticate,
	authorize(PERMISSIONS.LMS_LESSON.ADD),
	// Merge moduleId from params into body before validating
	(req, _res, next) => {
		req.body = { ...(req.body || {}), moduleId: req.params.moduleId };
		next();
	},
	validate(createLMSLessonSchema),
	lessonController.createLesson,
);

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/lessons:
 *   get:
 *     summary: Get all lessons in a module
 *     description: Retrieve all lessons with unlock status for authenticated user
 *     tags: [LMS - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/modules/:moduleId/lessons",
	validateId(z.object({ moduleId: z.cuid({ message: "Invalid moduleId" }) })),
	authenticate,
	lessonController.getLessons,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}/upload-video:
 *   post:
 *     summary: Upload video for a lesson
 *     description: Upload or update video content for a lesson (requires LMS_LESSON.CHANGE permission)
 *     tags: [LMS - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/lessons/:id/upload-video",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_LESSON.CHANGE),
	lessonController.uploadLessonVideo,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}/thumbnail/select:
 *   post:
 *     summary: Select thumbnail for lesson
 *     description: Set thumbnail image for a lesson (requires LMS_LESSON.CHANGE permission)
 *     tags: [LMS - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnailUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thumbnail selected successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/lessons/:id/thumbnail/select",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_LESSON.CHANGE),
	lessonController.selectLessonThumbnail,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}:
 *   patch:
 *     summary: Update a lesson
 *     description: Update lesson details (requires LMS_LESSON.CHANGE permission)
 *     tags: [LMS - Lessons]
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
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *               contentType:
 *                 type: string
 *                 enum: [VIDEO_RECORDED, VIDEO_LIVE, VIDEO_SCHEDULED, QUIZ, ASSIGNMENT, TEST, READING_MATERIAL, DISCUSSION]
 *               content:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/lessons/:id",
	validateId(ZCuid),
	validate(updateLMSLessonSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_LESSON.CHANGE),
	lessonController.updateLesson,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Delete a lesson from a module (requires LMS_LESSON.DELETE permission)
 *     tags: [LMS - Lessons]
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
 *         description: Lesson deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_LESSON.DELETE),
	lessonController.deleteLesson,
);

// Quiz routes

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/quizzes:
 *   post:
 *     summary: Create a quiz in a module
 *     description: Add a new quiz to a module (requires LMS_QUIZ.ADD permission)
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
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
 *               - title
 *               - orderIndex
 *               - passingScore
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *               passingScore:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 70
 *               timeLimit:
 *                 type: integer
 *                 minimum: 1
 *                 description: Time limit in seconds
 *                 example: 3600
 *               maxAttempts:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               shuffleQuestions:
 *                 type: boolean
 *                 default: false
 *               questions:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - questionType
 *                     - correctAnswer
 *                   properties:
 *                     question:
 *                       type: string
 *                       minLength: 10
 *                     questionType:
 *                       type: string
 *                       enum: [MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER]
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *                     points:
 *                       type: integer
 *                       minimum: 1
 *                       default: 1
 *                     explanation:
 *                       type: string
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/modules/:moduleId/quizzes",
	validateId(z.object({ moduleId: z.cuid({ message: "Invalid moduleId" }) })),
	validate(createLMSQuizSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.ADD),
	quizController.createQuiz,
);

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/quizzes/complete:
 *   post:
 *     summary: Create quiz with questions and options
 *     description: Create a complete quiz with all questions and options in one request (requires LMS_QUIZ.ADD permission)
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - orderIndex
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Introduction to JavaScript Quiz
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Test your knowledge of JavaScript basics
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *               passingScore:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 70
 *                 example: 70
 *               timeLimit:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *                 description: Time limit in minutes
 *               maxAttempts:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               shuffleQuestions:
 *                 type: boolean
 *                 default: false
 *               showResults:
 *                 type: boolean
 *                 default: true
 *               questions:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 100
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - type
 *                     - orderIndex
 *                   properties:
 *                     question:
 *                       type: string
 *                       minLength: 10
 *                       maxLength: 5000
 *                       example: What is the correct syntax for a JavaScript function?
 *                     type:
 *                       type: string
 *                       enum: [MCQ_SINGLE, MCQ_MULTIPLE, TRUE_FALSE, SHORT, LONG]
 *                       default: MCQ_SINGLE
 *                     orderIndex:
 *                       type: integer
 *                       minimum: 0
 *                     points:
 *                       type: integer
 *                       minimum: 1
 *                       default: 1
 *                     explanation:
 *                       type: string
 *                       maxLength: 2000
 *                     options:
 *                       type: array
 *                       minItems: 2
 *                       maxItems: 10
 *                       items:
 *                         type: object
 *                         required:
 *                           - text
 *                           - isCorrect
 *                           - orderIndex
 *                         properties:
 *                           text:
 *                             type: string
 *                             minLength: 1
 *                             maxLength: 500
 *                           isCorrect:
 *                             type: boolean
 *                           orderIndex:
 *                             type: integer
 *                             minimum: 0
 *                             maximum: 25
 *     responses:
 *       201:
 *         description: Quiz with questions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// Note: createQuizWithQuestions is currently commented out in controller
// Use createQuiz + addQuizQuestion instead
// router.post(
// 	"/modules/:moduleId/quizzes/complete",
// 	authenticate,
// 	authorize(PERMISSIONS.CONTENT.ADD),
// 	quizController.createQuizWithQuestions,
// );

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/questions:
 *   post:
 *     summary: Add question to existing quiz
 *     description: Add a new question with options to an existing quiz (requires LMS_QUIZ.ADD permission)
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - type
 *               - orderIndex
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 10
 *               type:
 *                 type: string
 *                 enum: [MCQ_SINGLE, MCQ_MULTIPLE, TRUE_FALSE, SHORT, LONG]
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *               points:
 *                 type: integer
 *                 default: 1
 *               explanation:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *                     orderIndex:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Question added successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/quizzes/:quizId/questions",
	validateId(z.object({ quizId: z.cuid({ message: "Invalid quizId" }) })),
	validate(addQuizQuestionSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.ADD),
	quizController.addQuizQuestion,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/questions/{questionId}:
 *   patch:
 *     summary: Update question in quiz
 *     description: Update an existing question in a quiz (requires LMS_QUIZ.CHANGE permission)
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *               type:
 *                 type: string
 *                 enum: [MCQ_SINGLE, MCQ_MULTIPLE, TRUE_FALSE, SHORT, LONG]
 *               orderIndex:
 *                 type: integer
 *                 minimum: 0
 *               points:
 *                 type: integer
 *                 minimum: 1
 *               explanation:
 *                 type: string
 *                 maxLength: 2000
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *                     orderIndex:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Quiz or question not found
 */
router.patch(
	"/quizzes/:quizId/questions/:questionId",
	validateId(
		z.object({
			quizId: z.cuid({ message: "Invalid quizId" }),
			questionId: z.cuid({ message: "Invalid questionId" }),
		}),
	),
	validate(updateQuizQuestionSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.CHANGE),
	quizController.updateQuizQuestion,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/questions/{questionId}:
 *   delete:
 *     summary: Delete question from quiz
 *     description: Delete a question from a quiz (requires LMS_QUIZ.DELETE permission)
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Quiz or question not found
 */
router.delete(
	"/quizzes/:quizId/questions/:questionId",
	validateId(
		z.object({
			quizId: z.cuid({ message: "Invalid quizId" }),
			questionId: z.cuid({ message: "Invalid questionId" }),
		}),
	),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.DELETE),
	quizController.deleteQuizQuestion,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{id}:
 *   get:
 *     summary: Get a quiz
 *     description: Retrieve quiz details (requires LMS_QUIZ.VIEW permission)
 *     tags: [LMS - Quizzes]
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
 *         description: Quiz retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/quizzes/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.VIEW),
	quizController.getQuiz,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{id}:
 *   patch:
 *     summary: Update a quiz
 *     description: Update quiz details (requires LMS_QUIZ.CHANGE permission)
 *     tags: [LMS - Quizzes]
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
 *         description: Quiz updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/quizzes/:id",
	validateId(ZCuid),
	validate(updateLMSQuizSchema),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.CHANGE),
	quizController.updateQuiz,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/attempts:
 *   post:
 *     summary: Submit quiz attempt
 *     description: Submit answers for a quiz attempt (requires active enrollment)
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enrollmentId
 *               - answers
 *               - timeSpent
 *             properties:
 *               enrollmentId:
 *                 type: string
 *                 format: cuid
 *                 example: clxyz123abc
 *               answers:
 *                 type: array
 *                 description: Array of answers for quiz questions
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       format: cuid
 *                       example: clq1abc123
 *                     selectedOptionId:
 *                       type: string
 *                       format: cuid
 *                       description: For MCQ types (required for MCQ_SINGLE, MCQ_MULTIPLE, TRUE_FALSE)
 *                       example: clopt123xyz
 *                     textAnswer:
 *                       type: string
 *                       maxLength: 5000
 *                       description: For SHORT/LONG answer types
 *                       example: This is my answer
 *               timeSpent:
 *                 type: integer
 *                 minimum: 0
 *                 description: Time spent in seconds
 *                 example: 1800
 *     responses:
 *       201:
 *         description: Quiz attempt submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Quiz attempt submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     quizId:
 *                       type: string
 *                       format: cuid
 *                     enrollmentId:
 *                       type: string
 *                       format: cuid
 *                     score:
 *                       type: number
 *                       description: Score percentage
 *                       example: 85.5
 *                     isPassed:
 *                       type: boolean
 *                       example: true
 *                     timeSpent:
 *                       type: integer
 *                       example: 1800
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request or max attempts exceeded
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/quizzes/:quizId/attempts",
	validateId(z.object({ quizId: z.cuid({ message: "Invalid quizId" }) })),
	validate(submitQuizAttemptSchema),
	authenticate,
	quizController.submitQuizAttempt,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/attempts:
 *   get:
 *     summary: Get quiz attempts
 *     description: Retrieve all attempts for a quiz by the authenticated user
 *     tags: [LMS - Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Quiz attempts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Quiz attempts retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: cuid
 *                       quizId:
 *                         type: string
 *                         format: cuid
 *                       score:
 *                         type: number
 *                         example: 75.5
 *                       isPassed:
 *                         type: boolean
 *                         example: true
 *                       timeSpent:
 *                         type: integer
 *                         example: 1200
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                       attemptNumber:
 *                         type: integer
 *                         example: 2
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/quizzes/:quizId/attempts",
	validateId(z.object({ quizId: z.cuid({ message: "Invalid quizId" }) })),
	validateQuery(ZQueryParams),
	authenticate,
	quizController.getQuizAttempts,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     description: Delete a quiz from a module (requires LMS_QUIZ.DELETE permission)
 *     tags: [LMS - Quizzes]
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
 *         description: Quiz deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete(
	"/quizzes/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.LMS_QUIZ.DELETE),
	quizController.deleteQuiz,
);

// Progress routes

/**
 * @swagger
 * /api/v1/lms/progress/{enrollmentId}/lessons/{lessonId}:
 *   patch:
 *     summary: Update lesson progress
 *     description: Mark a lesson as completed or update watch time (requires active enrollment)
 *     tags: [LMS - Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               watchTimeSeconds:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total watch time in seconds
 *                 example: 300
 *               lastPosition:
 *                 type: integer
 *                 minimum: 0
 *                 description: Last playback position in seconds
 *                 example: 295
 *               completionPercent:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 85
 *               isCompleted:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Progress updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     lessonId:
 *                       type: string
 *                       format: cuid
 *                     enrollmentId:
 *                       type: string
 *                       format: cuid
 *                     watchTimeSeconds:
 *                       type: integer
 *                     lastPosition:
 *                       type: integer
 *                     completionPercent:
 *                       type: integer
 *                     isCompleted:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/progress/:enrollmentId/lessons/:lessonId",
	validateId(
		z.object({
			enrollmentId: z.cuid({ message: "Invalid enrollmentId" }),
			lessonId: z.cuid({ message: "Invalid lessonId" }),
		}),
	),
	validate(updateLMSProgressSchema),
	authenticate,
	progressController.updateProgress,
);

/**
 * @swagger
 * /api/v1/lms/progress/{enrollmentId}:
 *   get:
 *     summary: Get enrollment progress
 *     description: Retrieve overall progress for an enrollment (requires LMS_PROGRESS.VIEW_OWN permission)
 *     tags: [LMS - Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Progress retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     enrollmentId:
 *                       type: string
 *                       format: cuid
 *                     overallProgress:
 *                       type: number
 *                       description: Overall completion percentage
 *                       example: 45.5
 *                     completedLessons:
 *                       type: integer
 *                       example: 5
 *                     totalLessons:
 *                       type: integer
 *                       example: 11
 *                     totalWatchTime:
 *                       type: integer
 *                       description: Total watch time in seconds
 *                       example: 3600
 *                     modules:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           moduleId:
 *                             type: string
 *                           title:
 *                             type: string
 *                           progress:
 *                             type: number
 *                           lessons:
 *                             type: array
 *                             items:
 *                               type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/progress/:enrollmentId",
	validateId(
		z.object({ enrollmentId: z.cuid({ message: "Invalid enrollmentId" }) }),
	),
	authenticate,
	progressController.getEnrollmentProgress,
);

/**
 * @swagger
 * /api/v1/lms/progress/{enrollmentId}/lessons/{lessonId}:
 *   get:
 *     summary: Get lesson progress
 *     description: Retrieve progress details for a specific lesson (requires LMS_PROGRESS.VIEW_OWN permission)
 *     tags: [LMS - Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Lesson progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lesson progress retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     lessonId:
 *                       type: string
 *                       format: cuid
 *                     enrollmentId:
 *                       type: string
 *                       format: cuid
 *                     watchTimeSeconds:
 *                       type: integer
 *                       example: 450
 *                     lastPosition:
 *                       type: integer
 *                       example: 445
 *                     completionPercent:
 *                       type: integer
 *                       example: 95
 *                     isCompleted:
 *                       type: boolean
 *                       example: true
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/progress/:enrollmentId/lessons/:lessonId",
	validateId(
		z.object({
			enrollmentId: z.cuid({ message: "Invalid enrollmentId" }),
			lessonId: z.cuid({ message: "Invalid lessonId" }),
		}),
	),
	authenticate,
	progressController.getLessonProgress,
);

// Enrollment routes

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     description: Enroll the authenticated user in a course (requires authentication)
 *     tags: [LMS - Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully enrolled in course
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     studentId:
 *                       type: string
 *                       format: cuid
 *                     courseId:
 *                       type: string
 *                       format: cuid
 *                     enrolledAt:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [ACTIVE, COMPLETED, DROPPED]
 *       400:
 *         description: Already enrolled or course not available
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/courses/:courseId/enroll",
	validateId(z.object({ courseId: z.cuid({ message: "Invalid courseId" }) })),
	authenticate,
	enrollmentController.enrollInCourse,
);

/**
 * @swagger
 * /api/v1/lms/enrollments:
 *   get:
 *     summary: Get student enrollments
 *     description: Retrieve all enrollments for the authenticated student (requires LMS_ENROLLMENT.VIEW_OWN permission)
 *     tags: [LMS - Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Enrollments retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: cuid
 *                       courseId:
 *                         type: string
 *                         format: cuid
 *                       course:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 *                           level:
 *                             type: string
 *                       status:
 *                         type: string
 *                         enum: [ACTIVE, COMPLETED, DROPPED]
 *                       progress:
 *                         type: number
 *                         description: Completion percentage
 *                       enrolledAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/enrollments",
	validateQuery(ZQueryParams),
	authenticate,
	enrollmentController.getStudentEnrollments,
);

// ============= Review Routes (New Implementation) =============

/**
 * @swagger
 * /api/v1/lms/reviews:
 *   post:
 *     summary: Create a course review
 *     description: Submit a review for a course (requires active enrollment)
 *     tags: [LMS - Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - rating
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: cuid
 *                 example: clcourse123
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Rating from 1 to 5 stars
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Excellent course! Learned a lot.
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     courseId:
 *                       type: string
 *                       format: cuid
 *                     studentId:
 *                       type: string
 *                       format: cuid
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: Excellent course! Learned a lot.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Already reviewed or not enrolled
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/reviews",
	validate(createLMSReviewSchema),
	authenticate,
	reviewController.createReview,
);

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/reviews-list:
 *   get:
 *     summary: Get course reviews (with stats)
 *     description: Retrieve all reviews for a course with pagination and rating distribution
 *     tags: [LMS - Reviews]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully with stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reviews retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: cuid
 *                           rating:
 *                             type: integer
 *                             example: 5
 *                           comment:
 *                             type: string
 *                           student:
 *                             type: object
 *                             properties:
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   firstName:
 *                                     type: string
 *                                   lastName:
 *                                     type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     stats:
 *                       type: object
 *                       properties:
 *                         averageRating:
 *                           type: number
 *                           example: 4.5
 *                         totalReviews:
 *                           type: integer
 *                           example: 42
 *                         ratingDistribution:
 *                           type: object
 *                           properties:
 *                             "5":
 *                               type: integer
 *                               example: 25
 *                             "4":
 *                               type: integer
 *                               example: 10
 *                             "3":
 *                               type: integer
 *                               example: 5
 *                             "2":
 *                               type: integer
 *                               example: 1
 *                             "1":
 *                               type: integer
 *                               example: 1
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */
router.get(
	"/courses/:courseId/reviews-list",
	validateId(z.object({ courseId: z.cuid({ message: "Invalid courseId" }) })),
	validateQuery(ZQueryParams),
	reviewController.getCourseReviews,
);

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/my-review:
 *   get:
 *     summary: Get current user's review for a course
 *     description: Get the authenticated user's review for a specific course
 *     tags: [LMS - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review retrieved successfully
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Review not found
 */
router.get(
	"/courses/:courseId/my-review",
	validateId(z.object({ courseId: z.cuid({ message: "Invalid courseId" }) })),
	authenticate,
	reviewController.getMyReview,
);

/**
 * @swagger
 * /api/v1/lms/reviews/{id}:
 *   get:
 *     summary: Get a single review
 *     description: Get detailed information about a specific review
 *     tags: [LMS - Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     courseId:
 *                       type: string
 *                       format: cuid
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                     student:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         user:
 *                           type: object
 *                           properties:
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Review not found
 */
router.get("/reviews/:id", validateId(ZCuid), reviewController.getReviewById);

/**
 * @swagger
 * /api/v1/lms/reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     description: Update your own course review (requires ownership)
 *     tags: [LMS - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Updated review comment
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     rating:
 *                       type: integer
 *                     comment:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 */
router.patch(
	"/reviews/:id",
	validateId(ZCuid),
	validate(updateLMSReviewSchema),
	authenticate,
	reviewController.updateReview,
);

/**
 * @swagger
 * /api/v1/lms/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete your own course review (requires ownership)
 *     tags: [LMS - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Review not found
 */
router.delete(
	"/reviews/:id",
	validateId(ZCuid),
	authenticate,
	reviewController.deleteReview,
);

// ============= Discussion Routes =============

/**
 * @swagger
 * /api/v1/lms/discussions:
 *   post:
 *     summary: Create a discussion post or reply
 *     description: Post a new discussion or reply to an existing one in a lesson (requires active enrollment)
 *     tags: [LMS - Discussions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *               - content
 *             properties:
 *               lessonId:
 *                 type: string
 *                 format: cuid
 *                 example: cllesson123
 *                 description: Lesson ID where the discussion is posted
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *                 example: This is a great explanation! I have a question about...
 *               parentId:
 *                 type: string
 *                 format: cuid
 *                 description: Optional - ID of parent discussion for replies
 *                 example: cldisc456
 *     responses:
 *       201:
 *         description: Discussion posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Discussion created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     lessonId:
 *                       type: string
 *                       format: cuid
 *                     studentId:
 *                       type: string
 *                       format: cuid
 *                     content:
 *                       type: string
 *                     parentId:
 *                       type: string
 *                       format: cuid
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request or not enrolled
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/discussions",
	validate(createLMSDiscussionSchema),
	authenticate,
	discussionController.createDiscussion,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{lessonId}/discussions:
 *   get:
 *     summary: Get discussions for a lesson
 *     description: Retrieve all top-level discussions with nested replies for a lesson
 *     tags: [LMS - Discussions]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Discussions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Discussions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: cuid
 *                       content:
 *                         type: string
 *                       student:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                       replies:
 *                         type: array
 *                         description: Nested replies
 *                         items:
 *                           type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get(
	"/lessons/:lessonId/discussions",
	validateId(z.object({ lessonId: z.cuid({ message: "Invalid lessonId" }) })),
	validateQuery(ZQueryParams),
	discussionController.getLessonDiscussions,
);

/**
 * @swagger
 * /api/v1/lms/discussions/{id}:
 *   get:
 *     summary: Get a single discussion
 *     description: Get detailed information about a discussion with all replies
 *     tags: [LMS - Discussions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Discussion retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Discussion retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     lessonId:
 *                       type: string
 *                       format: cuid
 *                     content:
 *                       type: string
 *                     student:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         user:
 *                           type: object
 *                           properties:
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                     parentId:
 *                       type: string
 *                       format: cuid
 *                       nullable: true
 *                     replies:
 *                       type: array
 *                       items:
 *                         type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Discussion not found
 */
router.get(
	"/discussions/:id",
	validateId(ZCuid),
	discussionController.getDiscussionById,
);

/**
 * @swagger
 * /api/v1/lms/discussions/{id}:
 *   patch:
 *     summary: Update a discussion
 *     description: Update your own discussion post (requires ownership)
 *     tags: [LMS - Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *                 example: Updated discussion content
 *     responses:
 *       200:
 *         description: Discussion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Discussion updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     content:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to update this discussion
 *       404:
 *         description: Discussion not found
 */
router.patch(
	"/discussions/:id",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSDiscussionSchema),
	discussionController.updateDiscussion,
);

/**
 * @swagger
 * /api/v1/lms/discussions/{id}:
 *   delete:
 *     summary: Delete a discussion
 *     description: Delete your own discussion post (cascades to replies, requires ownership)
 *     tags: [LMS - Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Discussion deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Discussion deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to delete this discussion
 *       404:
 *         description: Discussion not found
 */
router.delete(
	"/discussions/:id",
	validateId(ZCuid),
	authenticate,
	discussionController.deleteDiscussion,
);

export default router;
