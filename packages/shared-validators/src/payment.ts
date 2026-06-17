import { z } from "zod";

// ============= Payment Processing Validators =============
export const createPaymentSchema = z
	.object({
		amount: z.number().min(0, "Amount must be non-negative"),
		currency: z.string().default("USD"),
		paymentType: z.enum(["FULL_UPFRONT", "INSTALLMENT", "PER_SESSION"]),
		provider: z.enum(["STRIPE", "PAYPAL", "MANUAL"]).default("STRIPE"),

		// Polymorphic relationships (provide one of these)
		lmsEnrollmentId: z.cuid().optional(),
		oneToOneSessionId: z.cuid().optional(),
	})
	.refine(
		(data) => {
			const provided = [data.lmsEnrollmentId, data.oneToOneSessionId].filter(
				Boolean,
			);
			return provided.length === 1;
		},
		{
			message:
				"Exactly one of lmsEnrollmentId, coachingEnrollmentId, or oneToOneSessionId must be provided",
		},
	);

export const processPaymentWebhookSchema = z.object({
	provider: z.enum(["STRIPE", "PAYPAL"]),
	eventType: z.string(),
	paymentId: z.string(),
	status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED", "PARTIAL"]),
	metadata: z.record(z.any(), z.any()).optional(),
});

// ============= Payment Plan Validators =============
export const createPaymentPlanSchema = z.object({
	totalAmount: z.number().min(0),
	currency: z.string().default("USD"),
	installments: z
		.array(
			z.object({
				installmentNumber: z.number().int().positive(),
				amount: z.number().min(0),
				dueDate: z.string().datetime(),
				percentage: z.number().int().min(0).max(100),
			}),
		)
		.min(1, "At least one installment required")
		.refine(
			(installments) => {
				const totalPercent = installments.reduce(
					(sum, i) => sum + i.percentage,
					0,
				);
				return totalPercent === 100;
			},
			{ message: "Installment percentages must sum to 100%" },
		),
	coachingEnrollmentId: z.string().cuid(),
});

export const payInstallmentSchema = z.object({
	paymentPlanId: z.string().cuid(),
	installmentNumber: z.number().int().positive(),
});

export const updatePaymentPlanSchema = z.object({
	paymentPlanId: z.string().cuid(),
	installments: z
		.array(
			z.object({
				installmentNumber: z.number().int().positive(),
				amount: z.number().min(0),
				dueDate: z.string().datetime(),
				percentage: z.number().int().min(0).max(100),
				status: z.enum(["pending", "paid", "overdue", "cancelled"]).optional(),
			}),
		)
		.optional(),
});

// ============= Invoice Validators =============
export const createInvoiceSchema = z.object({
	paymentId: z.string().cuid(),
	subtotal: z.number().min(0),
	tax: z.number().min(0).default(0),
	discount: z.number().min(0).default(0),
	total: z.number().min(0),
	currency: z.string().default("USD"),
	items: z
		.array(
			z.object({
				description: z.string(),
				quantity: z.number().int().positive().default(1),
				unitPrice: z.number().min(0),
				amount: z.number().min(0),
			}),
		)
		.min(1),
	notes: z.string().optional(),
	terms: z.string().optional(),
	dueDate: z.string().datetime().optional(),
});

export const generateInvoicePDFSchema = z.object({
	invoiceId: z.string().cuid(),
});

// ============= Refund Validators =============
export const createRefundSchema = z.object({
	paymentId: z.string().cuid(),
	amount: z.number().min(0),
	currency: z.string().default("USD"),
	reason: z.string().min(10, "Reason must be at least 10 characters"),
	internalNotes: z.string().optional(),
	studentNotes: z.string().optional(),
});

export const processRefundSchema = z.object({
	refundId: z.string().cuid(),
	status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
	stripeRefundId: z.string().optional(),
	paypalRefundId: z.string().optional(),
});

export const approveRefundSchema = z.object({
	refundId: z.string().cuid(),
	internalNotes: z.string().optional(),
});

export const rejectRefundSchema = z.object({
	refundId: z.string().cuid(),
	rejectionReason: z.string().min(10, "Please provide a reason for rejection"),
});

// ============= Payment History & Reports =============
export const getPaymentHistorySchema = z.object({
	studentId: z.string().cuid().optional(),
	status: z
		.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED", "PARTIAL"])
		.optional(),
	provider: z.enum(["STRIPE", "PAYPAL", "MANUAL"]).optional(),
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional(),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
});

export const getPaymentReportsSchema = z.object({
	reportType: z.enum(["daily", "weekly", "monthly", "yearly"]),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	groupBy: z.enum(["course", "student", "provider", "paymentType"]).optional(),
});

// ============= Stripe Integration Validators =============
export const createStripeCheckoutSchema = z.object({
	amount: z.number().min(0),
	currency: z.string().default("usd"),
	productName: z.string(),
	productImage: z.string().url().optional(),
	successUrl: z.string().url(),
	cancelUrl: z.string().url(),
	metadata: z.record(z.string(), z.string()).optional(),
});

export const handleStripeWebhookSchema = z.object({
	signature: z.string(),
	payload: z.string(),
});

// ============= Order Validators =============
export const createOrderSchema = z.object({
	couponCode: z.string().optional(),
	payableAmount: z.number().min(0),
});

// ============= Coupon Validators =============
export const createCouponSchema = z.object({
	code: z.string().min(1, "Coupon code is required").toUpperCase(),
	discountType: z.enum(["PERCENT", "FIXED"]).default("PERCENT"),
	value: z.number().min(0, "Value must be non-negative"),
	maxUses: z.number().int().min(1).optional(),
	minOrderAmount: z.number().min(0).optional(),
	expiresAt: z.coerce.date().optional(),
	isActive: z.boolean().optional().default(true),
});

export const updateCouponSchema = z.object({
	code: z.string().min(1).toUpperCase().optional(),
	discountType: z.enum(["PERCENT", "FIXED"]).optional(),
	value: z.number().min(0).optional(),
	maxUses: z.number().int().min(1).optional().nullable(),
	minOrderAmount: z.number().min(0).optional().nullable(),
	expiresAt: z.coerce.date().optional().nullable(),
	isActive: z.boolean().optional(),
});

// ============= Type Exports =============
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type CreatePaymentPlanInput = z.infer<typeof createPaymentPlanSchema>;
export type PayInstallmentInput = z.infer<typeof payInstallmentSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CreateRefundInput = z.infer<typeof createRefundSchema>;
export type ProcessRefundInput = z.infer<typeof processRefundSchema>;
export type GetPaymentHistoryInput = z.infer<typeof getPaymentHistorySchema>;
export type CreateStripeCheckoutInput = z.infer<
	typeof createStripeCheckoutSchema
>;
