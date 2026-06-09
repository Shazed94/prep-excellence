import {
  ZCBlogCategorySchema,
  ZCBlogCommentSchema,
  ZCBlogSchema,
  ZCCollecgeEssayReviewSchema,
  ZCContactUsSchema,
  ZCFreeSeminarForm,
  ZCollegeAdmissionsGuidanceForm,
  ZCTrustedCompanies,
  ZCTutorRequestRegistrationSchema,
  ZCuid,
  ZNewsletterSubscription,
  ZUBlogCategorySchema,
  ZUBlogCommentSchema,
  ZUBlogSchema,
  ZUCollegeAdmissionsGuidanceForm,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { uploadBlogImage, uploadImage } from "@/middleware/upload";
import { validate, validateId } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import {
  BlogCategoryController,
  BlogCommentController,
  BlogController,
  CollegeEssayReviewController,
  ContactUsController,
  FreeSeminarController,
  GuidanceController,
  NewsLetterController,
  TrustedCompaniesController,
  TutorRequestRegistrationController,
} from "./controllers";

const router = Router();
const guidanceController = new GuidanceController();
const newsLetterController = new NewsLetterController();
const trustedCompaniesController = new TrustedCompaniesController();
const freeSeminarController = new FreeSeminarController();
const tutorRequestController = new TutorRequestRegistrationController();
const collegeEssayReviewController = new CollegeEssayReviewController();
const contactUsController = new ContactUsController();
const blogCategoryController = new BlogCategoryController();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();

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
  authorize(PERMISSIONS.GUIDANCE.VIEW),
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
  authorize(PERMISSIONS.GUIDANCE.VIEW),
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
  authorize(PERMISSIONS.GUIDANCE.CHANGE),
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
  authorize(PERMISSIONS.GUIDANCE.DELETE),
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
  authorize(PERMISSIONS.NEWS_LETTER.VIEW),
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
  authorize(PERMISSIONS.NEWS_LETTER.VIEW),
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

// ============================================
// TUTOR REQUEST REGISTRATION ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/tutor-request:
 *   post:
 *     summary: Submit tutor request registration
 *     description: Submit a request for tutoring services
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Tutor request submitted successfully
 */
router.post(
  "/tutor-request",
  validate(ZCTutorRequestRegistrationSchema),
  tutorRequestController.create,
);

/**
 * @swagger
 * /api/v1/tutor-request:
 *   get:
 *     summary: Get all tutor requests
 *     description: Retrieve paginated list of tutor requests
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tutor requests
 */
router.get("/tutor-request", authenticate, tutorRequestController.getAll);

/**
 * @swagger
 * /api/v1/tutor-request/{id}:
 *   delete:
 *     summary: Delete tutor request
 *     description: Remove a tutor request
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
 *         description: Tutor request deleted successfully
 */
router.delete(
  "/tutor-request/:id",
  authenticate,
  validateId(ZCuid),
  tutorRequestController.delete,
);

// ============================================
// COLLEGE ESSAY REVIEW ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/college-essay-review:
 *   post:
 *     summary: Submit college essay review request
 *     description: Submit a request for college essay review
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: College essay review submitted successfully
 */
router.post(
  "/college-essay-review",
  validate(ZCCollecgeEssayReviewSchema),
  collegeEssayReviewController.create,
);

/**
 * @swagger
 * /api/v1/college-essay-review:
 *   get:
 *     summary: Get all college essay reviews
 *     description: Retrieve paginated list of college essay reviews
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of college essay reviews
 */
router.get(
  "/college-essay-review",
  authenticate,
  collegeEssayReviewController.getAll,
);

/**
 * @swagger
 * /api/v1/college-essay-review/{id}:
 *   delete:
 *     summary: Delete college essay review
 *     description: Remove a college essay review
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
 *         description: College essay review deleted successfully
 */
router.delete(
  "/college-essay-review/:id",
  authenticate,
  validateId(ZCuid),
  collegeEssayReviewController.delete,
);

// ============================================
// CONTACT US ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/contact-us:
 *   post:
 *     summary: Submit contact us form
 *     description: Submit a contact us inquiry
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 */
router.post(
  "/contact-us",
  validate(ZCContactUsSchema),
  contactUsController.create,
);

/**
 * @swagger
 * /api/v1/contact-us:
 *   get:
 *     summary: Get all contact submissions
 *     description: Retrieve paginated list of contact submissions
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of contact submissions
 */
router.get("/contact-us", authenticate, contactUsController.getAll);

/**
 * @swagger
 * /api/v1/contact-us/{id}:
 *   delete:
 *     summary: Delete contact submission
 *     description: Remove a contact submission
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
 *         description: Contact submission deleted successfully
 */
router.delete(
  "/contact-us/:id",
  authenticate,
  validateId(ZCuid),
  contactUsController.delete,
);

// ============================================
// BLOG CATEGORY ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/blog-categories:
 *   post:
 *     summary: Create a new blog category
 *     tags: [Blog]
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
 *     responses:
 *       201:
 *         description: Blog category created successfully
 */
router.post(
  "/blog-categories",
  authenticate,
  validate(ZCBlogCategorySchema),
  blogCategoryController.create,
);

/**
 * @swagger
 * /api/v1/blog-categories:
 *   get:
 *     summary: Get all blog categories
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of blog categories
 */
router.get("/blog-categories", blogCategoryController.getAll);

/**
 * @swagger
 * /api/v1/blog-categories/{id}:
 *   get:
 *     summary: Get a blog category by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog category details
 */
router.get(
  "/blog-categories/:id",
  validateId(ZCuid),
  blogCategoryController.getById,
);

/**
 * @swagger
 * /api/v1/blog-categories/{id}:
 *   patch:
 *     summary: Update a blog category
 *     tags: [Blog]
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog category updated successfully
 */
router.patch(
  "/blog-categories/:id",
  authenticate,
  validateId(ZCuid),
  validate(ZUBlogCategorySchema),
  blogCategoryController.update,
);

/**
 * @swagger
 * /api/v1/blog-categories/{id}:
 *   delete:
 *     summary: Delete a blog category
 *     tags: [Blog]
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
 *         description: Blog category deleted successfully
 */
router.delete(
  "/blog-categories/:id",
  authenticate,
  validateId(ZCuid),
  blogCategoryController.delete,
);

// ============================================
// BLOG ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *               - description
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 */
router.post(
  "/blogs",
  authenticate,
  uploadBlogImage,
  validate(ZCBlogSchema),
  blogController.create,
);

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/blogs", blogController.getAll);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details
 */

/**
 * @swagger
 * /api/v1/blogs/filters:
 *   get:
 *     summary: Get available filter values for blogs
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Filter values including categories, tags, and months
 */
router.get("/blogs/filters", blogController.getFilterValues);

router.get("/blogs/:id", validateId(ZCuid), blogController.getById);

/**
 * @swagger
 * /api/v1/blogs/slug/{slug}:
 *   get:
 *     summary: Get a blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details
 */
router.get("/blogs/slug/:slug", blogController.getBySlug);

router.get("/blogs/:slug/related", blogController.getRelated);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   patch:
 *     summary: Update a blog post
 *     tags: [Blog]
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
 *             properties:
 *               title:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 */
router.patch(
  "/blogs/:id",
  authenticate,
  uploadBlogImage,
  validateId(ZCuid),
  validate(ZUBlogSchema),
  blogController.update,
);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog]
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
 *         description: Blog deleted successfully
 */
