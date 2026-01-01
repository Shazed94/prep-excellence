import {
	ZCSystemUser,
	ZCuid,
	ZQueryParams,
	ZUSystemUser,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export class SystemUserController {
	getById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const systemUser = await prisma.systemUser.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							phone: true,
							address: true,
							image: true,
							isVerified: true,
						},
					},
				},
			});

			if (!systemUser) throw AppError.notFound("System user not found");

			res.status(200).json({
				success: true,
				data: systemUser,
			});
		},
	);

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `system-users:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "System users fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [systemUsers, total] = await Promise.all([
			prisma.systemUser.findMany({
				skip,
				take: limit,
				orderBy: orderClause,
				select: {
					id: true,
					userId: true,
					jobTitle: true,
					department: true,
					qualifications: true,
					experienceYears: true,
					certifications: true,
					bio: true,
					createdAt: true,
					updatedAt: true,
					user: {
						select: {
							name: true,
							email: true,
							phone: true,
							address: true,
							image: true,
							isStaff: true,
							isVerified: true,
						},
					},
				},
			}),
			prisma.systemUser.count(),
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

		await cached.set(
			cacheKey,
			JSON.stringify({ data: systemUsers, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: systemUsers,
			pagination,
		});
	});

	create = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const data = ZCSystemUser.parse(req.body);

			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			});
			if (existingUser) {
				throw AppError.conflict("User already exists");
			}

			const existingRole = await prisma.role.findUnique({
				where: { name: "Admin" },
				select: { id: true, name: true },
			});
			if (!existingRole) {
				throw AppError.badRequest("Invalid role specified");
			}

			const result = await prisma.$transaction(async (tx) => {
				const user = await tx.user.create({
					data: {
						name: data.name,
						email: data.email,
						password: await bcrypt.hash(data.password, 12),
						roleId: existingRole.id,
						phone: data.phone,
						address: data.address,
						image: data.image,
						isStaff: true, // System users are always staff
						isVerified: data.isVerified ?? false,
						createdById: req.user?.id,
					},
				});

				const systemUser = await tx.systemUser.create({
					data: {
						userId: user.id,
						jobTitle: data.jobTitle,
						department: data.department,
						qualifications: data.qualifications ?? [],
						experienceYears: data.experienceYears,
						certifications: data.certifications ?? [],
						bio: data.bio,
					},
				});

				return { systemUser };
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.CREATE,
				module: "SystemUser",
				entityId: result.systemUser.id,
				description: `System user created: ${data.email}`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("system-users:*");

			return res.status(201).json({
				success: true,
				message: "System user created successfully",
				data: result.systemUser.id,
			});
		},
	);

	update = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);
			const data = ZUSystemUser.parse(req.body);
			const {
				name,
				email,
				password,
				phone,
				address,
				image,
				isStaff,
				isVerified,
				...systemUserData
			} = data;

			await prisma.$transaction(async (tx) => {
				const systemUser = await tx.systemUser.findUnique({
					where: { id },
					select: { id: true, userId: true },
				});
				if (!systemUser) throw AppError.notFound("System user not found");

				// Update system user data
				await tx.systemUser.update({
					where: { id },
					data: systemUserData,
				});

				// Update user data if any user fields are provided
				const userUpdateData: {
					name?: string;
					email?: string;
					password?: string;
					phone?: string;
					address?: string;
					image?: string;
					isStaff?: boolean;
					isVerified?: boolean;
				} = {};

				if (name !== undefined) userUpdateData.name = name;
				if (email !== undefined) userUpdateData.email = email;
				if (password !== undefined)
					userUpdateData.password = await bcrypt.hash(password, 12);
				if (phone !== undefined) userUpdateData.phone = phone;
				if (address !== undefined) userUpdateData.address = address;
				if (image !== undefined) userUpdateData.image = image;
				if (isStaff !== undefined) userUpdateData.isStaff = isStaff;
				if (isVerified !== undefined) userUpdateData.isVerified = isVerified;

				if (Object.keys(userUpdateData).length > 0) {
					await tx.user.update({
						where: { id: systemUser.userId },
						data: userUpdateData,
					});
				}
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.UPDATE,
				module: "SystemUser",
				entityId: id,
				description: `System user updated`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("system-users:*");

			res.status(200).json({
				success: true,
				message: "System user updated successfully",
			});
		},
	);

	delete = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const systemUser = await prisma.systemUser.findUnique({
				where: { id },
				select: { id: true, userId: true },
			});

			if (!systemUser) throw AppError.notFound("System user not found");

			// Delete system user (user will be cascade deleted)
			await prisma.systemUser.delete({
				where: { id },
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.DELETE,
				module: "SystemUser",
				entityId: id,
				description: `System user deleted`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("system-users:*");

			res.status(200).json({
				success: true,
				message: "System user deleted successfully",
			});
		},
	);
}
