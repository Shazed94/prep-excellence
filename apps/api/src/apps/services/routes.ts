import {
	ZCFreeSeminarForm,
	ZCollegeAdmissionsGuidanceForm,
	ZCTrustedCompanies,
	ZCuid,
	ZNewsletterSubscription,
	ZUCollegeAdmissionsGuidanceForm,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { uploadImage } from "@/middleware/upload";

import { validate, validateId } from "@/middleware/validate";
import {
	FreeSeminarController,
	GuidanceController,
	NewsLetterController,
	TrustedCompaniesController,
} from "./controllers";

const router = Router();
const guidanceController = new GuidanceController();
const newsLetterController = new NewsLetterController();
const trustedCompaniesController = new TrustedCompaniesController();
const freeSeminarController = new FreeSeminarController();

// ============================================
// GUIDANCE ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/guidance:
 *   post:
 *     summary: Submit college admissions guidance request
 *     description: Submit a request for college admissions guidance
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 minLength: 1
 *               stateRegion:
 *                 type: string
 *                 minLength: 1
 *               country:
 *                 type: string
 *                 minLength: 1
 *               studentGrade:
 *                 type: string
 *                 minLength: 1
 *               gpa:
 *                 type: string
 *                 minLength: 1
 *               takenSATACT:
 *                 type: string
 *                 minLength: 1
 *               satActScore:
 *                 type: string
 *                 minLength: 1
 *               extracurricular:
 *                 type: string
 *                 minLength: 1
 *               targetColleges:
 *                 type: string
 *                 minLength: 1
 *               questions:
 *                 type: string
 *                 minLength: 1
 *               childDescription:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Guidance request submitted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post(
	"/guidance",
	validate(ZCollegeAdmissionsGuidanceForm),
	guidanceController.create,
);

/**
 * @swagger
 * /api/v1/guidance:
 *   get:
 *     summary: Get all guidance requests
 *     description: Retrieve all college admissions guidance requests (requires authentication)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Guidance requests retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/guidance",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	guidanceController.getAll,
);

/**
 * @swagger
 * /api/v1/guidance/{id}:
 *   get:
 *     summary: Get guidance request by ID
 *     description: Retrieve a specific guidance request
 *     tags: [Services]
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
 *         description: Guidance request retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	guidanceController.getById,
);

/**
 * @swagger
 * /api/v1/guidance/{id}:
 *   put:
 *     summary: Update guidance request
 *     description: Update a guidance request
 *     tags: [Services]
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
 *     responses:
 *       200:
 *         description: Guidance request updated successfully
 */
router.put(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.CHANGE),
	validateId(ZCuid),
	validate(ZUCollegeAdmissionsGuidanceForm),
	guidanceController.update,
);

/**
 * @swagger
 * /api/v1/guidance/{id}:
 *   delete:
 *     summary: Delete guidance request
 *     description: Delete a guidance request
 *     tags: [Services]
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
 *         description: Guidance request deleted successfully
 */
router.delete(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	guidanceController.delete,
);

/**
 * @swagger
 * /api/v1/newsletter:
 *   post:
 *     summary: Subscribe to newsletter
 *     description: Subscribe an email address to the newsletter
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: subscriber@example.com
 *     responses:
 *       201:
 *         description: Newsletter subscription successful
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post(
	"/newsletter",
	validate(ZNewsletterSubscription),
	newsLetterController.create,
);

/**
 * @swagger
 * /api/v1/newsletter:
 *   get:
 *     summary: Get all newsletter subscriptions
 *     description: Retrieve all newsletter subscriptions (requires authentication)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
 */
router.get(
	"/newsletter",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	newsLetterController.getAll,
);

/**
 * @swagger
 * /api/v1/newsletter/{id}:
 *   get:
 *     summary: Get newsletter subscription by ID
 *     description: Retrieve a specific newsletter subscription
 *     tags: [Services]
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
 *         description: Subscription retrieved successfully
 */
router.get(
	"/newsletter/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	newsLetterController.getById,
);

/**
 * @swagger
 * /api/v1/newsletter/{id}:
 *   delete:
 *     summary: Unsubscribe from newsletter
 *     description: Remove a newsletter subscription
 *     tags: [Services]
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
 *         description: Unsubscribed successfully
 */
