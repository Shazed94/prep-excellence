import type { NextFunction, Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { PermissionChecker } from "@/utils/permission";

/**
 * Role Management Controller
 * Handles CRUD operations for roles and permission assignments
 */
export class RoleController {
	/**
	 * Create a new role
	 * POST /api/roles
	 */
	createRole = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { name, description } = req.body;

			if (!name || typeof name !== "string" || name.trim().length === 0) {
				throw AppError.badRequest("Role name is required");
			}

			// Check if role already exists
			const existing = await prisma.role.findUnique({
				where: { name: name.trim() },
			});

			if (existing) {
				throw AppError.conflict(`Role '${name}' already exists`);
			}

			const role = await prisma.role.create({
				data: {
					name: name.trim(),
					description: description?.trim() || null,
				},
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
						},
					},
				},
			});

			return res.status(201).json({
				success: true,
				data: role,
				message: "Role created successfully",
			});
		},
	);

	/**
	 * Get all roles with their permissions
	 * GET /api/roles
	 */
	getRoles = asyncHandler(
		async (_req: Request, res: Response, _next: NextFunction) => {
			const roles = await prisma.role.findMany({
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
							scope: true,
						},
						orderBy: [{ moduleName: "asc" }, { label: "asc" }],
					},
					_count: {
						select: {
							users: true,
						},
					},
				},
				orderBy: { name: "asc" },
			});

			return res.status(200).json({
				success: true,
				data: roles,
			});
		},
	);

	/**
	 * Get a single role by ID
	 * GET /api/roles/:id
	 */
	getRoleById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = req.params;

			const role = await prisma.role.findUnique({
				where: { id },
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
							scope: true,
						},
						orderBy: [{ moduleName: "asc" }, { label: "asc" }],
					},
					users: {
						select: {
							id: true,
							name: true,
							email: true,
						},
						take: 10, // Limit to avoid large payloads
					},
					_count: {
						select: {
							users: true,
						},
					},
				},
			});

			if (!role) {
				throw AppError.notFound("Role not found");
			}

			return res.status(200).json({
				success: true,
				data: role,
			});
		},
	);

	/**
	 * Update a role (name and description only)
	 * PUT /api/roles/:id
	 */
	updateRole = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = req.params;
			const { name, description } = req.body;

			const existingRole = await prisma.role.findUnique({
				where: { id },
			});

			if (!existingRole) {
				throw AppError.notFound("Role not found");
			}

			// If name is being changed, check for conflicts
			if (name && name !== existingRole.name) {
				const nameConflict = await prisma.role.findUnique({
					where: { name: name.trim() },
				});

				if (nameConflict) {
					throw AppError.conflict(`Role '${name}' already exists`);
				}
			}

			const role = await prisma.role.update({
				where: { id },
				data: {
					...(name && { name: name.trim() }),
					...(description !== undefined && {
						description: description?.trim() || null,
					}),
				},
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
							scope: true,
						},
					},
				},
			});

			return res.status(200).json({
				success: true,
				data: role,
				message: "Role updated successfully",
			});
		},
	);

	/**
	 * Delete a role
	 * DELETE /api/roles/:id
	 */
	deleteRole = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = req.params;

			const role = await prisma.role.findUnique({
				where: { id },
				include: {
					_count: {
						select: { users: true },
					},
				},
			});

			if (!role) {
				throw AppError.notFound("Role not found");
			}

			// Prevent deletion of roles with users
			if (role._count.users > 0) {
				throw AppError.badRequest(
					`Cannot delete role '${role.name}' - it has ${role._count.users} assigned user(s). Reassign users first.`,
				);
			}

			await prisma.role.delete({
				where: { id },
			});

			return res.status(200).json({
				success: true,
				message: `Role '${role.name}' deleted successfully`,
			});
		},
	);

	/**
	 * Assign permissions to a role
	 * POST /api/roles/:id/permissions
	 * Body: { permissionIds: string[] }
	 */
	assignPermissions = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = req.params;
			const { permissionIds } = req.body;

			if (
				!Array.isArray(permissionIds) ||
				permissionIds.some((id) => typeof id !== "string")
			) {
				throw AppError.badRequest(
					"permissionIds must be an array of permission IDs",
				);
			}

			const role = await prisma.role.findUnique({
				where: { id },
			});

			if (!role) {
				throw AppError.notFound("Role not found");
			}

			// Verify all permission IDs exist
			const permissions = await prisma.permission.findMany({
				where: {
					id: { in: permissionIds },
				},
			});

			if (permissions.length !== permissionIds.length) {
				throw AppError.badRequest("One or more permission IDs are invalid");
			}

			// Replace all permissions for this role
			const updated = await prisma.role.update({
				where: { id },
				data: {
					permissions: {
						set: permissionIds.map((permId) => ({ id: permId })),
					},
				},
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
							scope: true,
						},
						orderBy: [{ moduleName: "asc" }, { label: "asc" }],
					},
				},
			});

			// Invalidate permission cache for all users with this role
			await PermissionChecker.invalidateRoleCache(role.id);

			return res.status(200).json({
				success: true,
				data: updated,
				message: `Assigned ${permissionIds.length} permission(s) to role '${role.name}'`,
			});
		},
	);

	/**
	 * Add permissions to a role (without removing existing ones)
	 * PATCH /api/roles/:id/permissions
	 * Body: { permissionIds: string[] }
	 */
	addPermissions = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = req.params;
			const { permissionIds } = req.body;

			if (
				!Array.isArray(permissionIds) ||
				permissionIds.some((id) => typeof id !== "string")
			) {
				throw AppError.badRequest(
					"permissionIds must be an array of permission IDs",
				);
			}

			const role = await prisma.role.findUnique({
				where: { id },
				include: {
					permissions: { select: { id: true } },
				},
			});

			if (!role) {
				throw AppError.notFound("Role not found");
			}

			// Verify all permission IDs exist
			const permissions = await prisma.permission.findMany({
				where: {
					id: { in: permissionIds },
				},
			});

			if (permissions.length !== permissionIds.length) {
				throw AppError.badRequest("One or more permission IDs are invalid");
			}

			// Get existing permission IDs
			const existingIds = role.permissions.map((p) => p.id);
			const newIds = permissionIds.filter((id) => !existingIds.includes(id));

			if (newIds.length === 0) {
				return res.status(200).json({
					success: true,
					data: role,
					message: "No new permissions to add",
				});
			}

			// Add new permissions
			const updated = await prisma.role.update({
				where: { id },
				data: {
					permissions: {
						connect: newIds.map((permId) => ({ id: permId })),
					},
				},
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
							scope: true,
						},
						orderBy: [{ moduleName: "asc" }, { label: "asc" }],
					},
				},
			});

			// Invalidate permission cache for all users with this role
			await PermissionChecker.invalidateRoleCache(role.id);

			return res.status(200).json({
				success: true,
				data: updated,
				message: `Added ${newIds.length} new permission(s) to role '${role.name}'`,
			});
		},
	);

	/**
	 * Remove permissions from a role
	 * DELETE /api/roles/:id/permissions
	 * Body: { permissionIds: string[] }
	 */
	removePermissions = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = req.params;
			const { permissionIds } = req.body;

			if (
				!Array.isArray(permissionIds) ||
				permissionIds.some((id) => typeof id !== "string")
			) {
				throw AppError.badRequest(
					"permissionIds must be an array of permission IDs",
				);
			}

			const role = await prisma.role.findUnique({
				where: { id },
			});

			if (!role) {
				throw AppError.notFound("Role not found");
			}

			const updated = await prisma.role.update({
				where: { id },
				data: {
					permissions: {
						disconnect: permissionIds.map((permId) => ({ id: permId })),
					},
				},
				include: {
					permissions: {
						select: {
							id: true,
							codeName: true,
							label: true,
							moduleName: true,
							scope: true,
						},
						orderBy: [{ moduleName: "asc" }, { label: "asc" }],
					},
				},
			});

			// Invalidate permission cache for all users with this role
			await PermissionChecker.invalidateRoleCache(role.id);

			return res.status(200).json({
				success: true,
				data: updated,
				message: `Removed ${permissionIds.length} permission(s) from role '${role.name}'`,
			});
		},
	);
}

