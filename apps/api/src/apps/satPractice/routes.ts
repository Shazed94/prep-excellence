import { ZStartAttemptSchema } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import {
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
 *             $ref: '#/components/schemas/TestTypeCreate'
 *     responses:
 *       201:
 *         description: Test type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestTypeResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestTypeListResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestTypeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *             $ref: '#/components/schemas/TestTypeUpdate'
 *     responses:
 *       200:
 *         description: Test type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestTypeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *             $ref: '#/components/schemas/SubjectCreate'
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectListResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *             $ref: '#/components/schemas/SubjectUpdate'
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/subjects/:id", subjectController.delete);

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
 *             $ref: '#/components/schemas/DomainCreate'
 *     responses:
 *       201:
 *         description: Domain created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainListResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *             $ref: '#/components/schemas/DomainUpdate'
 *     responses:
 *       200:
 *         description: Domain updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *             $ref: '#/components/schemas/SkillCreate'
 *     responses:
 *       201:
 *         description: Skill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillListResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *             $ref: '#/components/schemas/SkillUpdate'
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/skills/:id", skillController.delete);

router.post("/skills/filter", skillController.getByFilterAll);

//========================
// Question Bank Routes
//========================
/**
 * @swagger
 * /api/v1/sat-practice/questions:
 *   post:
 *     summary: Create a question in the question bank
 *     tags: [SAT Practice - Question Bank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionCreate'
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionResponse'
 */
router.post("/questions", questionBankController.createFromForm);

/**
 * @swagger
 * /api/v1/sat-practice/questions:
 *   get:
 *     summary: Get all questions in the bank
 *     tags: [SAT Practice - Question Bank]
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Questions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionListResponse'
 */
router.get("/questions", questionBankController.getAll);

/**
 * @swagger
 * /api/v1/sat-practice/questions/filter:
 *   post:
 *     summary: Filter questions
 *     tags: [SAT Practice - Question Bank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionFilterRequest'
 *     responses:
 *       200:
 *         description: Filtered questions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionListResponse'
 */
router.post("/questions/filter", questionBankController.filterQuestions);

/**
 * @swagger
 * /api/v1/sat-practice/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [SAT Practice - Question Bank]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/questions/:id", questionBankController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [SAT Practice - Question Bank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionUpdate'
 *     responses:
 *       200:
 *         description: Question updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put("/questions/:id", questionBankController.updateFromForm);

/**
 * @swagger
 * /api/v1/sat-practice/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [SAT Practice - Question Bank]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete("/questions/:id", questionBankController.delete);

//========================
// SAT Practice Test Routes
//========================
/**
 * @swagger
 * /api/v1/sat-practice/tests:
 *   post:
 *     summary: Create or update (auto-save) a SAT practice test
 *     tags: [SAT Practice - Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SATPracticeUpsert'
 *     responses:
 *       200:
 *         description: Test created/updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SATPracticeResponse'
 */
router.post("/tests", authenticate, satPracticeController.upsert); // Create or update (auto-save)

/**
 * @swagger
 * /api/v1/sat-practice/tests:
 *   get:
 *     summary: Get all SAT practice tests
 *     tags: [SAT Practice - Tests]
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Tests retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SATPracticeListResponse'
 */
router.get("/tests", satPracticeController.getAll);
// router.get("/tests/sat", TestTypeController.);

/**
 * @swagger
 * /api/v1/sat-practice/tests/{id}:
 *   get:
 *     summary: Get SAT practice test by ID
 *     tags: [SAT Practice - Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SATPracticeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/tests/:id", satPracticeController.getById);

/**
 * @swagger
 * /api/v1/sat-practice/tests/{id}:
 *   delete:
 *     summary: Delete a SAT practice test
 *     tags: [SAT Practice - Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete("/tests/:id", satPracticeController.delete);

/**
 * @swagger
 * /api/v1/sat-practice/tests/{id}/publish:
 *   post:
 *     summary: Publish a SAT practice test
 *     tags: [SAT Practice - Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublishResponse'
 */
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttemptStartRequest'
 *     responses:
 *       201:
 *         description: Attempt started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttemptResponse'
 */
router.post(
	"/attempts",
	validate(ZStartAttemptSchema),
	authenticate,
	studentAttemptController.startAttempt,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/my-attempts:
 *   get:
 *     summary: Get all attempts for the logged-in student
 *     description: Returns list of all attempts with basic details for the student dashboard
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All attempts retrieved successfully
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
 *                     $ref: '#/components/schemas/StudentAttemptSummary'
 *                 message:
 *                   type: string
 */
router.get(
	"/attempts/my-attempts",
	authenticate,
	studentAttemptController.getAllMyAttempts,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/{attemptId}/results:
 *   get:
 *     summary: Get detailed attempt results with questions and answers
 *     description: Shows all questions, student answers, and correct answers for completed attempts (Student Dashboard)
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attempt results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AttemptResultsResponse'
 *                 message:
 *                   type: string
 *       400:
 *         description: Attempt must be completed to view results
 *       403:
 *         description: You don't have permission to view this attempt
 *       404:
 *         description: Attempt not found
 */
router.get(
	"/attempts/:attemptId/results",
	authenticate,
	studentAttemptController.getAttemptResults,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/{attemptId}:
 *   get:
 *     summary: Get attempt details with all progress
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attempt details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttemptProgressResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitMCQRequest'
 *     responses:
 *       200:
 *         description: MCQ answer submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitMCQResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitTextAnswerRequest'
 *     responses:
 *       200:
 *         description: Text answer submitted for grading
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitTextAnswerResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttemptModuleCompleteRequest'
 *     responses:
 *       200:
 *         description: Module completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttemptProgressResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttemptNavigateNextRequest'
 *     responses:
 *       200:
 *         description: Section navigation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttemptProgressResponse'
 */
router.post(
	"/attempts/next-module",
	studentAttemptController.navigateToNextModule,
);

/**
 * @swagger
 * /api/v1/sat-practice/attempts/submit:
 *   post:
 *     summary: Submit entire attempt
 *     tags: [SAT Practice - Student Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttemptSubmitRequest'
 *     responses:
 *       200:
 *         description: Attempt submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttemptSubmitResponse'
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
 *     responses:
 *       200:
 *         description: Pending answers retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradingPendingListResponse'
 */
router.get(
	"/grading/pending",
	authenticate,
	teacherGradingController.getPendingAnswers,
);

/**
 * @swagger
 * /api/v1/sat-practice/grading/graded:
 *   get:
 *     summary: Get all graded answers for review
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Graded answers retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradedListResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeRequest'
 *     responses:
 *       200:
 *         description: Answer graded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeResponse'
 */
router.post(
	"/grading/grade",
	authenticate,
	teacherGradingController.gradeTextAnswer,
);

/**
 * @swagger
 * /api/v1/sat-practice/grading/grade/{answerId}:
 *   put:
 *     summary: Update an existing graded answer
 *     tags: [SAT Practice - Teacher Grading]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeUpdateRequest'
 *     responses:
 *       200:
 *         description: Graded answer updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkGradeRequest'
 *     responses:
 *       200:
 *         description: Bulk grading completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkGradeResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecalculateRequest'
 *     responses:
 *       200:
 *         description: Score recalculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecalculateResponse'
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
 *     parameters:
 *       - in: path
 *         name: satPracticeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grading statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradingStatsResponse'
 */
router.get(
	"/grading/stats/:satPracticeId",
	teacherGradingController.getGradingStats,
);

export default router;
