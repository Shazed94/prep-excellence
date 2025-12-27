import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import {
	DifficultyController,
	DomainController,
	SkillController,
	SubjectController,
	TestTypeController,
} from "./question-metarial.controller";
import {
	QuestionBankController,
	SATPracticeController,
} from "./sat-practice.controller";
import { StudentAttemptController } from "./student-attempt.controller";
import { TeacherGradingController } from "./teacher-grading.controller";

const router = Router();

const testTypeController = new TestTypeController();
const subjectController = new SubjectController();
const difficultyController = new DifficultyController();
const domainController = new DomainController();
const skillController = new SkillController();
const questionBankController = new QuestionBankController();
const satPracticeController = new SATPracticeController();
const studentAttemptController = new StudentAttemptController();
const teacherGradingController = new TeacherGradingController();

//========================
// Test Type Routes
//========================

/**
 * @swagger
 * /api/v1/sat-practice/test-types:
 *   post:
 *     summary: Create a new test type
 *     description: Create a new SAT/ACT test type (requires SAT_PRACTICE_TEST_TYPE.ADD permission)
 *     tags: [SAT Practice - Test Types]
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
 *                 example: "SAT"
 *               description:
 *                 type: string
 *                 example: "Scholastic Assessment Test"
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Test type created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/test-types",
	authenticate,
	authorize(PERMISSIONS.TEST_TYPE.ADD),
	testTypeController.create,
);

/**
 * @swagger
 * /api/v1/sat-practice/test-types:
 *   get:
 *     summary: Get all test types
 *     description: Retrieve all test types with pagination
 *     tags: [SAT Practice - Test Types]
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
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *         description: Field to sort by
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Test types retrieved successfully
 */
