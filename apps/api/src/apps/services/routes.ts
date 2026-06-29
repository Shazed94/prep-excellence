import {
	ZCBlogCategorySchema,
	ZCBlogCommentSchema,
	ZCBlogSchema,
	ZCCategorySchema,
	ZCContactUsSchema,
	ZCFreeSeminarEnrollmentForm,
	ZCFreeSeminarForm,
	ZCTrustedCompanies,
	ZCuid,
	ZNewsletterSubscription,
	ZUBlogCategorySchema,
	ZUBlogCommentSchema,
	ZUBlogSchema,
	ZUCategorySchema,
	ZUFreeSeminarForm,
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
	CategoryController,
	ContactUsController,
	FreeSeminarController,
	FreeSeminarEnrollmentController,
	NewsLetterController,
	TrustedCompaniesController,
} from "./controllers";

const router = Router();
const newsLetterController = new NewsLetterController();
const trustedCompaniesController = new TrustedCompaniesController();
const freeSeminarController = new FreeSeminarController();
const freeSeminarEnrollmentController = new FreeSeminarEnrollmentController();
const contactUsController = new ContactUsController();
const blogCategoryController = new BlogCategoryController();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();
const categoryController = new CategoryController();

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
 *     summary: Create a free seminar
 *     description: Create a new free seminar entry
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - capacity
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Seminar image file
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 description: Title of the seminar
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 description: Detailed description of the seminar
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled date and time for the seminar
 *               capacity:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 description: Maximum number of attendees
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the seminar is active
 *     responses:
 *       201:
 *         description: Free seminar created successfully
 */
router.post(
	"/free-seminars",
	uploadBlogImage,
	authenticate,
	validate(ZCFreeSeminarForm),
	freeSeminarController.create,
);

/**
 * @swagger
 * /api/v1/free-seminars:
 *   get:
 *     summary: Get all free seminars
 *     description: Retrieve a paginated list of all free seminars
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Free seminars retrieved successfully
 */
router.get(
	"/free-seminars",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	freeSeminarController.getAll,
);

/**
 * @swagger
 * /api/v1/free-seminars/active:
 *   get:
 *     summary: Get all active free seminars
 *     description: Retrieve all active free seminars
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Active free seminars retrieved successfully
 */
router.get("/free-seminars/active", freeSeminarController.getAllActive);

/**
 * @swagger
 * /api/v1/free-seminars/{id}:
 *   get:
 *     summary: Get a free seminar by ID
 *     description: Retrieve a specific free seminar by its ID
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
 *         description: Free seminar retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *   put:
 *     summary: Update a free seminar
 *     description: Update a specific free seminar
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
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Seminar image file
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 description: Title of the seminar
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 description: Detailed description of the seminar
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled date and time for the seminar
 *               capacity:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 description: Maximum number of attendees
 *               isActive:
 *                 type: boolean
 *                 description: Whether the seminar is active
 *     responses:
 *       200:
 *         description: Free seminar updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/free-seminars/:id",
	authenticate,
	uploadBlogImage,
	validateId(ZCuid),
	validate(ZUFreeSeminarForm),
	freeSeminarController.update,
);

/**
 * @swagger
 * /api/v1/free-seminars/{id}:
 *   delete:
 *     summary: Delete a free seminar
 *     description: Delete a free seminar by its ID
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
 *         description: Free seminar deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/free-seminars/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	freeSeminarController.delete,
);

// ============================================
// FREE SEMINAR ENROLLMENT ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/free-seminar-enrollments:
 *   post:
 *     summary: Enroll in a free seminar
 *     description: Submit an enrollment for a free seminar
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - email
 *               - phone
 *               - country
 *               - seminarId
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               seminarId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enrollment submitted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post(
	"/free-seminar-enrollments",
	validate(ZCFreeSeminarEnrollmentForm),
	freeSeminarEnrollmentController.create,
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

// ============================================
// CATEGORY ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category
 *     tags: [Category]
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
 *                 minLength: 1
 *                 description: Name of the category
 *               description:
 *                 type: string
 *                 description: Description of the category
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the category is active
 *     responses:
 *       201:
 *         description: Category created successfully
 *       409:
 *         description: Category already exists
 */
router.post(
	"/categories",
	authenticate,
	validate(ZCCategorySchema),
	categoryController.create,
);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a paginated list of all categories
 *     tags: [Category]
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
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
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
 *         description: Categories retrieved successfully
 */
router.get("/categories", authenticate, categoryController.getAll);

/**
 * @swagger
 * /api/v1/categories/active:
 *   get:
 *     summary: Get all active categories
 *     description: Retrieve a paginated list of active categories
 *     tags: [Category]
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
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
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
 *         description: Active categories retrieved successfully
 */
router.get("/categories/active", authenticate, categoryController.getAllActive);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Retrieve a specific category by its ID
 *     tags: [Category]
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
 *         description: Category retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/categories/:id",
	authenticate,
	validateId(ZCuid),
	categoryController.getById,
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category
 *     description: Update a specific category by its ID
 *     tags: [Category]
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
 *                 minLength: 1
 *                 description: Name of the category
 *               description:
 *                 type: string
 *                 description: Description of the category
 *               isActive:
 *                 type: boolean
 *                 description: Whether the category is active
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Category already exists
 */
router.put(
	"/categories/:id",
	authenticate,
	validateId(ZCuid),
	validate(ZUCategorySchema),
	categoryController.update,
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category by its ID
 *     tags: [Category]
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
 *         description: Category deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/categories/:id",
	authenticate,
	validateId(ZCuid),
	categoryController.delete,
);

export default router;