router.delete(
	"/newsletter/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	newsLetterController.delete,
);

/**
 * @swagger
 * /api/v1/trusted-companies:
 *   post:
 *     summary: Add trusted company
 *     description: Add a new trusted company with logo
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Trusted company added successfully
 */
router.post(
	"/trusted-companies",
	uploadImage,
	validate(ZCTrustedCompanies),
	trustedCompaniesController.create,
);

/**
 * @swagger
 * /api/v1/trusted-companies:
 *   get:
 *     summary: Get all trusted companies
 *     description: Retrieve list of trusted companies
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trusted companies retrieved successfully
 */
router.get(
	"/trusted-companies",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	trustedCompaniesController.getAll,
);

/**
 * @swagger
 * /api/v1/trusted-companies/{id}:
 *   get:
 *     summary: Get trusted company by ID
 *     description: Retrieve a specific trusted company
 *     tags: [Services]
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
 *         description: Trusted company retrieved successfully
 */
router.get(
	"/trusted-companies/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	trustedCompaniesController.getById,
);

/**
 * @swagger
 * /api/v1/trusted-companies/{id}:
 *   put:
 *     summary: Update trusted company
 *     description: Update trusted company information
 *     tags: [Services]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Trusted company updated successfully
 */
router.put(
	"/trusted-companies/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.CHANGE),
	uploadImage,
	validateId(ZCuid),
	validate(ZCTrustedCompanies),
	trustedCompaniesController.update,
);

/**
 * @swagger
 * /api/v1/trusted-companies/{id}:
 *   delete:
 *     summary: Delete trusted company
 *     description: Remove a trusted company
 *     tags: [Services]
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
 *         description: Trusted company deleted successfully
 */
router.delete(
	"/trusted-companies/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	trustedCompaniesController.delete,
);

/**
 * @swagger
 * /api/v1/free-seminars:
 *   post:
 *     summary: Register for free seminar
 *     description: Submit a registration for a free seminar
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentName
 *               - parentPhone
 *               - parentCity
 *               - studentName
 *               - studentEmail
 *               - studentGrade
 *               - studentSchool
 *               - targetScore
 *               - dreamColleges
 *               - seminarGoals
 *               - questions
 *             properties:
 *               parentName:
 *                 type: string
 *                 minLength: 2
 *               parentPhone:
 *                 type: string
 *                 minLength: 10
 *               parentCity:
 *                 type: string
 *                 minLength: 2
 *               studentName:
 *                 type: string
 *                 minLength: 2
 *               studentEmail:
 *                 type: string
 *                 format: email
 *               studentGrade:
 *                 type: string
 *                 enum: [G7, G8, G9, G10, G11, G12]
 *               studentSchool:
 *                 type: string
 *                 minLength: 2
 *               targetScore:
 *                 type: string
 *                 minLength: 1
 *               dreamColleges:
 *                 type: string
 *                 minLength: 3
 *               seminarGoals:
 *                 type: string
 *                 minLength: 5
 *               questions:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post(
	"/free-seminars",
	validate(ZCFreeSeminarForm),
	freeSeminarController.create,
);

/**
 * @swagger
 * /api/v1/free-seminars:
 *   get:
 *     summary: Get all free seminar registrations
 *     description: Retrieve all free seminar registrations
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registrations retrieved successfully
 */
router.get(
	"/free-seminars",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	freeSeminarController.getAll,
);

/**
 * @swagger
 * /api/v1/free-seminars/{id}:
 *   get:
 *     summary: Get free seminar registration by ID
 *     description: Retrieve a specific registration
 *     tags: [Services]
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
 *         description: Registration retrieved successfully
 */
router.get(
	"/free-seminars/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	freeSeminarController.getById,
);

/**
 * @swagger
 * /api/v1/free-seminars/{id}:
 *   delete:
 *     summary: Delete free seminar registration
 *     description: Remove a registration
 *     tags: [Services]
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
 *         description: Registration deleted successfully
 */
router.delete(
	"/free-seminars/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	freeSeminarController.delete,
);

export default router;
