import {
	ZCTeacher,
	ZCuid,
	ZQueryParams,
	ZUTeacher,
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

export class TeacherController {
	getById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const teacher = await prisma.teacher.findUnique({
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

			if (!teacher) throw AppError.notFound("Teacher not found");

			const { user, ...t } = teacher;
			const result = {
				...t,
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
		const cacheKey = `teachers:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Teachers fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [teachers, total] = await Promise.all([
			prisma.teacher.findMany({
				skip,
				take: limit,
				orderBy: orderClause,
				select: {
					id: true,
					userId: true,
					qualifications: true,
					experienceYears: true,
					certifications: true,
					subjects: true,
					bio: true,
					isActive: true,
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
			prisma.teacher.count(),
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

		const result = teachers.map((s) => {
			const { user, ...teacherData } = s;

			return {
				...teacherData,
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
			const data = ZCTeacher.parse(req.body);
			const imageFile = req.file;

			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			});
			if (existingUser) {
				throw AppError.conflict("User already exists");
			}

			const existingRole = await prisma.role.findUnique({
				where: { name: "Teacher" },
				select: { id: true, name: true },
			});
			if (!existingRole) {
				throw AppError.badRequest("Invalid role specified");
			}

			// Handle image upload
			let imageUrl: string | undefined;
			if (imageFile) {
				const imageKey = `users/teachers/${generateFileName(
					imageFile.originalname,
					"teacher_",
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

				const teacher = await tx.teacher.create({
					data: {
						userId: user.id,
						role: data.role,
						qualifications: data.qualifications,
						experienceYears: data.experienceYears,
						certifications: data.certifications ?? [],
						subjects: data.subjects ?? [],
						bio: data.bio,
					},
				});

				return { teacher };
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.CREATE,
				module: "Teacher",
				entityId: result.teacher.id,
				description: `Teacher created: ${data.email}`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("teachers:*");

			return res.status(201).json({
				success: true,
				message: "Teacher created successfully",
				data: result.teacher.id,
			});
		},
	);

	update = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);
			const data = ZUTeacher.parse(req.body);
			const imageFile = req.file;
			const {
				name,
				email,
				password,
				phone,
				address,
				image,
				isVerified,
				...teacherData
			} = data;

			// Handle image upload
			let imageUrl: string | undefined;
			if (imageFile) {
				const imageKey = `users/teachers/${generateFileName(
					imageFile.originalname,
					"teacher_",
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
				const teacher = await tx.teacher.findUnique({
					where: { id },
					select: { id: true, userId: true },
				});
				if (!teacher) throw AppError.notFound("Teacher not found");

				// Update teacher data
				await tx.teacher.update({
					where: { id },
					data: teacherData,
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
				} = {};

				if (name !== undefined) userUpdateData.name = name;
				if (email !== undefined) userUpdateData.email = email;
				if (password !== undefined)
					userUpdateData.password = await bcrypt.hash(password, 12);
				if (phone !== undefined) userUpdateData.phone = phone;
				if (address !== undefined) userUpdateData.address = address;
				if (imageUrl !== undefined) userUpdateData.image = imageUrl;
				else if (image !== undefined) userUpdateData.image = image;
				if (isVerified !== undefined) userUpdateData.isVerified = isVerified;

				if (Object.keys(userUpdateData).length > 0) {
					await tx.user.update({
						where: { id: teacher.userId },
						data: userUpdateData,
					});
				}
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.UPDATE,
				module: "Teacher",
				entityId: id,
				description: `Teacher updated`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("teachers:*");

			res.status(200).json({
				success: true,
				message: "Teacher updated successfully",
			});
		},
	);

	delete = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const teacher = await prisma.teacher.findUnique({
				where: { id },
				select: { id: true, userId: true },
			});

			if (!teacher) throw AppError.notFound("Teacher not found");

			// Delete teacher (user will be cascade deleted)
			await prisma.teacher.delete({
				where: { id },
			});

			// Audit log
			await createAuditLogFromRequest(req, {
				action: AuditAction.DELETE,
				module: "Teacher",
				entityId: id,
				description: `Teacher deleted`,
				performedById: req.user?.id,
			});

			await invalidateCachePattern("teachers:*");

			res.status(200).json({
				success: true,
				message: "Teacher deleted successfully",
			});
		},
	);
}
