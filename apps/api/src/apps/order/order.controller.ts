import {
	createOrderSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import z from "zod";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import emailService from "@/infrastructure/email/email";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere } from "@/utils/filters";
import { toPublicUrl } from "@/utils/storageUrl";
import { generateTokens } from "../user/controllers";

interface CouponResult {
	discountAmount: number;
	couponId: string | undefined;
	couponCode: string | undefined;
}

interface CartItem {
	courseId: string;
	quantity: number;
	course: { price: number | string; discount: number | string };
}

interface CartWithItems {
	id: string;
	items: CartItem[];
}

async function validateAndApplyCoupon<TxClient extends Record<string, any>>(
	tx: TxClient,
	couponCode: string | undefined,
	userId: string,
	totalOffer: number,
): Promise<CouponResult> {
	if (!couponCode) {
		return { discountAmount: 0, couponId: undefined, couponCode: undefined };
	}

	const coupon = await tx.coupon.findUnique({
		where: { code: couponCode },
	});

	if (!coupon || !coupon.isActive) {
		throw new AppError("Invalid or inactive coupon", 400);
	}

	if (coupon.expiresAt && coupon.expiresAt < new Date()) {
		throw new AppError("Coupon has expired", 400);
	}

	if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
		throw new AppError("Coupon usage limit exceeded", 400);
	}

	if (coupon.minOrderAmount && totalOffer < coupon.minOrderAmount) {
		throw new AppError("Minimum order amount not met for this coupon", 400);
	}

	const alreadyUsed = await tx.couponUsage.findUnique({
		where: {
			couponId_userId: {
				couponId: coupon.id,
				userId,
			},
		},
	});

	if (alreadyUsed) {
		throw new AppError("Coupon already used", 400);
	}

	const discountAmount =
		coupon.discountType === "PERCENT"
			? (totalOffer * coupon.value) / 100
			: coupon.value;

	return {
		discountAmount,
		couponId: coupon.id,
		couponCode: coupon.code,
	};
}

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
	const validatedData = createOrderSchema.parse(req.body);
	const { couponCode, payableAmount, user: userData, billing } = validatedData;

	// ═══════════════════════════════════════════════════════
	// Step 1 — Resolve user identity (login vs guest)
	// ═══════════════════════════════════════════════════════
	let effectiveUserId = validatedData?.userId;
	let studentId: string | null = null;
	let isNewUser = false;
	let accessToken: string | undefined;
	let refreshToken: string | undefined;

	if (!effectiveUserId) {
		// ── Guest checkout (no auth) ──
		if (!userData) {
			throw new AppError(
				"User data (email & password) is required for guest checkout",
				400,
			);
		}

		if (userData.password !== userData.confirmPassword) {
			throw new AppError("Passwords do not match", 400);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: userData.email },
		});

		if (existingUser) {
			throw new AppError("A user with this email already exists", 409);
		}

		// Create user + student profile in a transaction
		const created = await prisma.$transaction(async (tx) => {
			const studentRole = await tx.role.findUnique({
				where: { name: "Student" },
			});

			if (!studentRole) {
				throw new AppError("Student role not found", 500);
			}

			const hashedPassword = await bcrypt.hash(userData.password, 12);

			const newUser = await tx.user.create({
				data: {
					email: userData.email,
					password: hashedPassword,
					name: `${billing.firstName} ${billing.lastName}`,
					roleId: studentRole.id,
				},
			});
			isNewUser = true;
			const student = await tx.student.create({
				data: { userId: newUser.id },
			});

			const tokens = generateTokens(newUser.id, newUser.email);
			accessToken = tokens.accessToken;
			refreshToken = tokens.refreshToken;

			return { user: newUser, student };
		});

		effectiveUserId = created.user.id;
		studentId = created.student.id;

		// Audit log for guest registration
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "User",
			entityId: created.user.id,
			description: `User registered via guest checkout: ${created.user.email}`,
			performedById: created.user.id,
		});
	} else {
		// ── Logged-in user ──
		const userIns = await prisma.user.findUnique({
			where: { id: effectiveUserId },
			include: { student: { select: { id: true } } },
		});

		if (!userIns || !userIns.student) {
			throw new AppError("Student profile not found", 404);
		}

		studentId = userIns.student.id;
	}

	// ═══════════════════════════════════════════════════════
	// Step 2 — Create billing address for the user
	// ═══════════════════════════════════════════════════════
	await prisma.billingAddress.create({
		data: {
			userId: effectiveUserId,
			first_name: billing.firstName,
			last_name: billing.lastName,
			email: billing.email,
			phone: billing.phone,
			address: billing.address,
			city: billing.city,
			state: billing.state,
			postalCode: billing.postalCode,
			country: billing.country,
		},
	});

	// ═══════════════════════════════════════════════════════
	// Step 3 — Resolve cart
	//    For guest users, create cart from request items.
	//    For logged-in users, use the existing cart in DB.
	// ═══════════════════════════════════════════════════════
	let cart: CartWithItems;

	if (validatedData.items && validatedData.items.length > 0) {
		// Guest checkout — build cart from request items
		const courseIds = validatedData.items.map((i) => i.courseId);
		const courses = await prisma.course.findMany({
			where: { id: { in: courseIds } },
			select: { id: true, price: true, discount: true },
		});

		if (courses.length !== courseIds.length) {
			throw new AppError("One or more courses not found", 404);
		}

		// Upsert cart — create one if it doesn't exist for the new guest user
		cart = (await prisma.$transaction(async (tx) => {
			const userCart = await tx.cart.upsert({
				where: { userId: effectiveUserId },
				create: { userId: effectiveUserId },
				update: {},
			});

			// Delete any existing items first (safe for newly created cart too)
			await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });

			const cartItems = await Promise.all(
				validatedData.items!.map((item) =>
					tx.cartItem.create({
						data: {
							cartId: userCart.id,
							courseId: item.courseId,
							quantity: item.quantity ?? 1,
						},
						include: { course: true },
					}),
				),
			);

			return { id: userCart.id, items: cartItems as any[] };
		})) as any;
	} else {
		// Logged-in user — use existing cart from DB
		const existingCart = await prisma.cart.findUnique({
			where: { userId: effectiveUserId },
			include: {
				items: { include: { course: true } },
			},
		});

		if (!existingCart || existingCart.items.length === 0) {
			throw new AppError("Cart is empty", 400);
		}

		cart = existingCart as any;
	}

	// ═══════════════════════════════════════════════════════
	// Step 4 — Calculate amounts
	// ═══════════════════════════════════════════════════════
	const subtotal = cart.items.reduce(
		(sum, item) => sum + Number(item.course.price) * item.quantity,
		0,
	);
	const totalOffer = cart.items.reduce(
		(sum, item) =>
			sum + (Number(item.course.price) - Number(item.course.discount)) * item.quantity,
		0,
	);

	// ═══════════════════════════════════════════════════════
	// Step 5 — Create order (transaction) — same logic as before
	// ═══════════════════════════════════════════════════════
	const result = await prisma.$transaction(async (tx) => {
		const { discountAmount, couponId } = await validateAndApplyCoupon(
			tx,
			couponCode,
			effectiveUserId,
			totalOffer,
		);

		const finalTotal = Math.max(0, totalOffer - discountAmount);

		if (payableAmount !== finalTotal) {
			throw new AppError(
				"Payable amount does not match the calculated total after applying coupon",
				400,
			);
		}

		// ── 1. Create the order ──
		const generatedOrderNumber = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
		const order = await tx.order.create({
			data: {
				userId: effectiveUserId,
				orderNumber: generatedOrderNumber,
				subtotal,
				discount: discountAmount,
				total: finalTotal,
				status: "PENDING",
				items: {
					create: cart.items.map((item) => ({
						courseId: item.courseId,
						unitPrice:
							Number(item.course.price) - Number(item.course.discount),
					})),
				},
			},
			include: { items: { include: { course: true } } },
		});

		// ── 2. Record coupon usage if applied ──
		if (couponId) {
			await tx.couponUsage.create({
				data: {
					couponId,
					userId: effectiveUserId,
					orderId: order.id,
				},
			});

			await tx.coupon.update({
				where: { id: couponId },
				data: { usedCount: { increment: 1 } },
			});
		}

		// ── 3. Create the payment record ──
		const payment = await tx.payment.create({
			data: {
				userId: effectiveUserId,
				amount: order.total,
				currency: "USD",
				paymentType: "FULL_UPFRONT",
				provider: "STRIPE",
				status: "COMPLETED",
				orderId: order.id,
			},
		});

		// ── 3.5 Update order status
		if (payment.status === "COMPLETED") {
			await tx.order.update({
				where: { id: order.id },
				data: { status: "PAID" },
			});
		}

		// ── 4. Create coaching enrollments ──
		await tx.enrollment.createMany({
			data: cart.items.map((item) => ({
				courseId: item.courseId,
				studentId: studentId!,
				orderId: order.id,
			})),
			skipDuplicates: true,
		});

		// ── 5. Clear the cart ──
		await tx.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return order;
	});

	await invalidateCachePattern("orders:*");

	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "Order",
		entityId: result.orderNumber,
		description: `Created order with total $${result.total}`,
		performedById: effectiveUserId,
	});

	// Send order confirmation email (non-blocking)
	const userForEmail = await prisma.user.findUnique({
		where: { id: effectiveUserId },
		select: { email: true, name: true },
	});
	if (userForEmail) {
		const orderItems = result.items.map((item: any) => ({
			courseName: item.course?.title || `Course #${item.courseId}`,
			quantity: 1,
			price: Number(item.unitPrice),
		}));
		emailService
			.sendOrderConfirmationEmail({
				to: userForEmail.email,
				name: userForEmail.name,
				orderId: result.orderNumber,
				total: Number(result.total),
				discount: result.discount ? Number(result.discount) : 0,
				couponCode: couponCode || undefined,
				items: orderItems,
			})
			.catch((err) => {
				console.error("Failed to send order confirmation email:", err);
			});
	}

	const orderItems = result.items.map((item: any) => ({
		...item,
		course: item.course
			? {
					...item.course,
					thumbnail: item.course.thumbnail
						? toPublicUrl(item.course.thumbnail)
						: null,
					video: item.course.video ? toPublicUrl(item.course.video) : null,
				}
			: null,
	}));

	return res.status(201).json({
		success: true,
		data: {
			...result,
			items: orderItems,
			accessToken: isNewUser ? accessToken : undefined,
			refreshToken: isNewUser ? refreshToken : undefined,
		},
		message: "Order created successfully",
	});
});

