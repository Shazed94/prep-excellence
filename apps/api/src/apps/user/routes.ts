import {
	ZCParent,
	ZCStudent,
	ZCSystemUser,
	ZCTeacher,
	ZCuid,
	ZLogin,
	ZQueryParams,
	ZRegister,
	ZUParent,
	ZUStudent,
	ZUSystemUser,
	ZUTeacher,
	ZUUser,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
// import { authorize, authorizeResourceAccess } from "@/middleware/authorize";
import { validate, validateId, validateQuery } from "@/middleware/validate";
// import { PERMISSIONS } from "@/utils/permission";
import {
	AuthController,
	StudentController,
	UserController,
} from "./controllers";
import { ParentController } from "./parent.controllers";
import { SystemUserController } from "./system-user.controllers";
import { TeacherController } from "./teacher.controllers";

const router = Router();

const authController = new AuthController();
const userController = new UserController();
const studentController = new StudentController();
const teacherController = new TeacherController();
const parentController = new ParentController();
const systemUserController = new SystemUserController();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         description: Invalid credentials
 */
router.post("/auth/login", validate(ZLogin), authController.login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$'
 *                 description: Must contain uppercase, lowercase, and number
 *                 example: SecurePassword123!
 *               role:
 *                 type: string
 *                 enum: [Student, Referral, Affiliate]
 *                 example: Student
 *     responses:
 *       201:
 *         description: Registration successful
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
 */
router.post("/auth/register", validate(ZRegister), authController.register);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/auth/refresh", authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate tokens
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/auth/logout", authController.logout);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/users/me", authenticate, userController.getMe);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/users/:id",
	validateId(ZCuid),
	authenticate,
	// authorize([PERMISSIONS.USER.VIEW, PERMISSIONS.USER.VIEW_OWN]),
	userController.getById,
);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a paginated list of users with optional filtering
 *     tags: [Users]
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
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get(
	"/users",
	validateQuery(ZQueryParams),
	authenticate,
	// authorize(PERMISSIONS.USER.VIEW),
	userController.getAll,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information
 *     tags: [Users]
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
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               phone:
 *                 type: string
 *                 minLength: 11
 *                 pattern: '^\d+$'
 *                 description: Must contain only digits
 *               address:
 *                 type: string
 *                 minLength: 3
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/users/:id",
	validateId(ZCuid),
	validate(ZUUser),
	authenticate,
	// authorizeResourceAccess(PERMISSIONS.USER.CHANGE, (req) => req.params.id),
	userController.update,
);

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Update user active status
 *     description: Activate or deactivate a user account
 *     tags: [Users]
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
router.patch(
	"/users/:id/status",
	validateId(ZCuid),
	authenticate,
	// authorize(PERMISSIONS.USER.CHANGE),
	userController.isActive,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user account
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/users/:id",
	validateId(ZCuid),
	authenticate,
	// authorize(PERMISSIONS.USER.DELETE),
	userController.deleteUser,
);

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Create a student
 *     description: Register a new student profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               phone:
 *                 type: string
 *                 minLength: 11
 *               roleId:
 *                 type: string
 *                 format: cuid
 *               grade:
 *                 type: string
 *               class:
 *                 type: string
 *               section:
 *                 type: string
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *               currentLevel:
 *                 type: string
 *               gpa:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 4
 *               totalCredits:
 *                 type: number
 *                 minimum: 0
 *               academicStatus:
 *                 type: string
 *                 enum: [ACTIVE, PROBATION, GRADUATED]
 *                 default: ACTIVE
 *               guardianName:
 *                 type: string
 *               guardianPhone:
 *                 type: string
 *               guardianEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post(
	"/students/",
	validate(ZCStudent),
	authenticate,
	studentController.create,
);

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a paginated list of students
 *     tags: [Users]
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
 *         description: Students retrieved successfully
 */
router.get(
	"/students",
	validateQuery(ZQueryParams),
	authenticate,
	// authorize([PERMISSIONS.STUDENT.VIEW, PERMISSIONS.STUDENT.VIEW_CHILDREN]),
	studentController.getAll,
);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieve a specific student's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/students/:id",
	validateId(ZCuid),
	authenticate,
	// authorize([
	// 	PERMISSIONS.STUDENT.VIEW,
	// 	PERMISSIONS.STUDENT.VIEW_OWN,
	// 	PERMISSIONS.STUDENT.VIEW_CHILDREN,
	// ]),
	studentController.getById,
);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   put:
 *     summary: Update student
 *     description: Update student profile information
 *     tags: [Users]
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
 *               grade:
 *                 type: string
 *               class:
 *                 type: string
 *               section:
 *                 type: string
 *               currentLevel:
 *                 type: string
 *               gpa:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 4
 *               guardianName:
 *                 type: string
 *               guardianPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 */
router.put(
	"/students/:id",
	validateId(ZCuid),
	validate(ZUStudent),
	authenticate,
	// authorize([PERMISSIONS.STUDENT.CHANGE, PERMISSIONS.STUDENT.CHANGE_OWN]),
	studentController.update,
);

/**
 * @swagger
 * /api/v1/teachers:
 *   post:
 *     summary: Create a teacher
 *     description: Register a new teacher profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               phone:
 *                 type: string
 *                 minLength: 11
 *               qualifications:
 *                 type: string
 *               experienceYears:
 *                 type: integer
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/teachers/",
	validate(ZCTeacher),
	authenticate,
	teacherController.create,
);

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     summary: Get all teachers
 *     description: Retrieve a paginated list of teachers
 *     tags: [Users]
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
 *         description: Teachers retrieved successfully
 */
