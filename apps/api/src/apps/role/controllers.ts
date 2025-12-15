import { ZCRole, ZCuid, ZURole } from "@prepexcellence/shared-validators";
import type { NextFunction, Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { PermissionChecker } from "@/utils/permission";

export class RoleController {
	create = asyncHandler(async (req, res) => {
		const { name, description, permissionIds = [] } = ZCRole.parse(req.body);

		if (!name) {
			throw AppError.badRequest("Role name is required");
		}

		const exists = await prisma.role.findUnique({
			where: { name: name },
		});
		if (exists) throw AppError.conflict(`Role '${name}' already exists`);

		if (
			!Array.isArray(permissionIds) ||
			permissionIds.some((id) => typeof id !== "string")
		) {
			throw AppError.badRequest("permissionIds must be an array of IDs");
		}

		const validPermissions = await prisma.permission.findMany({
			where: { id: { in: permissionIds } },
		});

		if (validPermissions.length !== permissionIds.length)
			throw AppError.badRequest("One or more permission IDs are invalid");

		const role = await prisma.role.create({
			data: {
				name: name,
				description: description || null,
				permissions: {
					connect: permissionIds.map((id) => ({ id })),
				},
			},
			include: {
				permissions: true,
			},
		});

		await invalidateCachePattern("users:*");

		return res.status(201).json({
			success: true,
			data: role,
			message: "Role created successfully",
		});
	});

	getAll = asyncHandler(async (_req, res) => {
		const roles = await prisma.role.findMany({
			include: {
				permissions: true,
				_count: { select: { users: true } },
			},
			orderBy: { name: "asc" },
		});

		return res.status(200).json({ success: true, data: roles });
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const role = await prisma.role.findUnique({
			where: { id },
			include: {
				permissions: true,
				users: { select: { id: true, name: true, email: true }, take: 10 },
				_count: { select: { users: true } },
			},
		});

		if (!role) throw AppError.notFound("Role not found");

		return res.status(200).json({ success: true, data: role });
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const { name, description, permissionIds = [] } = ZURole.parse(req.body);

		const role = await prisma.role.findUnique({ where: { id } });
		if (!role) throw AppError.notFound("Role not found");

		if (name && name.trim() !== role.name) {
			const conflict = await prisma.role.findUnique({
				where: { name: name.trim() },
			});
			if (conflict) throw AppError.conflict(`Role '${name}' already exists`);
		}

		if (
			!Array.isArray(permissionIds) ||
			permissionIds.some((id) => typeof id !== "string")
		) {
			throw AppError.badRequest("permissionIds must be an array of IDs");
		}

		const validPermissions = await prisma.permission.findMany({
			where: { id: { in: permissionIds } },
		});
		if (validPermissions.length !== permissionIds.length)
			throw AppError.badRequest("One or more permission IDs are invalid");

		const updated = await prisma.role.update({
			where: { id },
			data: {
				...(name && { name: name.trim() }),
				...(description !== undefined && {
					description: description?.trim() || null,
				}),
				permissions: {
					set: permissionIds.map((pid) => ({ id: pid })),
				},
			},
			include: { permissions: true },
		});

		await PermissionChecker.invalidateRoleCache(id);
		await invalidateCachePattern("users:*");

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Role updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const role = await prisma.role.findUnique({
			where: { id },
			include: { _count: { select: { users: true } } },
		});

		if (!role) throw AppError.notFound("Role not found");

		if (role._count.users > 0) {
			throw AppError.badRequest(
				`Cannot delete role '${role.name}'. It has ${role._count.users} assigned user(s).`,
			);
		}

		await prisma.role.delete({ where: { id } });

		await invalidateCachePattern("users:*");

		return res.status(200).json({
			success: true,
			message: `Role '${role.name}' deleted successfully`,
		});
	});
}

export class PermissionController {
	getAll = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const params = req.query.params as string;
			const cacheKey = `permissions:all:${params}`;
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
				where: params
					? {
							OR: [
								{ moduleName: { contains: params, mode: "insensitive" } },
								{ codeName: { contains: params, mode: "insensitive" } },
							],
						}
					: undefined,
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

export const roleController = new RoleController();
export const permissionController = new PermissionController();
