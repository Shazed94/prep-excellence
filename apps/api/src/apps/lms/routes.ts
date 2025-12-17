import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
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
 *     description: Create a new LMS course (requires authentication and COURSE.ADD permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.COURSE.ADD),
	courseController.createCourse,
);

/**
 * @swagger
 * /api/v1/lms/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a paginated list of courses with optional filtering and search
 *     tags: [LMS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 * /api/v1/lms/courses/{id}:
 *   get:
 *     summary: Get a single course
 *     description: Retrieve detailed information about a specific course
 *     tags: [LMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/courses/:id", courseController.getCourse);

/**
 * @swagger
 * /api/v1/lms/courses/{id}:
 *   patch:
 *     summary: Update a course
 *     description: Update course details (requires authentication and COURSE.CHANGE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.COURSE.CHANGE),
	courseController.updateCourse,
);

/**
 * @swagger
 * /api/v1/lms/courses/{id}/publish:
 *   patch:
 *     summary: Publish a course
 *     description: Publish or unpublish a course (requires COURSE.PUBLISH permission)
 *     tags: [LMS]
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
	authorize(PERMISSIONS.COURSE.PUBLISH),
	courseController.publishCourse,
);

/**
 * @swagger
 * /api/v1/lms/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete a course (requires COURSE.DELETE permission)
 *     tags: [LMS]
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
	authorize(PERMISSIONS.COURSE.DELETE),
	courseController.deleteCourse,
);

// Module routes

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/modules:
 *   post:
 *     summary: Create a module in a course
 *     description: Add a new module to a course (requires COURSE.MANAGE_CONTENT permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.COURSE.MANAGE_CONTENT),
	moduleController.createModule,
);

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/modules:
 *   get:
 *     summary: Get all modules in a course
 *     description: Retrieve all modules for a specific course
 *     tags: [LMS]
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
router.get("/courses/:courseId/modules", moduleController.getModules);

/**
 * @swagger
 * /api/v1/lms/modules/{id}:
 *   patch:
 *     summary: Update a module
 *     description: Update module details (requires COURSE.MANAGE_CONTENT permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.COURSE.MANAGE_CONTENT),
	moduleController.updateModule,
);

/**
 * @swagger
 * /api/v1/lms/modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     description: Delete a module from a course (requires COURSE.MANAGE_CONTENT permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.COURSE.MANAGE_CONTENT),
	moduleController.deleteModule,
);

// Lesson routes

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/lessons:
 *   post:
 *     summary: Create a lesson in a module
 *     description: Add a new lesson to a module (requires CONTENT.ADD permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	lessonController.createLesson,
);

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/lessons:
 *   get:
 *     summary: Get all lessons in a module
 *     description: Retrieve all lessons with unlock status for authenticated user
 *     tags: [LMS]
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
	authenticate,
	lessonController.getLessons,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}/upload-video:
 *   post:
 *     summary: Upload video for a lesson
 *     description: Upload or update video content for a lesson (requires CONTENT.CHANGE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	lessonController.uploadLessonVideo,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}/thumbnail/select:
 *   post:
 *     summary: Select thumbnail for lesson
 *     description: Set thumbnail image for a lesson (requires CONTENT.CHANGE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	lessonController.selectLessonThumbnail,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}:
 *   patch:
 *     summary: Update a lesson
 *     description: Update lesson details (requires CONTENT.CHANGE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	lessonController.updateLesson,
);

/**
 * @swagger
 * /api/v1/lms/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Delete a lesson from a module (requires CONTENT.DELETE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.DELETE),
	lessonController.deleteLesson,
);

// Quiz routes

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/quizzes:
 *   post:
 *     summary: Create a quiz in a module
 *     description: Add a new quiz to a module (requires CONTENT.ADD permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	quizController.createQuiz,
);

/**
 * @swagger
 * /api/v1/lms/modules/{moduleId}/quizzes/complete:
 *   post:
 *     summary: Create quiz with questions and options
 *     description: Create a complete quiz with all questions and options in one request (requires CONTENT.ADD permission)
 *     tags: [LMS]
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
router.post(
	"/modules/:moduleId/quizzes/complete",
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	quizController.createQuizWithQuestions,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/questions:
 *   post:
 *     summary: Add question to existing quiz
 *     description: Add a new question with options to an existing quiz (requires CONTENT.ADD permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.ADD),
	quizController.addQuizQuestion,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{id}:
 *   get:
 *     summary: Get a quiz
 *     description: Retrieve quiz details (requires enrollment)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.VIEW_ENROLLED),
	quizController.getQuiz,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{id}:
 *   patch:
 *     summary: Update a quiz
 *     description: Update quiz details (requires CONTENT.CHANGE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.CHANGE),
	quizController.updateQuiz,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/attempts:
 *   post:
 *     summary: Submit quiz attempt
 *     description: Submit answers for a quiz attempt
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
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
 *               - enrollmentId
 *               - answers
 *               - timeSpent
 *             properties:
 *               enrollmentId:
 *                 type: string
 *                 format: cuid
 *               answers:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 description: Object mapping questionId to answer
 *                 example: {"question1": "answer1", "question2": "answer2"}
 *               timeSpent:
 *                 type: integer
 *                 minimum: 0
 *                 description: Time spent in seconds
 *                 example: 1800
 *     responses:
 *       201:
 *         description: Quiz attempt submitted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/quizzes/:quizId/attempts",
	authenticate,
	quizController.submitQuizAttempt,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{quizId}/attempts:
 *   get:
 *     summary: Get quiz attempts
 *     description: Retrieve all attempts for a quiz by the authenticated user
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz attempts retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/quizzes/:quizId/attempts",
	authenticate,
	quizController.getQuizAttempts,
);

/**
 * @swagger
 * /api/v1/lms/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     description: Delete a quiz from a module (requires CONTENT.DELETE permission)
 *     tags: [LMS]
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
	authenticate,
	authorize(PERMISSIONS.CONTENT.DELETE),
	quizController.deleteQuiz,
);

// Progress routes

/**
 * @swagger
 * /api/v1/lms/progress/{enrollmentId}/lessons/{lessonId}:
 *   patch:
 *     summary: Update lesson progress
 *     description: Mark a lesson as completed or update watch time
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
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
 *               lastPosition:
 *                 type: integer
 *                 minimum: 0
 *                 description: Last playback position in seconds
 *               completionPercent:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/progress/:enrollmentId/lessons/:lessonId",
	authenticate,
	progressController.updateProgress,
);

/**
 * @swagger
 * /api/v1/lms/progress/{enrollmentId}:
 *   get:
 *     summary: Get enrollment progress
 *     description: Retrieve overall progress for an enrollment
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/progress/:enrollmentId",
	authenticate,
	progressController.getEnrollmentProgress,
);

/**
 * @swagger
 * /api/v1/lms/progress/{enrollmentId}/lessons/{lessonId}:
 *   get:
 *     summary: Get lesson progress
 *     description: Retrieve progress details for a specific lesson
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson progress retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/progress/:enrollmentId/lessons/:lessonId",
	authenticate,
	progressController.getLessonProgress,
);

// Enrollment routes

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     description: Enroll the authenticated user in a course
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/courses/:courseId/enroll",
	authenticate,
	enrollmentController.enrollInCourse,
);

/**
 * @swagger
 * /api/v1/lms/enrollments:
 *   get:
 *     summary: Get student enrollments
 *     description: Retrieve all enrollments for the authenticated student
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollments retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/enrollments",
	authenticate,
	enrollmentController.getStudentEnrollments,
);

// Discussion routes

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/discussions:
 *   post:
 *     summary: Create a discussion
 *     description: Start a new discussion in a course
 *     tags: [LMS]
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
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Discussion created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/courses/:courseId/discussions",
	authenticate,
	enrollmentController.createDiscussion,
);

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/discussions:
 *   get:
 *     summary: Get course discussions
 *     description: Retrieve all discussions for a course (enrolled students only)
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discussions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/courses/:courseId/discussions",
	authenticate,
	enrollmentController.getCourseDiscussions,
);

// Review routes

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/reviews:
 *   post:
 *     summary: Create a course review
 *     description: Submit a review for a course (enrolled students only)
 *     tags: [LMS]
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
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/courses/:courseId/reviews",
	authenticate,
	enrollmentController.createReview,
);

/**
 * @swagger
 * /api/v1/lms/courses/{courseId}/reviews:
 *   get:
 *     summary: Get course reviews
 *     description: Retrieve all reviews for a course
 *     tags: [LMS]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get("/courses/:courseId/reviews", enrollmentController.getCourseReviews);

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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/reviews", authenticate, reviewController.createReview);

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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully with stats
 */
