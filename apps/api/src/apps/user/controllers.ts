import type { PaginatedResponse } from "@prepexcellence/shared-types";
import {
	ZCStudent,
	ZCUser,
	ZCuid,
	ZLogin,
	ZPagination,
	ZRegister,
	ZUStudent,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type ms from "ms";
import config from "@/config";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import {
	PERMISSIONS,
	PermissionChecker,
	type UserWithRoleAndPermissions,
} from "@/utils/permission";

export class AuthController {
	register = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const data = ZRegister.parse(req.body);

			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			});

			if (existingUser) {
				throw AppError.conflict("User already exists");
			}

			const roleIns = await prisma.role.findUnique({
				where: { name: data.role },
			});

			if (!roleIns) {
				throw AppError.badRequest("Invalid role specified");
			}

			const hashedPassword = await bcrypt.hash(data.password, 12);

			const user = await prisma.user.create({
				data: {
					name: data.name,
					email: data.email,
					roleId: roleIns.id,
					password: hashedPassword,
				},
			});

			const { accessToken, refreshToken } = this.generateTokens(
				user.id,
				user.email,
			);

			return res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: {
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						role: roleIns.name,
					},
					accessToken,
					refreshToken,
				},
			});
		},
	);

	login = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const data = ZLogin.parse(req.body);

			const user = await prisma.user.findUnique({
				where: { email: data.email },
				select: {
					id: true,
					email: true,
					name: true,
					password: true,
					role: { select: { name: true } },
				},
			});

			if (!user) {
				throw AppError.unauthorized("Invalid credentials");
			}

			const isValid = await bcrypt.compare(data.password, user.password);
			if (!isValid) {
				throw AppError.unauthorized("Invalid credentials");
			}

			const { accessToken, refreshToken } = this.generateTokens(
				user.id,
				user.email,
			);

			return res.status(200).json({
				success: true,
				message: "Login successful",
				data: {
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						role: user.role.name,
					},
					accessToken,
					refreshToken,
				},
			});
		},
	);

	refreshToken = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { refreshToken } = req.body;

			if (!refreshToken) throw AppError.badRequest("Refresh token required");

			let decoded: { userId: string; email: string };
			try {
				decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
					userId: string;
					email: string;
				};
			} catch (_) {
				throw AppError.unauthorized("Invalid refresh token");
			}
			const { accessToken, refreshToken: newRefreshToken } =
				this.generateTokens(decoded.userId, decoded.email);

			return res.status(200).json({
				success: true,
				message: "Token refreshed successfully",
				data: { accessToken, refreshToken: newRefreshToken },
			});
		},
	);

	logout = asyncHandler(
		async (_req: Request, res: Response, _next: NextFunction) => {
			return res.status(200).json({
				success: true,
				message: "Logout successful",
			});
		},
	);

	private generateTokens(userId: string, email: string) {
		const accessToken = jwt.sign({ userId, email }, config.jwt.secret, {
			expiresIn: config.jwt.expiresIn as ms.StringValue,
		});

		const refreshToken = jwt.sign({ userId, email }, config.jwt.refreshSecret, {
			expiresIn: config.jwt.refreshExpiresIn as ms.StringValue,
		});

		return { accessToken, refreshToken };
	}
}

export class UserController {
	getMe = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const currentUser = req.user as UserWithRoleAndPermissions;
			const cacheKey = `user:profile:${currentUser.id}`;
			const cacheTTL = 120; // 2 minutes

			// Try cache first
			const cachedUser = await cached.getJSON(cacheKey);
			if (cachedUser) {
				return res.status(200).json({
					success: true,
					data: cachedUser,
				});
			}

			const user = await prisma.user.findUnique({
				where: { id: currentUser.id },
				select: {
					id: true,
					email: true,
					name: true,
					role: {
						select: {
							name: true,
						},
					},
					image: true,
					address: true,
					phone: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			if (!user) throw AppError.notFound("User not found");

			// Cache the result
			await cached.setJSON(cacheKey, user, cacheTTL);

			return res.status(200).json({
				success: true,
				data: user,
			});
		},
	);

	getById = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);
			const currentUser = req.user as UserWithRoleAndPermissions;

			// Check if user can access this specific user
			const scope = PermissionChecker.getPermissionScope(
				currentUser,
				PERMISSIONS.USER.VIEW,
			);

			// If user has "own" scope and is trying to view someone else, check VIEW_OWN permission
			if (
				scope === "own" &&
				currentUser.id !== id &&
				!PermissionChecker.hasPermission(currentUser, PERMISSIONS.USER.VIEW)
			) {
				throw AppError.forbidden("You can only view your own user information");
			}

