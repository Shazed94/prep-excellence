import {
	ZCStudent,
	ZCuid,
	ZQueryParams,
	ZUStudent,
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
import type { UserWithRoleAndPermissions } from "@/utils/permission";

export class StudentController {
	getById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const student = await prisma.student.findUnique({
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
						},
					},
				},
			});

			if (!student) throw AppError.notFound("Student not found");

			res.status(200).json({
				success: true,
				data: student,
			});
		},
	);

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `students:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Students fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [students, total] = await Promise.all([
			prisma.student.findMany({
				skip,
				take: limit,
				orderBy: orderClause,
				select: {
					id: true,
					userId: true,
					grade: true,
					class: true,
					section: true,
					enrollmentDate: true,
					currentLevel: true,
					gpa: true,
					totalCredits: true,
					academicStatus: true,
					guardianEmail: true,
					guardianName: true,
					guardianPhone: true,
					createdAt: true,
					updatedAt: true,
					user: {
						select: {
							name: true,
							email: true,
							phone: true,
							address: true,
							image: true,
						},
					},
				},
			}),
			prisma.student.count(),
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
			JSON.stringify({ data: students, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: students,
			pagination,
		});
	});

	create = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const data = ZCStudent.parse(req.body);
			const requestedUser = req.user!;

			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			});
			if (existingUser) {
				throw AppError.conflict("User already exists");
			}

			const existingRole = await prisma.role.findUnique({
				where: { name: "Student" },
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
						isStaff: data.isStaff,
						isVerified: data.isVerified,
						createdById: requestedUser.id,
					},
				});

				const student = await tx.student.create({
					data: {
						userId: user.id,
						grade: data.grade,
						class: data.class,
						section: data.section,
						enrollmentDate: data.enrollmentDate,
						currentLevel: data.currentLevel,
						gpa: data.gpa,
						totalCredits: data.totalCredits,
						academicStatus: data.academicStatus,
						guardianEmail: data.guardianEmail,
						guardianName: data.guardianName,
						guardianPhone: data.guardianPhone,
					},
				});

				return { student, user };
			});

			// Audit log
			const currentUser = req.user as UserWithRoleAndPermissions | undefined;
			await createAuditLogFromRequest(req, {
				action: AuditAction.CREATE,
				module: "Student",
				entityId: result.student.id,
				description: `Student created: ${result.user.email}`,
				performedById: currentUser?.id,
			});

			await invalidateCachePattern("students:*");

			return res.status(201).json({
				success: true,
				message: "Student created successfully",
				data: result.student.id,
			});
		},
	);

	update = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);
			const data = ZUStudent.parse(req.body);
			const {
				name,
				email,
				phone,
				address,
				image,
				isStaff,
				isVerified,
				...studentData
			} = data;

			await prisma.$transaction(async (tx) => {
				const studentIns = await tx.student.findUnique({
					where: { id },
					select: { id: true, userId: true },
				});
				if (!studentIns) throw AppError.notFound("Student not found");

				await prisma.student.update({
					where: { id },
					data: studentData,
				});

				const user = await prisma.user.findUnique({
					where: { id: studentIns.userId },
				});
				if (!user) throw AppError.notFound("User not found");

				const userData: Record<string, any> = {};
				if (name !== undefined) userData.name = name;
				if (email !== undefined) userData.email = email;
				if (phone !== undefined) userData.phone = phone;
				if (address !== undefined) userData.address = address;
				if (image !== undefined) userData.image = image;
				if (isStaff !== undefined) userData.isStaff = isStaff;
				if (isVerified !== undefined) userData.isVerified = isVerified;

				await tx.user.update({
					where: { id: studentIns.userId },
					data: userData,
				});
			});

			// Audit log
			const currentUser = req.user as UserWithRoleAndPermissions;
			await createAuditLogFromRequest(req, {
				action: AuditAction.UPDATE,
				module: "Student",
				entityId: id,
				description: `Student updated: ${data.email || "student"}`,
				performedById: currentUser.id,
			});

			await invalidateCachePattern("students:*");

			res.status(200).json({
				success: true,
				message: "Student updated successfully",
			});
		},
	);
}