router.delete(
  "/blogs/:id",
  authenticate,
  validateId(ZCuid),
  blogController.delete,
);

// ============================================
// BLOG COMMENT ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/blog-comments:
 *   post:
 *     summary: Create a new blog comment
 *     tags: [Blog Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blogId
 *               - content
 *             properties:
 *               blogId:
 *                 type: string
 *               content:
 *                 type: string
 *                 minLength: 3
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post(
  "/blog-comments",
  authenticate,
  validate(ZCBlogCommentSchema),
  blogCommentController.create,
);

/**
 * @swagger
 * /api/v1/blog-comments:
 *   get:
 *     summary: Get all blog comments (admin)
 *     tags: [Blog Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get("/blog-comments", authenticate, blogCommentController.getAll);

/**
 * @swagger
 * /api/v1/blog-comments/{id}:
 *   get:
 *     summary: Get a blog comment by ID
 *     tags: [Blog Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 */
router.get(
  "/blog-comments/:id",
  validateId(ZCuid),
  blogCommentController.getById,
);

/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments:
 *   get:
 *     summary: Get all comments for a specific blog
 *     tags: [Blog Comment]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get("/blogs/:blogId/comments", blogCommentController.getByBlogId);

/**
 * @swagger
 * /api/v1/blog-comments/{id}:
 *   patch:
 *     summary: Update a blog comment
 *     tags: [Blog Comment]
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
 *               content:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.patch(
  "/blog-comments/:id",
  authenticate,
  validateId(ZCuid),
  validate(ZUBlogCommentSchema),
  blogCommentController.update,
);

/**
 * @swagger
 * /api/v1/blog-comments/{id}:
 *   delete:
 *     summary: Delete a blog comment
 *     tags: [Blog Comment]
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
 *         description: Comment deleted successfully
 */
router.delete(
  "/blog-comments/:id",
  authenticate,
  validateId(ZCuid),
  blogCommentController.delete,
);

export default router;