			const cacheKey = `user:profile:${id}`;
			const cacheTTL = 120; // 2 minutes

			// Try cache first
			const cachedUser = await cached.getJSON(cacheKey);
			if (cachedUser) {
				return res.status(200).json({
					success: true,
					data: cachedUser,
				});
			}

			const user = await prisma.user.findUnique({
				where: { id },
				select: {
					id: true,
					email: true,
					name: true,
					role: {
						select: {
							name: true,
						},
					},
					image: true,
					address: true,
					phone: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			if (!user) throw AppError.notFound("User not found");

			// Cache the result
			await cached.setJSON(cacheKey, user, cacheTTL);

			return res.status(200).json({
				success: true,
				data: user,
			});
		},
	);

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZPagination.parse(req.query);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const skip = (page - 1) * limit;

		const cacheKey = `users:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:userId=${currentUser.id}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Users fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		// Build scope-based filter
		const scopeFilter = await PermissionChecker.buildScopeFilter(
			currentUser,
			PERMISSIONS.USER.VIEW,
			"id", // User model uses "id" as the user identifier
		);

		if (scopeFilter === null) {
			throw AppError.forbidden("You do not have permission to view users");
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where: scopeFilter, // Apply scope-based filtering
				skip,
				take: limit,
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					email: true,
					name: true,
					isActive: true,
					address: true,
					phone: true,
					image: true,
					role: {
						select: {
							name: true,
						},
					},
				},
				orderBy: orderClause,
			}),

			prisma.user.count({ where: scopeFilter }),
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

		await cached.set(cacheKey, JSON.stringify({ data: users, pagination }), 60);

		return res.status(200).json({
			success: true,
			data: users,
			pagination,
		} as PaginatedResponse<any>);
	});

	update = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);
			const data = ZCUser.partial().parse(req.body);
			const currentUser = req.user as UserWithRoleAndPermissions;

			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) throw AppError.notFound("User not found");

			// Check if user can update this specific user
			if (
				!currentUser.isSuperUser &&
				currentUser.id !== id &&
				!PermissionChecker.hasPermission(currentUser, PERMISSIONS.USER.CHANGE)
			) {
				throw AppError.forbidden("You can only update your own information");
			}

			const updatedUser = await prisma.user.update({
				where: { id },
				data,
			});

			// Invalidate caches
			await Promise.all([
				cached.del(`user:profile:${id}`),
				cached.del(`user:permissions:${id}`),
				cached
					.keys(`users:page=*`)
					.then((keys) => Promise.all(keys.map((key) => cached.del(key)))),
			]);

			res.status(200).json({
				success: true,
				message: "User updated successfully",
				data: updatedUser,
			});
		},
	);

	isActive = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) throw AppError.notFound("User not found");

			await prisma.user.update({
				where: { id },
				data: { isActive: !user.isActive },
			});

			// Invalidate caches
			await Promise.all([
				cached.del(`user:profile:${id}`),
				cached.del(`user:permissions:${id}`),
				cached
					.keys(`users:page=*`)
					.then((keys) => Promise.all(keys.map((key) => cached.del(key)))),
			]);

			res.status(200).json({
				success: true,
				message: `User ${user.isActive ? "deactivated" : "activated"} successfully`,
			});
		},
	);

	deleteUser = asyncHandler(
		async (req: Request, res: Response, _next: NextFunction) => {
			const { id } = ZCuid.parse(req.params);

			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) throw AppError.notFound("User not found");

			await prisma.user.delete({ where: { id } });

			// Invalidate caches
			await Promise.all([
				cached.del(`user:profile:${id}`),
				cached.del(`user:permissions:${id}`),
				cached
					.keys(`users:page=*`)
					.then((keys) => Promise.all(keys.map((key) => cached.del(key)))),
			]);

			res.status(200).json({
				success: true,
				message: "User deleted successfully",
			});
		},
	);
}

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
		const { page, limit, sortBy, orderBy } = ZPagination.parse(req.query);

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
			// const requestedUser = req.user!;

			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			});
			if (existingUser) {
				throw AppError.conflict("User already exists");
			}

			const existingRole = await prisma.role.findUnique({
				where: { id: data.roleId },
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
						// createdById: requestedUser.userId,
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

				return { student };
			});

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

			res.status(200).json({
				success: true,
				message: "Student updated successfully",
			});
		},
	);
}