/**
 * Permission Management Controller
 * Handles read-only operations for permissions (permissions are seeded, not created via API)
 */
export class PermissionController {
	/**
	 * Get all permissions grouped by module
	 * GET /api/permissions
	 */
	getAllPermissions = asyncHandler(
		async (_req: Request, res: Response, _next: NextFunction) => {
			const cacheKey = "permissions:all";
			const cacheTTL = 300; // 5 minutes

			// Try cache first
			const cached_permissions = await cached.getJSON(cacheKey);
			if (cached_permissions) {
				return res.status(200).json({
					success: true,
					data: cached_permissions,
				});
			}

			const permissions = await prisma.permission.findMany({
				orderBy: [{ moduleName: "asc" }, { label: "asc" }],
			});

			// Group by module
			const grouped = permissions.reduce(
				(acc, perm) => {
					if (!acc[perm.moduleName]) {
						acc[perm.moduleName] = [];
					}
					acc[perm.moduleName].push(perm);
					return acc;
				},
				{} as Record<string, typeof permissions>,
			);

			const result = {
				total: permissions.length,
				modules: Object.keys(grouped).length,
				permissions: grouped,
			};

			// Cache the result
			await cached.setJSON(cacheKey, result, cacheTTL);

			return res.status(200).json({
				success: true,
				data: result,
			});
		},
	);

	/**
	 * Get permissions by module
	 * GET /api/permissions/module/:module
	 */
	getByModule = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { module } = req.params;

			const permissions = await prisma.permission.findMany({
				where: { moduleName: module },
				orderBy: { label: "asc" },
			});

			if (permissions.length === 0) {
				throw AppError.notFound(`No permissions found for module '${module}'`);
			}

			return res.status(200).json({
				success: true,
				data: permissions,
			});
		},
	);

	/**
	 * Search permissions by code or name
	 * GET /api/permissions/search?q=search_term
	 */
	searchPermissions = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { q } = req.query;

			if (!q || typeof q !== "string" || q.trim().length === 0) {
				throw AppError.badRequest("Search query 'q' is required");
			}

			const searchTerm = q.trim().toLowerCase();

			const permissions = await prisma.permission.findMany({
				where: {
					OR: [
						{ codeName: { contains: searchTerm, mode: "insensitive" } },
						{ label: { contains: searchTerm, mode: "insensitive" } },
						{ moduleName: { contains: searchTerm, mode: "insensitive" } },
					],
				},
				orderBy: [{ moduleName: "asc" }, { label: "asc" }],
			});

			return res.status(200).json({
				success: true,
				data: permissions,
				count: permissions.length,
			});
		},
	);

	/**
	 * Get available permission scopes
	 * GET /api/permissions/scopes
	 */
	getScopes = asyncHandler(
		async (_req: Request, res: Response, _next: NextFunction) => {
			const scopes = await prisma.permission.findMany({
				select: {
					scope: true,
				},
				distinct: ["scope"],
			});

			const scopeList = scopes
				.map((s) => s.scope)
				.filter((s) => s !== null)
				.sort();

			return res.status(200).json({
				success: true,
				data: scopeList,
			});
		},
	);
}

// Export controllers
export const roleController = new RoleController();
export const permissionController = new PermissionController();
