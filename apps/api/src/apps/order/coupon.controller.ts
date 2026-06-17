import {
	createCouponSchema,
	updateCouponSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { buildWhere } from "@/utils/filters";

/**
 * Create Coupon
 * POST /api/v1/coupons
 */
export const createCoupon = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createCouponSchema.parse(req.body);

		const existing = await prisma.coupon.findUnique({
			where: { code: validated.code },
		});

		if (existing) {
			throw new AppError("Coupon with this code already exists", 409);
		}

		const coupon = await prisma.coupon.create({
			data: {
				code: validated.code,
				discountType: validated.discountType,
				value: validated.value,
				maxUses: validated.maxUses,
				minOrderAmount: validated.minOrderAmount,
				expiresAt: validated.expiresAt
					? new Date(validated.expiresAt)
					: undefined,
				isActive: validated.isActive,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Coupon",
			entityId: coupon.id,
			description: `Created coupon ${coupon.code} (${coupon.discountType} - ${coupon.value})`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: coupon,
			message: "Coupon created successfully",
		});
	},
);

/**
 * Get Coupons (paginated)
 * GET /api/v1/coupons
 */
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);

	const skip = (page - 1) * limit;

	const cacheKey = `coupons:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		return res.status(200).json({
			success: true,
			message: "Coupons fetched successfully (from cache)",
			data: parsed.data,
			pagination: parsed.pagination,
		});
	}

	const ALLOWED_FILTERS = ["discountType", "isActive", "code"];
	const where = buildWhere(filters, ALLOWED_FILTERS);

	if (search) {
		where.OR = [{ code: { contains: search, mode: "insensitive" } }];
	}

	const orderClause: Record<string, "asc" | "desc"> = {
		[sortBy]: orderBy,
	};

	const [coupons, total] = await Promise.all([
		prisma.coupon.findMany({
			where,
			skip,
			take: limit,
			orderBy: orderClause,
		}),
		prisma.coupon.count({ where }),
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

	await cached.set(cacheKey, JSON.stringify({ data: coupons, pagination }), 60);

	return res.json({
		success: true,
		data: coupons,
		pagination,
	});
});

/**
 * Get Coupon by ID
 * GET /api/v1/coupons/:id
 */
export const getCoupon = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const coupon = await prisma.coupon.findUnique({
		where: { id },
		include: {
			_count: {
				select: { couponUsages: true },
			},
		},
	});

	if (!coupon) {
		throw new AppError("Coupon not found", 404);
	}

	return res.status(200).json({
		success: true,
		data: coupon,
	});
});

/**
 * Update Coupon
 * PATCH /api/v1/coupons/:id
 */
export const updateCoupon = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = updateCouponSchema.parse(req.body);

		const coupon = await prisma.coupon.findUnique({
			where: { id },
		});

		if (!coupon) {
			throw new AppError("Coupon not found", 404);
		}

		// If code is being changed, check uniqueness
		if (validated.code && validated.code !== coupon.code) {
			const existing = await prisma.coupon.findUnique({
				where: { code: validated.code },
			});
			if (existing) {
				throw new AppError("Coupon with this code already exists", 409);
			}
		}

		const updated = await prisma.coupon.update({
			where: { id },
			data: {
				code: validated.code,
				discountType: validated.discountType,
				value: validated.value,
				maxUses: validated.maxUses,
				minOrderAmount: validated.minOrderAmount,
				expiresAt: validated.expiresAt
					? new Date(validated.expiresAt)
					: validated.expiresAt === null
						? null
						: undefined,
				isActive: validated.isActive,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Coupon",
			entityId: updated.id,
			description: `Updated coupon ${updated.code}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Coupon updated successfully",
		});
	},
);

/**
 * Delete Coupon
 * DELETE /api/v1/coupons/:id
 */
export const deleteCoupon = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const coupon = await prisma.coupon.findUnique({
			where: { id },
		});

		if (!coupon) {
			throw new AppError("Coupon not found", 404);
		}

		await prisma.coupon.delete({
			where: { id },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Coupon",
			entityId: id,
			description: `Deleted coupon ${coupon.code}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			message: "Coupon deleted successfully",
		});
	},
);
