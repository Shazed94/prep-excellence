import {
	createPaymentSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere } from "@/utils/filters";

/**
 * Create Payment
 * POST /api/payments
 *
 * Creates a payment record and initiates Stripe checkout
 */
export const createPayment = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createPaymentSchema.parse(req.body);
		const {
			amount,
			paymentType,
			provider = "STRIPE",
			lmsEnrollmentId,
			coachingEnrollmentId,
			oneToOneSessionId,
		} = validated;

		// Get studentId from authenticated user
		const studentId = req.user?.student?.id;
		if (!studentId) {
			throw new AppError("Student profile not found", 404);
		}

		// Validate that exactly one reference is provided
		const references = [
			lmsEnrollmentId,
			coachingEnrollmentId,
			oneToOneSessionId,
		].filter(Boolean);
		if (references.length !== 1) {
			throw new AppError(
				"Exactly one of lmsEnrollmentId, coachingEnrollmentId, or oneToOneSessionId must be provided",
				400,
			);
		}

		// Create payment record
		const payment = await prisma.payment.create({
			data: {
				studentId,
				amount,
				paymentType,
				provider,
				status: "PENDING",
				lmsEnrollmentId,
				coachingEnrollmentId,
				oneToOneSessionId,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Payment",
			entityId: payment.id,
			description: `Created payment of $${amount} via ${provider}`,
			performedById: req.user?.id,
		});

		// TODO: Integrate with Stripe/PayPal
		// For now, return payment details
		res.status(201).json({
			success: true,
			data: payment,
			message: "Payment initiated. Complete payment via payment provider.",
		});
	},
);

/**
 * Get Payment Details
 * GET /api/payments/:id
 */
export const getPayment = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const payment = await prisma.payment.findUnique({
		where: { id },
		include: {
			student: {
				include: {
					user: { select: { name: true, email: true } },
				},
			},
			lmsEnrollment: {
				include: {
					course: { select: { title: true } },
				},
			},
			coachingEnrollment: {
				include: {
					course: { select: { title: true } },
				},
			},
			oneToOneSession: {
				include: {
					teacherAvailability: {
						include: {
							profile: {
								include: {
									teacher: {
										include: {
											user: { select: { name: true, email: true } },
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	if (!payment) {
		throw new AppError("Payment not found", 404);
	}

	res.json({
		success: true,
		data: payment,
	});
});

/**
 * Get Payment History
 * GET /api/payments
 */
export const getPaymentHistory = asyncHandler(
	async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;

		const cacheKey = `payments:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Payments fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS = [
			"studentId",
			"status",
			"provider",
			"startDate",
			"endDate",
		];
		const where = buildWhere(filters, ALLOWED_FILTERS);

		if (filters?.startDate || filters?.endDate) {
			where.createdAt = {};
			if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
			if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [payments, total] = await Promise.all([
			prisma.payment.findMany({
				where,
				include: {
					student: {
						include: {
							user: { select: { name: true } },
						},
					},
					lmsEnrollment: {
						include: {
							course: { select: { title: true } },
						},
					},
					coachingEnrollment: {
						include: {
							course: { select: { title: true } },
						},
					},
					oneToOneSession: {
						include: {
							teacherAvailability: {
								include: {
									profile: {
										include: {
											teacher: {
												include: {
													user: { select: { name: true, email: true } },
												},
											},
										},
									},
								},
							},
						},
					},
				},
				skip,
				take: limit,
				orderBy: orderClause,
			}),
			prisma.payment.count({ where }),
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
			JSON.stringify({ data: payments, pagination }),
			60,
		);

		return res.json({
			success: true,
			data: payments,
			pagination,
		});
	},
); /**
 * Update Payment Status (Webhook handler)
 * POST /api/payments/:id/status
 *
 * This should be called by payment provider webhooks
 */
export const updatePaymentStatus = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { status, stripePaymentId } = req.body;

		const payment = await prisma.payment.findUnique({
			where: { id },
			include: {
				lmsEnrollment: true,
				coachingEnrollment: {
					include: { paymentPlan: true },
				},
				oneToOneSession: true,
			},
		});

		if (!payment) {
			throw new AppError("Payment not found", 404);
		}

		// Update payment
		const updatedPayment = await prisma.payment.update({
			where: { id },
			data: {
				status,
				stripePaymentId,
				paidAt: status === "COMPLETED" ? new Date() : null,
			},
		});

		// Handle side effects based on payment type
		if (status === "COMPLETED") {
			if (payment.lmsEnrollmentId) {
				// Activate LMS enrollment
				await prisma.lMSEnrollment.update({
					where: { id: payment.lmsEnrollmentId },
					data: { status: "ACTIVE" },
				});
			} else if (payment.coachingEnrollmentId && payment.coachingEnrollment) {
				// Handle installment payment for coaching
				if (payment.paymentType === "INSTALLMENT") {
					const paymentPlan = payment.coachingEnrollment.paymentPlan;
					if (paymentPlan) {
						const installments = paymentPlan.installments as any[];
						const paidInstallments = installments.filter(
							(i) => i.status === "PAID",
						);
						const totalPercentage = paidInstallments.reduce(
							(sum, i) => sum + (i.percentage || 0),
							0,
						);

						// Update payment plan
						await prisma.paymentPlan.update({
							where: { id: paymentPlan.id },
							data: {
								unlockedPercent: totalPercentage,
							},
						});

						// Activate enrollment if first payment
						if (paidInstallments.length === 1) {
							await prisma.coachingEnrollment.update({
								where: { id: payment.coachingEnrollmentId },
								data: { status: "ACTIVE" },
							});
						}
					}
				} else {
					// Full payment
					await prisma.coachingEnrollment.update({
						where: { id: payment.coachingEnrollmentId },
						data: { status: "ACTIVE" },
					});
				}
			} else if (payment.oneToOneSessionId) {
				// Activate one-to-one session
				await prisma.oneToOneSession.update({
					where: { id: payment.oneToOneSessionId },
					data: { status: "SCHEDULED" },
				});
			}
		}

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Payment",
			entityId: updatedPayment.id,
			description: `Updated payment status to ${status}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("payments:*");

		res.json({
			success: true,
			data: updatedPayment,
		});
	},
);
