import {
	ZCollegeAdmissionsGuidanceForm,
	ZCuid,
	ZPagination,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

export class GuidanceController {
	create = asyncHandler(async (req, res) => {
		const data = ZCollegeAdmissionsGuidanceForm.parse(req.body);

		const exists = await prisma.guidance.findFirst({
			where: { email: data.email },
		});
		if (exists)
			throw AppError.notFound(
				`Guidance with email '${data.email}' already exists`,
			);

		const guidance = await prisma.guidance.create({ data });

		return res.status(201).json({
			success: true,
			data: guidance,
			message: "Guidance created successfully",
		});
	});

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

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [users, total] = await Promise.all([
			prisma.guidance.findMany({
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.guidance.count(),
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
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const guidance = await prisma.guidance.findUnique({ where: { id } });
		if (!guidance) throw AppError.notFound("Guidance not found");

		return res.status(200).json({ success: true, data: guidance });
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const data = ZCollegeAdmissionsGuidanceForm.parse(req.body);

		const existing = await prisma.guidance.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Guidance not found");

		const updated = await prisma.guidance.update({
			where: { id },
			data,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Guidance updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const guidance = await prisma.guidance.findUnique({ where: { id } });
		if (!guidance) throw AppError.notFound("Guidance not found");

		await prisma.guidance.delete({ where: { id } });

		return res.status(200).json({
			success: true,
			message: "Guidance deleted successfully",
		});
	});
}

export default GuidanceController;
