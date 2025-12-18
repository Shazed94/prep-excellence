import { Router } from "express";
import {
	DifficultyController,
	DomainController,
	SkillController,
	SubjectController,
	TestTypeController,
} from "./question-metarial.controller";
import {
	ModuleController,
	QuestionBankController,
	SATPracticeController,
	SectionController,
} from "./sat-practice.controller";
import {
	StudentAttemptController,
	TeacherGradingController,
} from "./student-attempt.controller";

const router = Router();

const testTypeController = new TestTypeController();
const subjectController = new SubjectController();
const difficultyController = new DifficultyController();
const domainController = new DomainController();
const skillController = new SkillController();
const questionBankController = new QuestionBankController();
const satPracticeController = new SATPracticeController();
const sectionController = new SectionController();
const moduleController = new ModuleController();
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
 *     description: Create a new SAT/ACT test type
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
 */
router.post("/test-types", testTypeController.create);

/**
 * @swagger
 * /api/v1/sat-practice/test-types:
 *   get:
 *     summary: Get all test types
 *     description: Retrieve all test types with pagination
 *     tags: [SAT Practice - Test Types]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/test-types", testTypeController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/test-types/{id}:
 *   get:
 *     summary: Get test type by ID
 *     description: Retrieve a specific test type
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
 *         description: Test type retrieved successfully
 *       404:
 *         description: Test type not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/test-types/:id", testTypeController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/test-types/{id}:
 *   put:
 *     summary: Update test type
 *     description: Update an existing test type
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
 */
router.put("/test-types/:id", testTypeController.update);

/**
 * @swagger
 * /api/v1/sat-practice/test-types/{id}:
 *   delete:
 *     summary: Delete test type
 *     description: Delete a test type
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
 */
router.delete("/test-types/:id", testTypeController.delete);

//========================
// Subject Routes
//========================

/**
 * @swagger
 * /api/v1/sat-practice/subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Create a new subject (e.g., Math, Reading, Writing)
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
 */
router.post("/subjects", subjectController.create);

/**
 * @swagger
 * /api/v1/sat-practice/subjects:
 *   get:
 *     summary: Get all subjects
 *     description: Retrieve all subjects with pagination
 *     tags: [SAT Practice - Subjects]
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
 *         description: Subjects retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/subjects", subjectController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     description: Retrieve a specific subject
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
 *         description: Subject retrieved successfully
 *       404:
 *         description: Subject not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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
router.post("/questions", questionBankController.create);
router.get("/questions", questionBankController.getAll);
router.get("/questions/:id", questionBankController.getById);
router.put("/questions/:id", questionBankController.update);
router.delete("/questions/:id", questionBankController.delete);

//========================
// SAT Practice Test Routes
//========================
router.post("/tests", satPracticeController.upsert); // Create or update (auto-save)
router.get("/tests", satPracticeController.getAll);
router.get("/tests/:id", satPracticeController.getById);
router.delete("/tests/:id", satPracticeController.delete);
router.post("/tests/:id/publish", satPracticeController.publish);

//========================
// Section Routes
//========================
router.post("/tests/:satPracticeId/sections", sectionController.create);
router.get("/tests/:satPracticeId/sections", sectionController.getAll);
router.get("/sections/:id", sectionController.getById);
router.put("/sections/:id", sectionController.update);
router.delete("/sections/:id", sectionController.delete);

//========================
// Module Routes
//========================
router.post("/sections/:sectionId/modules", moduleController.create);
router.get("/sections/:sectionId/modules", moduleController.getAll);
router.get("/modules/:id", moduleController.getById);
router.put("/modules/:id", moduleController.update);
router.delete("/modules/:id", moduleController.delete);

//========================
// Student Attempt Routes
//========================
router.post("/attempts/start", studentAttemptController.start);
router.get("/attempts/my-attempts", studentAttemptController.getMyAttempts);
router.get("/attempts/:id", studentAttemptController.getAttemptById);
router.post("/attempts/submit-answer", studentAttemptController.submitAnswer);
router.post("/attempts/submit", studentAttemptController.submitAttempt);
router.get("/attempts/:id/result", studentAttemptController.getResult);

//========================
// Teacher Grading Routes
//========================
router.get("/grading/pending", teacherGradingController.getPendingGrading);
router.get(
	"/grading/attempts/:id",
	teacherGradingController.getAttemptForGrading,
);
router.post("/grading/grade-answer", teacherGradingController.gradeAnswer);
router.post("/grading/bulk-grade", teacherGradingController.bulkGrade);

export default router;
