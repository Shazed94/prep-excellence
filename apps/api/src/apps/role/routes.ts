import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireSuperUser } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import { PermissionController, RoleController } from "./controllers";

const router = Router();
const roleController = new RoleController();
const permissionController = new PermissionController();

// ============================================
// ROLE ROUTES
// ============================================

/**
 * @route   POST /api/roles
 * @desc    Create a new role
 * @access  Super User only
 */
router.post(
	"/roles",
	authenticate,
	requireSuperUser(),
	roleController.createRole,
);

/**
 * @route   GET /api/roles
 * @desc    Get all roles with their permissions
 * @access  Users with view_role permission
 */
router.get(
	"/roles",
	authenticate,
	authorize(PERMISSIONS.ROLE.VIEW),
	roleController.getRoles,
);

/**
 * @route   GET /api/roles/:id
 * @desc    Get a single role by ID
 * @access  Users with view_role permission
 */
router.get(
	"/roles/:id",
	authenticate,
	authorize(PERMISSIONS.ROLE.VIEW),
	roleController.getRoleById,
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Update a role (name/description)
 * @access  Super User only
 */
router.put(
	"/roles/:id",
	authenticate,
	requireSuperUser(),
	roleController.updateRole,
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Delete a role (only if no users assigned)
 * @access  Super User only
 */
router.delete(
	"/roles/:id",
	authenticate,
	requireSuperUser(),
	roleController.deleteRole,
);

// ============================================
// ROLE PERMISSION ASSIGNMENT ROUTES
// ============================================

/**
 * @route   POST /api/roles/:id/permissions
 * @desc    Assign permissions to a role (replaces existing)
 * @access  Super User only
 * @body    { permissionIds: string[] }
 */
router.post(
	"/roles/:id/permissions",
	authenticate,
	requireSuperUser(),
	roleController.assignPermissions,
);

/**
 * @route   PATCH /api/roles/:id/permissions
 * @desc    Add permissions to a role (keeps existing)
 * @access  Super User only
 * @body    { permissionIds: string[] }
 */
router.patch(
	"/roles/:id/permissions",
	authenticate,
	requireSuperUser(),
	roleController.addPermissions,
);

/**
 * @route   DELETE /api/roles/:id/permissions
 * @desc    Remove permissions from a role
 * @access  Super User only
 * @body    { permissionIds: string[] }
 */
router.delete(
	"/roles/:id/permissions",
	authenticate,
	requireSuperUser(),
	roleController.removePermissions,
);

// ============================================
// PERMISSION ROUTES (Read-Only)
// ============================================

/**
 * @route   GET /api/permissions
 * @desc    Get all permissions grouped by module
 * @access  Users with view_permission permission
 */
router.get(
	"/permissions",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getAllPermissions,
);

/**
 * @route   GET /api/permissions/module/:module
 * @desc    Get permissions by module
 * @access  Users with view_permission permission
 */
router.get(
	"/permissions/module/:module",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getByModule,
);

/**
 * @route   GET /api/permissions/search
 * @desc    Search permissions by code/name/module
 * @access  Users with view_permission permission
 * @query   q - search term
 */
router.get(
	"/permissions/search",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.searchPermissions,
);

/**
 * @route   GET /api/permissions/scopes
 * @desc    Get available permission scopes
 * @access  Users with view_permission permission
 */
router.get(
	"/permissions/scopes",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getScopes,
);

export default router;