router.get(
	"/teachers",
	validateQuery(ZQueryParams),
	authenticate,
	// authorize([PERMISSIONS.TEACHER.VIEW, PERMISSIONS.TEACHER.VIEW_CHILDREN]),
	teacherController.getAll,
);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     description: Retrieve a specific teacher's information
 *     tags: [Users]
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
 *         description: Teacher retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/teachers/:id",
	validateId(ZCuid),
	authenticate,
	// authorize([
	// 	PERMISSIONS.STUDENT.VIEW,
	// 	PERMISSIONS.STUDENT.VIEW_OWN,
	// 	PERMISSIONS.STUDENT.VIEW_CHILDREN,
	// ]),
	teacherController.getById,
);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   put:
 *     summary: Update teacher
 *     description: Update teacher profile information
 *     tags: [Users]
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
 *               qualifications:
 *                 type: string
 *               experienceYears:
 *                 type: integer
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 */
router.put(
	"/teachers/:id",
	validateId(ZCuid),
	validate(ZUTeacher),
	authenticate,
	// authorize([PERMISSIONS.TEACHER.CHANGE, PERMISSIONS.TEACHER.CHANGE_OWN]),
	teacherController.update,
);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   delete:
 *     summary: Delete teacher
 *     description: Delete a teacher profile
 *     tags: [Users]
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
 *         description: Teacher deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/teachers/:id",
	validateId(ZCuid),
	authenticate,
	// authorize(PERMISSIONS.TEACHER.DELETE),
	teacherController.delete,
);

// ============= Parent Routes =============

/**
 * @swagger
 * /api/v1/parents:
 *   post:
 *     summary: Create a parent
 *     description: Register a new parent profile
 *     tags: [Users]
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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               relation:
 *                 type: string
 *                 enum: [FATHER, MOTHER, GUARDIAN]
 *     responses:
 *       201:
 *         description: Parent created successfully
 */
router.post(
	"/parents/",
	validate(ZCParent),
	authenticate,
	parentController.create,
);

/**
 * @swagger
 * /api/v1/parents:
 *   get:
 *     summary: Get all parents
 *     description: Retrieve a paginated list of parents
 *     tags: [Users]
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
 *         description: Parents retrieved successfully
 */
router.get(
	"/parents",
	validateQuery(ZQueryParams),
	authenticate,
	parentController.getAll,
);

/**
 * @swagger
 * /api/v1/parents/{id}:
 *   get:
 *     summary: Get parent by ID
 *     description: Retrieve a specific parent's information
 *     tags: [Users]
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
 *         description: Parent retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/parents/:id",
	validateId(ZCuid),
	authenticate,
	parentController.getById,
);

/**
 * @swagger
 * /api/v1/parents/{id}:
 *   put:
 *     summary: Update parent
 *     description: Update parent profile information
 *     tags: [Users]
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
 *               contactNumber:
 *                 type: string
 *               relation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parent updated successfully
 */
router.put(
	"/parents/:id",
	validateId(ZCuid),
	validate(ZUParent),
	authenticate,
	parentController.update,
);

/**
 * @swagger
 * /api/v1/parents/{id}:
 *   delete:
 *     summary: Delete parent
 *     description: Delete a parent profile
 *     tags: [Users]
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
 *         description: Parent deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/parents/:id",
	validateId(ZCuid),
	authenticate,
	parentController.delete,
);

// ============= System User Routes =============

/**
 * @swagger
 * /api/v1/system-users:
 *   post:
 *     summary: Create a system user
 *     description: Register a new system user profile
 *     tags: [Users]
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
 *               - email
 *               - password
 *               - jobTitle
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *                 enum: [ADMIN, SUPPORT, MANAGER, ACCOUNTANT, DEVELOPER, INSTRUCTOR]
 *               department:
 *                 type: string
 *                 enum: [HR, SALES, IT, FINANCE, MARKETING, OPERATIONS]
 *     responses:
 *       201:
 *         description: System user created successfully
 */
router.post(
	"/system-users/",
	validate(ZCSystemUser),
	authenticate,
	systemUserController.create,
);

/**
 * @swagger
 * /api/v1/system-users:
 *   get:
 *     summary: Get all system users
 *     description: Retrieve a paginated list of system users
 *     tags: [Users]
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
 *         description: System users retrieved successfully
 */
router.get(
	"/system-users",
	validateQuery(ZQueryParams),
	authenticate,
	systemUserController.getAll,
);

/**
 * @swagger
 * /api/v1/system-users/{id}:
 *   get:
 *     summary: Get system user by ID
 *     description: Retrieve a specific system user's information
 *     tags: [Users]
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
 *         description: System user retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/system-users/:id",
	validateId(ZCuid),
	authenticate,
	systemUserController.getById,
);

/**
 * @swagger
 * /api/v1/system-users/{id}:
 *   put:
 *     summary: Update system user
 *     description: Update system user profile information
 *     tags: [Users]
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
 *               jobTitle:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: System user updated successfully
 */
router.put(
	"/system-users/:id",
	validateId(ZCuid),
	validate(ZUSystemUser),
	authenticate,
	systemUserController.update,
);

/**
 * @swagger
 * /api/v1/system-users/{id}:
 *   delete:
 *     summary: Delete system user
 *     description: Delete a system user profile
 *     tags: [Users]
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
 *         description: System user deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/system-users/:id",
	validateId(ZCuid),
	authenticate,
	systemUserController.delete,
);

export default router;