router.get(
	"/courses/:courseId/reviews-list",
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
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 */
router.get(
	"/courses/:courseId/my-review",
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
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 */
router.get("/reviews/:id", reviewController.getReviewById);

/**
 * @swagger
 * /api/v1/lms/reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     description: Update your own course review
 *     tags: [LMS - Reviews]
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.patch("/reviews/:id", authenticate, reviewController.updateReview);

/**
 * @swagger
 * /api/v1/lms/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete your own course review
 *     tags: [LMS - Reviews]
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
 *         description: Review deleted successfully
 */
router.delete("/reviews/:id", authenticate, reviewController.deleteReview);

// ============= Discussion Routes =============

/**
 * @swagger
 * /api/v1/lms/discussions:
 *   post:
 *     summary: Create a discussion post or reply
 *     description: Post a new discussion or reply to an existing one in a lesson
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
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *               parentId:
 *                 type: string
 *                 format: cuid
 *                 description: Optional - ID of parent discussion for replies
 *     responses:
 *       201:
 *         description: Discussion posted successfully
 */
router.post(
	"/discussions",
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Discussions retrieved successfully
 */
router.get(
	"/lessons/:lessonId/discussions",
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
 *     responses:
 *       200:
 *         description: Discussion retrieved successfully
 */
router.get("/discussions/:id", discussionController.getDiscussionById);

/**
 * @swagger
 * /api/v1/lms/discussions/{id}:
 *   patch:
 *     summary: Update a discussion
 *     description: Update your own discussion post
 *     tags: [LMS - Discussions]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *     responses:
 *       200:
 *         description: Discussion updated successfully
 */
router.patch(
	"/discussions/:id",
	authenticate,
	discussionController.updateDiscussion,
);

/**
 * @swagger
 * /api/v1/lms/discussions/{id}:
 *   delete:
 *     summary: Delete a discussion
 *     description: Delete your own discussion post (cascades to replies)
 *     tags: [LMS - Discussions]
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
 *         description: Discussion deleted successfully
 */
router.delete(
	"/discussions/:id",
	authenticate,
	discussionController.deleteDiscussion,
);

export default router;
