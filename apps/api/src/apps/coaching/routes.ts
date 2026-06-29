/**
 * @fileoverview Coaching (Private Classes) API Routes
 *
 * This file contains all route definitions for the Coaching module with comprehensive
 * Swagger/OpenAPI documentation for each endpoint.
 *
 * @module coaching/routes
 */

import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { uploadCourseMedia } from "@/middleware/upload";
import * as categoryController from "./category.controller";
import * as contentController from "./content.controller";
import * as courseController from "./course.controller";
import * as enrollmentController from "./enrollment.controller";
import * as moduleController from "./module.controller";
import * as topicController from "./topic.controller";

const router = Router();

// ============================================
// COURSE ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/courses:
 *   post:
 *     summary: Create a coaching course
 *     description: Create a new coaching course (requires COACHING_COURSE.ADD permission)
 *     tags: [Coaching - Courses]
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
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: SAT Prep Coaching
 *               description:
 *                 type: string
 *                 example: Comprehensive SAT preparation with live classes
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 199.99
 *               maxStudents:
 *                 type: integer
 *                 minimum: 1
 *                 example: 20
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/courses",
	authenticate,
	// authorize(PERMISSIONS.COACHING_COURSE.ADD),
	uploadCourseMedia,
	courseController.createCourse,
);

/**
 * @swagger
 * /api/v1/coaching/courses:
 *   get:
 *     summary: Get all coaching courses
 *     description: Retrieve a list of all coaching courses (public access)
 *     tags: [Coaching - Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 */
router.get("/courses", courseController.getCourses);

/**
 * @swagger
 * /api/v1/coaching/courses/published:
 *   get:
 *     summary: Get all published coaching courses
 *     description: Retrieve a list of all published coaching courses (public access)
 *     tags: [Coaching - Courses]
 *     responses:
 *       200:
 *         description: Published courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/courses/published", courseController.getPublishedCourses);

/**
 * @swagger
 * /api/v1/coaching/courses/popular:
 *   get:
 *     summary: Get popular coaching courses
 *     description: Retrieve a list of popular coaching courses based on enrollment and ratings (public access)
 *     tags: [Coaching - Courses]
 *     responses:
 *       200:
 *         description: Popular courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *
 */
router.get("/courses/popular", courseController.getPopularCourses);

/**
 * @swagger
 * /api/v1/coaching/courses/{id}:
 *   get:
 *     summary: Get a coaching course by ID
 *     description: Retrieve detailed information about a specific coaching course
 *     tags: [Coaching - Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/courses/:id", courseController.getCourse);

/**
 * @swagger
 * /api/v1/coaching/courses/{id}:
 *   patch:
 *     summary: Update a coaching course
 *     description: Update course details (requires COACHING_COURSE.CHANGE permission)
 *     tags: [Coaching - Courses]
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
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               maxStudents:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
	"/courses/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_COURSE.CHANGE),
	uploadCourseMedia,
	courseController.updateCourse,
);

/**
 * @swagger
 * /api/v1/coaching/courses/{id}/publish:
 *   patch:
 *     summary: Publish/unpublish a coaching course
 *     description: Change the published status of a course (requires COACHING_COURSE.PUBLISH permission)
 *     tags: [Coaching - Courses]
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
 *               - isPublished
 *             properties:
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Course publish status updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.patch(
	"/courses/:id/publish",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_COURSE.PUBLISH),
	courseController.publishCourse,
);

/**
 * @swagger
 * /api/v1/coaching/courses/{id}:
 *   delete:
 *     summary: Delete a coaching course
 *     description: Delete a coaching course (requires COACHING_COURSE.DELETE permission)
 *     tags: [Coaching - Courses]
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
 *         description: Course deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/courses/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_COURSE.DELETE),
	courseController.deleteCourse,
);

/** @swagger
 * /api/v1/coaching/courses/my-courses:
 *   get:
 *     summary: Get courses the authenticated user is enrolled in
 *     description: Retrieve a list of courses the authenticated user is enrolled in (requires authentication)
 *     tags: [Coaching - Courses]
 *     security:
 *       - bearerAuth: []
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

router.get(
	"/my-courses",
	authenticate,
	courseController.getStudentEnrolledCourses,
);

// ============================================
// MODULE ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/courses/{courseId}/modules:
 *   post:
 *     summary: Create a module in a coaching course
 *     description: Add a new module to a coaching course (requires COACHING_MODULE.ADD permission)
 *     tags: [Coaching - Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *               - title
 *               - orderIndex
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Week 1 - Fundamentals
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
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/courses/:courseId/modules",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_MODULE.ADD),
	moduleController.createModule,
);

/**
 * @swagger
 * /api/v1/coaching/courses/{courseId}/modules:
 *   get:
 *     summary: Get all modules in a coaching course
 *     description: Retrieve all modules for a specific coaching course (public access)
 *     tags: [Coaching - Modules]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/courses/:courseId/modules", moduleController.getModules);

/**
 * @swagger
 * /api/v1/coaching/modules/{id}:
 *   get:
 *     summary: Get a single module
 *     description: Retrieve details of a specific module (public access)
 *     tags: [Coaching - Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Module retrieved successfully
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
 */
