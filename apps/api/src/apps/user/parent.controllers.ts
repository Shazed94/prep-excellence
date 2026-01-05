import {
	ZCParent,
	ZCuid,
	ZQueryParams,
	ZUParent,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import config from "../../config";

export class ParentController {
	getById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const parent = await prisma.parent.findUnique({
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

			if (!parent) throw AppError.notFound("Parent not found");

			const { user, ...p } = parent;
			const result = {
				...p,
				...user,
				image: user.image
					? `${config.storage_url.public_url}/${user.image}`
					: null,
			};

			res.status(200).json({
				success: true,
				data: result,
			});
		},
	);

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `parents:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Parents fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [parents, total] = await Promise.all([
			prisma.parent.findMany({
				skip,
				take: limit,
				orderBy: orderClause,
				select: {
					id: true,
					userId: true,
					contactNumber: true,
					relation: true,
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
			prisma.parent.count(),
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

		const result = parents.map((s) => {
			const { user, ...parentData } = s;

			return {
				...parentData,
				...user,
				image: user?.image
					? `${config.storage_url.public_url}/${user.image}`
					: null,
			};
		});

		await cached.set(
			cacheKey,
			JSON.stringify({ data: result, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: result,
			pagination,
		});
	});

	create = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const data = ZCParent.parse(req.body);
			const imageFile = req.file;

			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			});
			if (existingUser) {
				throw AppError.conflict("User already exists");
			}

			const existingRole = await prisma.role.findUnique({
				where: { name: "Parent" },
				select: { id: true, name: true },
			});
			if (!existingRole) {
				throw AppError.badRequest("Invalid role specified");
			}

			// Handle image upload
			let imageUrl: string | undefined;
			if (imageFile) {
				const imageKey = `users/parents/${generateFileName(
					imageFile.originalname,
					"parent_",
				)}`;

				const minioService = (await import("@/infrastructure/storage/minio"))
					.default;
				await minioService.uploadFile(
					imageKey,
					imageFile.buffer,
					imageFile.mimetype,
					{
						originalName: imageFile.originalname,
						uploadedAt: new Date().toISOString(),
					},
				);
				imageUrl = imageKey;
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
						image: imageUrl || data.image,
						isVerified: data.isVerified ?? true,
						createdById: req.user?.id,
					},
				});

				const parent = await tx.parent.create({
					data: {
						userId: user.id,
						contactNumber: data.contactNumber,
						relation: data.relation,
					},
				});

				return { parent };
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.CREATE,
				module: "Parent",
				entityId: result.parent.id,
				description: `Parent created: ${data.email}`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("parents:*");

			return res.status(201).json({
				success: true,
				message: "Parent created successfully",
				data: result.parent.id,
			});
		},
	);

	update = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);
			const data = ZUParent.parse(req.body);
			const imageFile = req.file;
			const {
				name,
				email,
				password,
				phone,
				address,
				image,
				isVerified,
				isStaff = false,
				...parentData
			} = data;

			// Handle image upload
			let imageUrl: string | undefined;
			if (imageFile) {
				const imageKey = `users/parents/${generateFileName(
					imageFile.originalname,
					"parent_",
				)}`;

				const minioService = (await import("@/infrastructure/storage/minio"))
					.default;
				await minioService.uploadFile(
					imageKey,
					imageFile.buffer,
					imageFile.mimetype,
					{
						originalName: imageFile.originalname,
						uploadedAt: new Date().toISOString(),
					},
				);
				imageUrl = imageKey;
			}

			await prisma.$transaction(async (tx) => {
				const parent = await tx.parent.findUnique({
					where: { id },
					select: { id: true, userId: true },
				});
				if (!parent) throw AppError.notFound("Parent not found");

				// Update parent data
				await tx.parent.update({
					where: { id },
					data: parentData,
				});

				// Update user data if any user fields are provided
				const userUpdateData: {
					name?: string;
					email?: string;
					password?: string;
					phone?: string;
					address?: string;
					image?: string;
					isVerified?: boolean;
					isStaff?: boolean;
				} = {};

				if (name !== undefined) userUpdateData.name = name;
				if (email !== undefined) userUpdateData.email = email;
				if (password !== undefined)
					userUpdateData.password = await bcrypt.hash(password, 12);
				if (phone !== undefined) userUpdateData.phone = phone;
				if (address !== undefined) userUpdateData.address = address;
				if (imageUrl !== undefined) userUpdateData.image = imageUrl;
				else if (image !== undefined) userUpdateData.image = image;
				if (isStaff !== undefined) userUpdateData.isStaff = isStaff;
				if (isVerified !== undefined) userUpdateData.isVerified = isVerified;

				if (Object.keys(userUpdateData).length > 0) {
					await tx.user.update({
						where: { id: parent.userId },
						data: userUpdateData,
					});
				}
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.UPDATE,
				module: "Parent",
				entityId: id,
				description: `Parent updated`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("parents:*");

			res.status(200).json({
				success: true,
				message: "Parent updated successfully",
			});
		},
	);

	delete = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const parent = await prisma.parent.findUnique({
				where: { id },
				select: { id: true, userId: true },
			});

			if (!parent) throw AppError.notFound("Parent not found");

			// Delete parent (user will be cascade deleted)
			await prisma.parent.delete({
				where: { id },
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.DELETE,
				module: "Parent",
				entityId: id,
				description: `Parent deleted`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("parents:*");

			res.status(200).json({
				success: true,
				message: "Parent deleted successfully",
			});
		},
	);
}
