import { ZQueryParams } from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { buildWhere } from "@/utils/filters";

export const getOrCreateCart = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user?.id;
		if (!userId) {
			throw new AppError("User profile not found", 404);
		}

		const cart = await prisma.cart.findUnique({
			where: { userId },
			include: {
				items: {
					include: {
						course: { select: { title: true } },
					},
				},
			},
		});

		if (!cart) {
			const newCart = await prisma.cart.create({
				data: { userId },
				include: {
					items: {
						include: {
							course: { select: { title: true } },
						},
					},
				},
			});
			return res.status(201).json({
				success: true,
				data: newCart,
				message: "Cart created successfully",
			});
		}

		return res.status(200).json({
			success: true,
			data: cart,
			message: "Cart fetched successfully",
		});
	},
);

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.body;
	const userId = req.user?.id;

	if (!userId || !courseId) {
		throw new AppError("userId and courseId are required", 400);
	}

	const cart = await prisma.cart.upsert({
		where: { userId },
		create: { userId },
		update: {},
	});

	const item = await prisma.cartItem.upsert({
		where: {
			cartId_courseId: {
				cartId: cart.id,
				courseId,
			},
		},
		create: {
			cartId: cart.id,
			courseId,
			quantity: 1,
		},
		update: {
			quantity: { increment: 1 },
		},
		include: {
			course: true,
		},
	});

	return res.status(200).json({
		success: true,
		data: item,
		message: "Item added to cart successfully",
	});
});

export const clearCartItems = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user?.id;
		if (!userId) {
			throw new AppError("User profile not found", 404);
		}

		const cart = await prisma.cart.findUnique({
			where: { userId },
		});

		if (!cart) {
			throw new AppError("Cart not found", 404);
		}

		await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return res.status(200).json({
			success: true,
			message: "All items removed from cart successfully",
		});
	},
);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("User profile not found", 404);
	}

	const userIns = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			student: {
				select: { id: true },
			},
		},
	});

	if (!userIns || !userIns.student) {
		throw new AppError("Student profile not found", 404);
	}

	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: {
			items: {
				include: {
					course: true,
				},
			},
		},
	});

	if (!cart || cart.items.length === 0) {
		throw new AppError("Cart is empty", 400);
	}

	const totalAmount = cart.items.reduce(
		(sum, item) => sum + Number(item.course.regular_price) * item.quantity,
		0,
	);
	const totalOfferAmount = cart.items.reduce(
		(sum, item) => sum + Number(item.course.offer_price) * item.quantity,
		0,
	);

	const result = await prisma.$transaction(async (tx) => {
		// 1. Create the order with items
		const order = await tx.order.create({
			data: {
				userId,
				subtotal: totalAmount,
				discount: totalAmount - totalOfferAmount,
				total: totalOfferAmount,
				status: "PENDING",
				items: {
					create: cart.items.map((item) => ({
						courseId: item.courseId,
						unitPrice: item.course.offer_price,
					})),
				},
			},
			include: {
				items: true,
			},
		});

		// 2. Create the payment record
		await tx.payment.create({
			data: {
				userId,
				amount: order.total,
				currency: "USD",
				paymentType: "FULL_UPFRONT",
				provider: "STRIPE",
				status: "COMPLETED",
				orderId: order.id,
			},
		});

		// 3. Create coaching enrollments for each course
		await tx.coachingEnrollment.createMany({
			data: cart.items.map((item) => ({
				courseId: item.courseId,
				studentId: userIns.student?.id!,
				orderId: order.id,
			})),
			skipDuplicates: true,
		});

		// 4. Clear the cart items
		await tx.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return order;
	});

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "Order",
		entityId: result.id,
		description: `Created order with total $${result.total}`,
		performedById: req.user?.id,
	});

	return res.status(201).json({
		success: true,
		data: result,
		message: "Order created successfully",
	});
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("User profile not found", 404);
	}

	const orders = await prisma.order.findMany({
		where: { userId },
		include: {
			items: {
				include: {
					course: { select: { title: true } },
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return res.status(200).json({
		success: true,
		data: orders,
		message: "Orders fetched successfully",
	});
});

export const getMyOrder = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { id } = req.params;

	if (!userId) {
		throw new AppError("User profile not found", 404);
	}

	const order = await prisma.order.findFirst({
		where: { id, userId },
		include: {
			items: {
				include: {
					course: { select: { title: true } },
				},
			},
			payments: true,
		},
	});

	if (!order) {
		throw new AppError("Order not found", 404);
	}

	return res.status(200).json({
		success: true,
		data: order,
		message: "Order fetched successfully",
	});
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
		req.query,
	);

	const skip = (page - 1) * limit;

	const cacheKey = `orders:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

	const cachedData = await cached.get(cacheKey);
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		return res.status(200).json({
			success: true,
			message: "Orders fetched successfully (from cache)",
			data: parsed.data,
			pagination: parsed.pagination,
		});
	}

	const ALLOWED_FILTERS = ["userId", "status", "startDate", "endDate"];
	const where = buildWhere(filters, ALLOWED_FILTERS);

	if (filters?.startDate || filters?.endDate) {
		where.createdAt = {};
		if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
		if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
	}

	const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

	const [orders, total] = await Promise.all([
		prisma.order.findMany({
			where,
			include: {
				user: { select: { name: true, email: true } },
				items: {
					include: {
						course: { select: { title: true } },
					},
				},
			},
			skip,
			take: limit,
			orderBy: orderClause,
		}),
		prisma.order.count({ where }),
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

	await cached.set(cacheKey, JSON.stringify({ data: orders, pagination }), 60);

	return res.json({
		success: true,
		data: orders,
		pagination,
	});
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const order = await prisma.order.findUnique({
		where: { id },
		include: {
			user: { select: { name: true, email: true } },
			items: {
				include: {
					course: { select: { title: true } },
				},
			},
			payments: true,
			enrollments: true,
		},
	});

	if (!order) {
		throw new AppError("Order not found", 404);
	}

	return res.status(200).json({
		success: true,
		data: order,
		message: "Order fetched successfully",
	});
});