export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		throw new AppError("User profile not found", 404);
	}

	const { couponCode } = z.object({ couponCode: z.string() }).parse(req.body);

	if (!couponCode) {
		throw new AppError("Coupon code is required", 400);
	}

	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: {
			items: { include: { course: true } },
		},
	});

	if (!cart || cart.items.length === 0) {
		throw new AppError("Cart is empty", 400);
	}

	const totalOffer = cart.items.reduce(
		(sum, item) =>
			sum + (Number(item.course.price) - Number(item.course.discount)) * item.quantity,
		0,
	);

	const { discountAmount, couponCode: code } = await prisma.$transaction(
		async (tx) => validateAndApplyCoupon(tx, couponCode, userId, totalOffer),
	);

	const payableAmount = Math.max(0, totalOffer - discountAmount);

	return res.status(200).json({
		success: true,
		data: {
			couponCode: code,
			subtotal: totalOffer,
			discount: discountAmount,
			payableAmount,
		},
		message: "Coupon applied successfully",
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
					course: {
						select: { title: true, thumbnail: true },
					},
				},
			},
			payments: true,
		},
		orderBy: { createdAt: "desc" },
	});

	// Attach public URLs to course media
	const ordersWithPublicUrls = orders.map((order) => ({
		...order,
		items: order.items.map((item) => ({
			...item,
			course: {
				...item.course,
				thumbnail: item.course.thumbnail
					? toPublicUrl(item.course.thumbnail)
					: null,
			},
		})),
	}));

	return res.status(200).json({
		success: true,
		data: ordersWithPublicUrls,
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
		where: {
			userId,
			id,
		},
		include: {
			items: {
				include: {
					course: {
						include: {
							modules: {
								include: {
									topics: {
										include: { contents: { orderBy: { orderIndex: "asc" } } },
									},
									instructor: {
										select: {
											role: true,
											experienceYears: true,
											subjects: true,
											user: { select: { name: true, image: true } },
										},
									},
								},
							},
							category: { select: { name: true } },
							_count: { select: { enrollments: true } },
						},
					},
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
		data: {
			...order,
			items: order.items.map((item) => ({
				...item,
				course: {
					...item.course,
					thumbnail: item.course.thumbnail
						? toPublicUrl(item.course.thumbnail)
						: null,
					video: item.course.video ? toPublicUrl(item.course.video) : null,
				},
			})),
		},
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
