import {
	ZCTeacher,
	ZCuid,
	ZQueryParams,
	ZUTeacher,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

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

			res.status(200).json({
				success: true,
				data: teacher,
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

		await cached.set(
			cacheKey,
			JSON.stringify({ data: teachers, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: teachers,
			pagination,
		});
	});

	create = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const data = ZCTeacher.parse(req.body);
			// const requestedUser = req.user!;

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
						isStaff: data.isStaff ?? false,
						isVerified: data.isVerified ?? false,
						// createdById: requestedUser.userId,
					},
				});

				const teacher = await tx.teacher.create({
					data: {
						userId: user.id,
						qualifications: data.qualifications,
						experienceYears: data.experienceYears,
						certifications: data.certifications ?? [],
						subjects: data.subjects ?? [],
						bio: data.bio,
					},
				});

				return { teacher };
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
			const {
				name,
				email,
				password,
				phone,
				address,
				image,
				isStaff,
				isVerified,
				...teacherData
			} = data;

			await prisma.$transaction(async (tx) => {
				const teacherIns = await tx.teacher.findUnique({
					where: { id },
					select: { id: true, userId: true },
				});
				if (!teacherIns) throw AppError.notFound("Teacher not found");

				// Update teacher-specific data
				const teacherUpdateData: Record<string, any> = {};
				if (teacherData.qualifications !== undefined)
					teacherUpdateData.qualifications = teacherData.qualifications;
				if (teacherData.experienceYears !== undefined)
					teacherUpdateData.experienceYears = teacherData.experienceYears;
				if (teacherData.certifications !== undefined)
					teacherUpdateData.certifications = teacherData.certifications;
				if (teacherData.subjects !== undefined)
					teacherUpdateData.subjects = teacherData.subjects;
				if (teacherData.bio !== undefined)
					teacherUpdateData.bio = teacherData.bio;

				if (Object.keys(teacherUpdateData).length > 0) {
					await tx.teacher.update({
						where: { id },
						data: teacherUpdateData,
					});
				}

				// Update user data
				const user = await tx.user.findUnique({
					where: { id: teacherIns.userId },
				});
				if (!user) throw AppError.notFound("User not found");

				const userData: Record<string, any> = {};
				if (name !== undefined) userData.name = name;
				if (email !== undefined) userData.email = email;
				if (password !== undefined)
					userData.password = await bcrypt.hash(password, 12);
				if (phone !== undefined) userData.phone = phone;
				if (address !== undefined) userData.address = address;
				if (image !== undefined) userData.image = image;
				if (isStaff !== undefined) userData.isStaff = isStaff;
				if (isVerified !== undefined) userData.isVerified = isVerified;

				if (Object.keys(userData).length > 0) {
					await tx.user.update({
						where: { id: teacherIns.userId },
						data: userData,
					});
				}
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

			await invalidateCachePattern("teachers:*");

			res.status(200).json({
				success: true,
				message: "Teacher deleted successfully",
			});
		},
	);
}