router.get("/modules/:id", moduleController.getModule);

/**
 * @swagger
 * /api/v1/coaching/modules/{id}:
 *   patch:
 *     summary: Update a module
 *     description: Update module details (requires COACHING_MODULE.CHANGE permission)
 *     tags: [Coaching - Modules]
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
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.patch(
	"/modules/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_MODULE.CHANGE),
	moduleController.updateModule,
);

/**
 * @swagger
 * /api/v1/coaching/modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     description: Delete a module from a coaching course (requires COACHING_MODULE.DELETE permission)
 *     tags: [Coaching - Modules]
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
 *         description: Module deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete(
	"/modules/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_MODULE.DELETE),
	moduleController.deleteModule,
);

// ============================================
// TOPIC ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/modules/{moduleId}/topics:
 *   post:
 *     summary: Create a topic in a module
 *     description: Add a new topic to a specific module (requires COACHING_TOPIC.ADD permission)
 *     tags: [Coaching - Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
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
 *               - title
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
 *       201:
 *         description: Topic created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/modules/:moduleId/topics",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_TOPIC.ADD),
	topicController.createModuleTopic,
);

/**
 * @swagger
 * /api/v1/coaching/topics/{id}:
 *   put:
 *     summary: Update a module topic
 *     description: Update an existing topic in a module (requires COACHING_TOPIC.CHANGE permission)
 *     tags: [Coaching - Topics]
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
 *         description: Topic updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put(
	"/topics/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_TOPIC.CHANGE),
	topicController.updateModuleTopic,
);

/**
 * @swagger
 * /api/v1/coaching/topics/{id}:
 *   delete:
 *     summary: Delete a module topic
 *     description: Delete a topic from a module (requires COACHING_TOPIC.DELETE permission)
 *     tags: [Coaching - Topics]
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
 *         description: Topic deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete(
	"/topics/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_TOPIC.DELETE),
	topicController.deleteModuleTopic,
);

/**
 * @swagger
 * /api/v1/coaching/topics/{id}:
 *   get:
 *     summary: Get a single module topic
 *     description: Retrieve details of a specific topic in a module
 *     tags: [Coaching - Topics]
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
 *         description: Topic retrieved successfully
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/topics/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_TOPIC.VIEW),
	topicController.getModuleTopic,
);

/**
 * @swagger
 * /api/v1/coaching/modules/{moduleId}/topics:
 *   get:
 *     summary: Get all topics in a module
 *     description: Retrieve all topics for a specific module
 *     tags: [Coaching - Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Topics retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/modules/:moduleId/topics",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_TOPIC.VIEW),
	topicController.getModuleTopics,
);

// ============================================
// CONTENT ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/topics/{topicId}/contents:
 *   post:
 *     summary: Create content in a topic
 *     description: Add new content (lesson/session) to a topic (requires COACHING_CONTENT.ADD permission)
 *     tags: [Coaching - Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
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
 *               - title
 *               - contentType
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Introduction Session
 *               description:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [VIDEO, LIVE, ASSIGNMENT, READING]
 *                 example: LIVE
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3600
 *     responses:
 *       201:
 *         description: Content created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/topics/:topicId/contents",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.ADD),
	contentController.createContent,
);

/**
 * @swagger
 * /api/v1/coaching/topics/{topicId}/contents:
 *   get:
 *     summary: Get all contents in a topic
 *     description: Retrieve all contents for a specific topic (requires COACHING_CONTENT.VIEW permission)
 *     tags: [Coaching - Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Contents retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/topics/:topicId/contents",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.VIEW),
	contentController.getContents,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{id}/upload-video:
 *   post:
 *     summary: Upload video for content
 *     description: Upload video file for content (requires COACHING_CONTENT.CHANGE permission)
 *     tags: [Coaching - Content]
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
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/contents/:id/upload-video",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.CHANGE),
	contentController.uploadContentVideo,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{id}/start-session:
 *   post:
 *     summary: Start a live session
 *     description: Start a live coaching session (requires COACHING_CONTENT.CHANGE permission)
 *     tags: [Coaching - Content]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meetingUrl:
 *                 type: string
 *                 format: url
 *                 example: https://zoom.us/j/123456789
 *     responses:
 *       200:
 *         description: Session started successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/contents/:id/start-session",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.CHANGE),
	contentController.startLiveSession,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{id}/end-session:
 *   post:
 *     summary: End a live session
 *     description: End an ongoing live coaching session (requires COACHING_CONTENT.CHANGE permission)
 *     tags: [Coaching - Content]
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
 *         description: Session ended successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/contents/:id/end-session",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.CHANGE),
	contentController.endLiveSession,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{id}:
 *   patch:
 *     summary: Update content
 *     description: Update content details (requires COACHING_CONTENT.CHANGE permission)
 *     tags: [Coaching - Content]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.patch(
	"/contents/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.CHANGE),
	contentController.updateContent,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{id}:
 *   delete:
 *     summary: Delete content
 *     description: Delete content from a topic (requires COACHING_CONTENT.DELETE permission)
 *     tags: [Coaching - Content]
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
 *         description: Content deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete(
	"/contents/:id",
	authenticate,
	//   authorize(PERMISSIONS.COACHING_CONTENT.DELETE),
	contentController.deleteContent,
);

// ============================================
// ENROLLMENT ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/enrollments:
 *   get:
 *     summary: Get student enrollments
 *     description: Retrieve all coaching enrollments for authenticated student
 *     tags: [Coaching - Enrollment]
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/enrollments", authenticate, enrollmentController.getMyEnrollments);

// ============================================
// ASSIGNMENT SUBMISSION ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/contents/{contentId}/submissions:
 *   post:
 *     summary: Submit an assignment
 *     description: Submit assignment for coaching content (requires authentication and enrollment)
 *     tags: [Coaching - Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
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
 *               - submissionData
 *             properties:
 *               submissionData:
 *                 type: object
 *                 description: Assignment submission content
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *     responses:
 *       201:
 *         description: Assignment submitted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/contents/:contentId/submissions",
	authenticate,
	enrollmentController.submitAssignment,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{contentId}/submissions:
 *   get:
 *     summary: Get content submissions
 *     description: Retrieve all submissions for content (requires COACHING_SUBMISSION.VIEW permission)
 *     tags: [Coaching - Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Submissions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/contents/:contentId/submissions",
	authenticate,
	// authorize(PERMISSIONS.COACHING_SUBMISSION.VIEW),
	enrollmentController.getContentSubmissions,
);

/**
 * @swagger
 * /api/v1/coaching/submissions/{id}/grade:
 *   patch:
 *     summary: Grade a submission
 *     description: Grade student's assignment submission (requires COACHING_SUBMISSION.GRADE permission)
 *     tags: [Coaching - Submissions]
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
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 85
 *               feedback:
 *                 type: string
 *                 example: Good work! Needs improvement in section 3.
 *     responses:
 *       200:
 *         description: Submission graded successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.patch(
	"/submissions/:id/grade",
	authenticate,
	// authorize(PERMISSIONS.COACHING_SUBMISSION.GRADE),
	enrollmentController.gradeSubmission,
);

// ============================================
// ATTENDANCE ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/contents/{contentId}/attendance:
 *   post:
 *     summary: Record attendance
 *     description: Record student attendance for live session (requires authentication and enrollment)
 *     tags: [Coaching - Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
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
 *               joinTime:
 *                 type: string
 *                 format: date-time
 *               leaveTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/contents/:contentId/attendance",
	authenticate,
	enrollmentController.recordAttendance,
);

/**
 * @swagger
 * /api/v1/coaching/contents/{contentId}/attendance:
 *   get:
 *     summary: Get content attendance
 *     description: Retrieve attendance records for content (requires COACHING_ATTENDANCE.VIEW permission)
 *     tags: [Coaching - Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/contents/:contentId/attendance",
	authenticate,
	// authorize(PERMISSIONS.COACHING_ATTENDANCE.VIEW),
	enrollmentController.getContentAttendance,
);

// ============================================
// CATEGORY ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/coaching/categories:
 *   post:
 *     summary: Create a course category
 *     description: Create a new course category (requires CATEGORY.ADD permission)
 *     tags: [Coaching - Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               description:
 *                 type: string
 *                 example: Web development courses including frontend and backend
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Category with this name already exists
 */