router.get("/test-types", testTypeController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/test-types/{id}:
 *   get:
 *     summary: Get test type by ID
 *     description: Retrieve a specific test type
 *     tags: [SAT Practice - Test Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test type ID
 *     responses:
 *       200:
 *         description: Test type retrieved successfully
 *       404:
 *         description: Test type not found
 */
router.get("/test-types/:id", testTypeController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/test-types/{id}:
 *   put:
 *     summary: Update test type
 *     description: Update an existing test type (requires SAT_PRACTICE_TEST_TYPE.CHANGE permission)
 *     tags: [SAT Practice - Test Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test type ID
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
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Test type updated successfully
 *       404:
 *         description: Test type not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put(
	"/test-types/:id",
	authenticate,
	authorize(PERMISSIONS.TEST_TYPE.CHANGE),
	testTypeController.update,
);

/**
 * @swagger
 * /api/v1/sat-practice/test-types/{id}:
 *   delete:
 *     summary: Delete test type
 *     description: Delete a test type (requires SAT_PRACTICE_TEST_TYPE.DELETE permission)
 *     tags: [SAT Practice - Test Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test type ID
 *     responses:
 *       200:
 *         description: Test type deleted successfully
 *       404:
 *         description: Test type not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete(
	"/test-types/:id",
	authenticate,
	authorize(PERMISSIONS.TEST_TYPE.DELETE),
	testTypeController.delete,
);

router.get("/test-types/sat", testTypeController.getSatTests);

//========================
// Subject Routes
//========================

/**
 * @swagger
 * /api/v1/sat-practice/subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Create a new subject (e.g., Math, Reading, Writing) - requires SAT_PRACTICE_SUBJECT.ADD permission
 *     tags: [SAT Practice - Subjects]
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
 *                 example: "Mathematics"
 *               description:
 *                 type: string
 *                 example: "Math subject for SAT"
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
	"/subjects",
	authenticate,
	authorize(PERMISSIONS.SUBJECT.ADD),
	subjectController.create,
);

/**
 * @swagger
 * /api/v1/sat-practice/subjects:
 *   get:
 *     summary: Get all subjects
 *     description: Retrieve all subjects with pagination
 *     tags: [SAT Practice - Subjects]
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully
 */
router.get("/subjects", subjectController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     description: Retrieve a specific subject
 *     tags: [SAT Practice - Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject retrieved successfully
 *       404:
 *         description: Subject not found
 */
router.get("/subjects/:id", subjectController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/subjects/{id}:
 *   put:
 *     summary: Update subject
 *     description: Update an existing subject
 *     tags: [SAT Practice - Subjects]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       404:
 *         description: Subject not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put("/subjects/:id", subjectController.update);

/**
 * @swagger
 * /api/v1/sat-practice/subjects/{id}:
 *   delete:
 *     summary: Delete subject
 *     description: Delete a subject
 *     tags: [SAT Practice - Subjects]
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
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/subjects/:id", subjectController.delete);

//========================
// Difficulty Routes
//========================

/**
 * @swagger
 * /api/v1/sat-practice/difficulties:
 *   post:
 *     summary: Create a new difficulty level
 *     description: Create a new difficulty level (e.g., Easy, Medium, Hard)
 *     tags: [SAT Practice - Difficulties]
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
 *                 example: "Hard"
 *               description:
 *                 type: string
 *                 example: "Advanced difficulty level"
 *               order:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Difficulty created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/difficulties", difficultyController.create);

/**
 * @swagger
 * /api/v1/sat-practice/difficulties:
 *   get:
 *     summary: Get all difficulty levels
 *     description: Retrieve all difficulty levels with pagination
 *     tags: [SAT Practice - Difficulties]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *     responses:
 *       200:
 *         description: Difficulties retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/difficulties", difficultyController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/difficulties/{id}:
 *   get:
 *     summary: Get difficulty by ID
 *     description: Retrieve a specific difficulty level
 *     tags: [SAT Practice - Difficulties]
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
 *         description: Difficulty retrieved successfully
 *       404:
 *         description: Difficulty not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/difficulties/:id", difficultyController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/difficulties/{id}:
 *   put:
 *     summary: Update difficulty level
 *     description: Update an existing difficulty level
 *     tags: [SAT Practice - Difficulties]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Difficulty updated successfully
 *       404:
 *         description: Difficulty not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put("/difficulties/:id", difficultyController.update);

/**
 * @swagger
 * /api/v1/sat-practice/difficulties/{id}:
 *   delete:
 *     summary: Delete difficulty level
 *     description: Delete a difficulty level
 *     tags: [SAT Practice - Difficulties]
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
 *         description: Difficulty deleted successfully
 *       404:
 *         description: Difficulty not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/difficulties/:id", difficultyController.delete);

//========================
// Domain Routes
//========================

/**
 * @swagger
 * /api/v1/sat-practice/domains:
 *   post:
 *     summary: Create a new domain
 *     description: Create a new content domain (e.g., Algebra, Geometry, Reading Comprehension)
 *     tags: [SAT Practice - Domains]
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
 *                 example: "Algebra"
 *               description:
 *                 type: string
 *                 example: "Algebraic concepts and problem-solving"
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Domain created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/domains", domainController.create);

/**
 * @swagger
 * /api/v1/sat-practice/domains:
 *   get:
 *     summary: Get all domains
 *     description: Retrieve all content domains with pagination
 *     tags: [SAT Practice - Domains]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *     responses:
 *       200:
 *         description: Domains retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/domains", domainController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/domains/{id}:
 *   get:
 *     summary: Get domain by ID
 *     description: Retrieve a specific content domain
 *     tags: [SAT Practice - Domains]
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
 *         description: Domain retrieved successfully
 *       404:
 *         description: Domain not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/domains/:id", domainController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/domains/{id}:
 *   put:
 *     summary: Update domain
 *     description: Update an existing content domain
 *     tags: [SAT Practice - Domains]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Domain updated successfully
 *       404:
 *         description: Domain not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put("/domains/:id", domainController.update);

/**
 * @swagger
 * /api/v1/sat-practice/domains/{id}:
 *   delete:
 *     summary: Delete domain
 *     description: Delete a content domain
 *     tags: [SAT Practice - Domains]
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
 *         description: Domain deleted successfully
 *       404:
 *         description: Domain not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/domains/:id", domainController.delete);

//========================
// Skill Routes
//========================

/**
 * @swagger
 * /api/v1/sat-practice/skills:
 *   post:
 *     summary: Create a new skill
 *     description: Create a new skill (e.g., Problem Solving, Critical Reading, Data Analysis)
 *     tags: [SAT Practice - Skills]
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
 *                 example: "Critical Reading"
 *               description:
 *                 type: string
 *                 example: "Ability to analyze and interpret text"
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/skills", skillController.create);

/**
 * @swagger
 * /api/v1/sat-practice/skills:
 *   get:
 *     summary: Get all skills
 *     description: Retrieve all skills with pagination
 *     tags: [SAT Practice - Skills]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/skills", skillController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/skills/{id}:
 *   get:
 *     summary: Get skill by ID
 *     description: Retrieve a specific skill
 *     tags: [SAT Practice - Skills]
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
 *         description: Skill retrieved successfully
 *       404:
 *         description: Skill not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/skills/:id", skillController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/skills/{id}:
 *   put:
 *     summary: Update skill
 *     description: Update an existing skill
 *     tags: [SAT Practice - Skills]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       404:
 *         description: Skill not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put("/skills/:id", skillController.update);

/**
 * @swagger
 * /api/v1/sat-practice/skills/{id}:
 *   delete:
 *     summary: Delete skill
 *     description: Delete a skill
 *     tags: [SAT Practice - Skills]
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
 *         description: Skill deleted successfully
 *       404:
 *         description: Skill not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/skills/:id", skillController.delete);

//========================
// Question Bank Routes
//========================
router.post("/questions", questionBankController.createFromForm);
router.get("/questions", questionBankController.getAll);
router.get("/questions/:id", questionBankController.getById);
router.put("/questions/:id", questionBankController.updateFromForm);
router.delete("/questions/:id", questionBankController.delete);

//========================
// SAT Practice Test Routes
//========================
router.post("/tests", satPracticeController.upsert); // Create or update (auto-save)
router.get("/tests", satPracticeController.getAll);
// router.get("/tests/sat", TestTypeController.);
router.get("/tests/:id", satPracticeController.getById);
router.delete("/tests/:id", satPracticeController.delete);
router.post("/tests/:id/publish", satPracticeController.publish);

//========================
// Student Attempt Routes
//========================
/**
 * @swagger
 * /api/v1/sat-practice/attempts:
 *   post:
 *     summary: Start a new SAT practice attempt
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.post("/attempts", studentAttemptController.startAttempt);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/{attemptId}:
 *   get:
 *     summary: Get attempt details with all progress
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.get("/attempts/:attemptId", studentAttemptController.getAttempt);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/submit-mcq-answer:
 *   post:
 *     summary: Submit MCQ/Multiple Choice answer
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.post(
	"/attempts/submit-mcq-answer",
	studentAttemptController.submitMCQAnswer,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/submit-text-answer:
 *   post:
 *     summary: Submit text answer (FILL_IN_THE_BLANK, SHORT_ANSWER)
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.post(
	"/attempts/submit-text-answer",
	studentAttemptController.submitTextAnswer,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/complete-module:
 *   post:
 *     summary: Complete a module within a section
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.post(
	"/attempts/complete-module",
	studentAttemptController.completeModule,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/next-section:
 *   post:
 *     summary: Navigate to the next section
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.post(
	"/attempts/next-section",
	studentAttemptController.navigateToNextSection,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/submit:
 *   post:
 *     summary: Submit entire attempt
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 */
router.post("/attempts/submit", studentAttemptController.submitAttempt);

//========================
// Teacher Grading Routes
//========================
/**
 * @swagger
 * /api/v1/sat-practice/grading/pending:
 *   get:
 *     summary: Get all pending text answers that need grading
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.get("/grading/pending", teacherGradingController.getPendingAnswers);

/**
 * @swagger
 * /api/v1/sat-practice/grading/graded:
 *   get:
 *     summary: Get all graded answers for review
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.get("/grading/graded", teacherGradingController.getGradedAnswers);

/**
 * @swagger
 * /api/v1/sat-practice/grading/grade:
 *   post:
 *     summary: Grade a text answer
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.post("/grading/grade", teacherGradingController.gradeTextAnswer);

/**
 * @swagger
 * /api/v1/sat-practice/grading/grade/{answerId}:
 *   put:
 *     summary: Update an existing graded answer
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.put(
	"/grading/grade/:answerId",
	teacherGradingController.updateGradedAnswer,
);

/**
 * @swagger
 * /api/v1/sat-practice/grading/bulk-grade:
 *   post:
 *     summary: Bulk grade multiple answers
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.post("/grading/bulk-grade", teacherGradingController.bulkGradeAnswers);

/**
 * @swagger
 * /api/v1/sat-practice/grading/recalculate:
 *   post:
 *     summary: Recalculate score for an attempt
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.post("/grading/recalculate", teacherGradingController.recalculateScore);

/**
 * @swagger
 * /api/v1/sat-practice/grading/stats/{satPracticeId}:
 *   get:
 *     summary: Get grading statistics for a SAT practice test
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 */
router.get(
	"/grading/stats/:satPracticeId",
	teacherGradingController.getGradingStats,
);

export default router;
