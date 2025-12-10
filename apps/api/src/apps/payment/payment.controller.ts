import {
	createPaymentSchema,
	getPaymentHistorySchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

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
					teacherProfile: {
						include: {
							teacher: {
								include: {
									user: { select: { name: true } },
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
		const validated = getPaymentHistorySchema.parse(req.query);
		const {
			studentId,
			status,
			provider,
			startDate,
			endDate,
			page = 1,
			limit = 20,
		} = validated;

		const where: any = {};

		if (studentId) where.studentId = studentId;
		if (status) where.status = status;
		if (provider) where.provider = provider;

		if (startDate || endDate) {
			where.createdAt = {};
			if (startDate) where.createdAt.gte = new Date(startDate);
			if (endDate) where.createdAt.lte = new Date(endDate);
		}

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
							teacherProfile: {
								include: {
									teacher: {
										include: {
											user: { select: { name: true } },
										},
									},
								},
							},
						},
					},
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.payment.count({ where }),
		]);

		res.json({
			success: true,
			data: payments,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	},
);

/**
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

		res.json({
			success: true,
			data: updatedPayment,
		});
	},
);