router.post(
	"/categories",
	authenticate,
	// authorize(PERMISSIONS.CATEGORY.ADD),
	categoryController.createCategory,
);

/**
 * @swagger
 * /api/v1/coaching/categories:
 *   get:
 *     summary: Get all course categories
 *     description: Retrieve a list of all course categories (public access)
 *     tags: [Coaching - Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get("/categories", categoryController.getCategories);

/**
 * @swagger
 * /api/v1/coaching/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Retrieve a specific category (requires CATEGORY.VIEW permission)
 *     tags: [Coaching - Categories]
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
 *         description: Category retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/categories/:id",
	authenticate,
	// authorize(PERMISSIONS.CATEGORY.VIEW),
	categoryController.getCategory,
);

/**
 * @swagger
 * /api/v1/coaching/categories/{id}:
 *   patch:
 *     summary: Update a category
 *     description: Update a course category (requires CATEGORY.CHANGE permission)
 *     tags: [Coaching - Categories]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
	"/categories/:id",
	authenticate,
	// authorize(PERMISSIONS.CATEGORY.CHANGE),
	categoryController.updateCategory,
);

/**
 * @swagger
 * /api/v1/coaching/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a course category (requires CATEGORY.DELETE permission)
 *     tags: [Coaching - Categories]
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
 *         description: Category deleted successfully
 *       400:
 *         description: Cannot delete category with associated courses
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/categories/:id",
	authenticate,
	// authorize(PERMISSIONS.CATEGORY.DELETE),
	categoryController.deleteCategory,
);

export default router;
