import { ZCRole, ZCuid } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireSuperUser } from "@/middleware/authorize";
import { validate, validateId } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import { PermissionController, RoleController } from "./controllers";

const router = Router();
const roleController = new RoleController();
const permissionController = new PermissionController();

// ============================================
// ROLE ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     description: Create a new role with permissions (super user only)
 *     tags: [Roles]
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
 *                 example: Content Manager
 *               description:
 *                 type: string
 *                 nullable: true
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   minLength: 1
 *                 default: []
 *                 example: ["perm_course_add", "perm_content_change"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/roles",
	validate(ZCRole),
	authenticate,
	requireSuperUser(),
	roleController.create,
);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/roles",
	authenticate,
	authorize(PERMISSIONS.ROLE.VIEW),
	roleController.getAll,
);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     description: Retrieve a specific role with its permissions
 *     tags: [Roles]
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
 *         description: Role retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/roles/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.ROLE.VIEW),
	roleController.getById,
);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Update a role
 *     description: Update role details and permissions (super user only)
 *     tags: [Roles]
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
 *               description:
 *                 type: string
 *                 nullable: true
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   minLength: 1
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
	"/roles/:id",
	validateId(ZCuid),
	validate(ZCRole),
	authenticate,
	requireSuperUser(),
	roleController.update,
);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     description: Delete a role (super user only)
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete(
	"/roles/:id",
	authenticate,
	validateId(ZCuid),
	requireSuperUser(),
	roleController.delete,
);

// ============================================
// ROLE PERMISSION ASSIGNMENT ROUTES
// ============================================

/**
 * @swagger
 * /api/v1/permissions:
 *   get:
 *     summary: Get all permissions
 *     description: Retrieve a list of all available permissions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/permissions",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getAll,
);

/**
 * @swagger
 * /api/v1/permissions/module/{module}:
 *   get:
 *     summary: Get permissions by module
 *     description: Retrieve permissions for a specific module
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: module
 *         required: true
 *         schema:
 *           type: string
 *           example: COURSE
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/permissions/module/:module",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getByModule,
);

/**
 * @swagger
 * /api/v1/permissions/scopes:
 *   get:
 *     summary: Get permission scopes
 *     description: Retrieve all available permission scopes
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scopes retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/permissions/scopes",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getScopes,
);

export default router;
