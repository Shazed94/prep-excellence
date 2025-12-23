import { ZCuid, ZQueryParams } from "@prepexcellence/shared-validators";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import {
	PERMISSIONS,
	PermissionChecker,
	type UserWithRoleAndPermissions,
} from "@/utils/permission";

// Schema for filtering audit logs
const ZAuditLogFilters = z.object({
	module: z.string().optional(),
	action: z.string().optional(),
	performedById: z.string().optional(),
	entityId: z.string().optional(),
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional(),
});

export class AuditLogController {
	/**
	 * Get all audit logs with filtering and pagination
	 */
	getAll = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const currentUser = req.user as UserWithRoleAndPermissions;

			// Check permission to view audit logs
			if (
				!PermissionChecker.hasPermission(
					currentUser,
					PERMISSIONS.AUDIT.VIEW_LOGS,
				)
			) {
				throw AppError.forbidden(
					"You do not have permission to view audit logs",
				);
			}

			const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
			const filters = ZAuditLogFilters.parse(req.query);

			const skip = (page - 1) * limit;

			// Build cache key
			const cacheKey = `auditLogs:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:filters=${JSON.stringify(filters)}`;

			// Try cache first
			const cachedData = await cached.get(cacheKey);
			if (cachedData) {
				const parsed = JSON.parse(cachedData);
				return res.status(200).json({
					success: true,
					message: "Audit logs fetched successfully (from cache)",
					data: parsed.data,
					pagination: parsed.pagination,
				});
			}

			// Build where clause
			const where: any = {};

			if (filters.module) {
				where.module = filters.module;
			}

			if (filters.action) {
				where.action = filters.action;
			}

			if (filters.performedById) {
				where.performedById = filters.performedById;
			}

			if (filters.entityId) {
				where.entityId = filters.entityId;
			}

			if (filters.startDate || filters.endDate) {
				where.createdAt = {};
				if (filters.startDate) {
					where.createdAt.gte = new Date(filters.startDate);
				}
				if (filters.endDate) {
					where.createdAt.lte = new Date(filters.endDate);
				}
			}

			// Build order clause
			const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

			const [auditLogs, total] = await Promise.all([
				prisma.auditLog.findMany({
					where,
					skip,
					take: limit,
					orderBy: orderClause,
					include: {
						performedBy: {
							select: {
								id: true,
								name: true,
								email: true,
								role: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				}),
				prisma.auditLog.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			const pagination = {
				total,
				page,
				limit,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			};

			// Cache the result for 2 minutes
			await cached.set(
				cacheKey,
				JSON.stringify({ data: auditLogs, pagination }),
				120,
			);

			return res.status(200).json({
				success: true,
				data: auditLogs,
				pagination,
			});
		},
	);

	/**
	 * Get audit logs for a specific entity
	 */
	getByEntityId = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const currentUser = req.user as UserWithRoleAndPermissions;
			const { entityId } = ZCuid.extend({ entityId: z.string() }).parse(
				req.params,
			);

			// Check permission
			if (
				!PermissionChecker.hasPermission(
					currentUser,
					PERMISSIONS.AUDIT_LOG.VIEW,
				)
			) {
				throw AppError.forbidden(
					"You do not have permission to view audit logs",
				);
			}

			const { page = 1, limit = 20 } = req.query;
			const skip = (Number(page) - 1) * Number(limit);

			const cacheKey = `auditLogs:entity:${entityId}:page=${page}:limit=${limit}`;

			// Try cache first
			const cachedData = await cached.get(cacheKey);
			if (cachedData) {
				const parsed = JSON.parse(cachedData);
				return res.status(200).json({
					success: true,
					message: "Entity audit logs fetched successfully (from cache)",
					data: parsed.data,
					pagination: parsed.pagination,
				});
			}

			const [auditLogs, total] = await Promise.all([
				prisma.auditLog.findMany({
					where: { entityId },
					skip,
					take: Number(limit),
					orderBy: { createdAt: "desc" },
					include: {
						performedBy: {
							select: {
								id: true,
								name: true,
								email: true,
								role: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				}),
				prisma.auditLog.count({ where: { entityId } }),
			]);

			const totalPages = Math.ceil(total / Number(limit));

			const pagination = {
				total,
				page: Number(page),
				limit: Number(limit),
				totalPages,
				hasNext: Number(page) < totalPages,
				hasPrev: Number(page) > 1,
			};

			// Cache for 2 minutes
			await cached.set(
				cacheKey,
				JSON.stringify({ data: auditLogs, pagination }),
				120,
			);

			return res.status(200).json({
				success: true,
				data: auditLogs,
				pagination,
			});
		},
	);

	/**
	 * Get audit logs for the current user's actions
	 */
	getMyAuditLogs = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const currentUser = req.user as UserWithRoleAndPermissions;
			const { page = 1, limit = 20 } = req.query;
			const skip = (Number(page) - 1) * Number(limit);

			const cacheKey = `auditLogs:user:${currentUser.id}:page=${page}:limit=${limit}`;

			// Try cache first
			const cachedData = await cached.get(cacheKey);
			if (cachedData) {
				const parsed = JSON.parse(cachedData);
				return res.status(200).json({
					success: true,
					message: "Your audit logs fetched successfully (from cache)",
					data: parsed.data,
					pagination: parsed.pagination,
				});
			}

			const [auditLogs, total] = await Promise.all([
				prisma.auditLog.findMany({
					where: { performedById: currentUser.id },
					skip,
					take: Number(limit),
					orderBy: { createdAt: "desc" },
				}),
				prisma.auditLog.count({ where: { performedById: currentUser.id } }),
			]);

			const totalPages = Math.ceil(total / Number(limit));

			const pagination = {
				total,
				page: Number(page),
				limit: Number(limit),
				totalPages,
				hasNext: Number(page) < totalPages,
				hasPrev: Number(page) > 1,
			};

			// Cache for 2 minutes
			await cached.set(
				cacheKey,
				JSON.stringify({ data: auditLogs, pagination }),
				120,
			);

			return res.status(200).json({
				success: true,
				data: auditLogs,
				pagination,
			});
		},
	);

	/**
	 * Get a single audit log by ID
	 */
	getById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const currentUser = req.user as UserWithRoleAndPermissions;
			const { id } = ZCuid.parse(req.params);

			// Check permission
			if (
				!PermissionChecker.hasPermission(
					currentUser,
					PERMISSIONS.AUDIT.VIEW_LOGS,
				)
			) {
				throw AppError.forbidden(
					"You do not have permission to view audit logs",
				);
			}

			const cacheKey = `auditLog:${id}`;

			// Try cache first
			const cachedData = await cached.get(cacheKey);
			if (cachedData) {
				return res.status(200).json({
					success: true,
					message: "Audit log fetched successfully (from cache)",
					data: JSON.parse(cachedData),
				});
			}

			const auditLog = await prisma.auditLog.findUnique({
				where: { id },
				include: {
					performedBy: {
						select: {
							id: true,
							name: true,
							email: true,
							role: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			});

			if (!auditLog) {
				throw AppError.notFound("Audit log not found");
			}

			// Cache for 5 minutes
			await cached.set(cacheKey, JSON.stringify(auditLog), 300);

			return res.status(200).json({
				success: true,
				data: auditLog,
			});
		},
	);
}
