import {
	approveRefundSchema,
	createRefundSchema,
	rejectRefundSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

/**
 * Request Refund
 * POST /api/payments/:paymentId/refunds
 */
export const requestRefund = asyncHandler(
	async (req: Request, res: Response) => {
		const { paymentId } = req.params;
		const validated = createRefundSchema.parse(req.body);
		const { amount, reason } = validated;

		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
		});

		if (!payment) {
			throw new AppError("Payment not found", 404);
		}

		if (payment.status !== "COMPLETED") {
			throw new AppError("Can only refund completed payments", 400);
		}

		// Check if amount is valid
		if (amount > payment.amount.toNumber()) {
			throw new AppError("Refund amount cannot exceed payment amount", 400);
		}

		// Check if refund already exists
		const existingRefund = await prisma.refund.findFirst({
			where: {
				paymentId,
				status: "PENDING",
			},
		});

		if (existingRefund) {
			throw new AppError("Refund request already exists for this payment", 409);
		}

		const refund = await prisma.refund.create({
			data: {
				paymentId,
				// studentId: payment.studentId,
				amount,
				reason,
				status: "PENDING",
			},
			include: {
				payment: {
					include: {
						lmsEnrollment: {
							include: { course: { select: { title: true } } },
						},
					},
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Refund",
			entityId: refund.id,
			description: `Requested refund of $${amount}: ${reason}`,
			performedById: req.user?.id,
		});

		res.status(201).json({
			success: true,
			data: refund,
			message: "Refund request submitted for review",
		});
	},
);

/**
 * Get Refund Requests
 * GET /api/refunds
 */
export const getRefundRequests = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId, status, page = 1, limit = 20 } = req.query;

		const where: any = {};

		if (studentId) where.studentId = studentId;
		if (status) where.status = status;

		const [refunds, total] = await Promise.all([
			prisma.refund.findMany({
				where,
				include: {
					// student: {
					// 	include: {
					// 		user: { select: { name: true, email: true } },
					// 	},
					// },
					payment: {
						include: {
							lmsEnrollment: {
								include: { course: { select: { title: true } } },
							},
						},
					},
					processedBy: {
						select: { name: true },
					},
				},
				skip: (Number(page) - 1) * Number(limit),
				take: Number(limit),
				orderBy: { createdAt: "desc" },
			}),
			prisma.refund.count({ where }),
		]);

		res.json({
			success: true,
			data: refunds,
			pagination: {
				page: Number(page),
				limit: Number(limit),
				total,
				totalPages: Math.ceil(total / Number(limit)),
			},
		});
	},
);

/**
 * Get Refund Details
 * GET /api/refunds/:id
 */
// export const getRefund = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;

//   const refund = await prisma.refund.findUnique({
//     where: { id },
//     include: {
//       // student: {
//       // 	include: {
//       // 		user: { select: { name: true, email: true } },
//       // 	},
//       // },
//       payment: {
//         include: {
//           lmsEnrollment: {
//             include: { course: { select: { title: true } } },
//           },
//           coachingEnrollment: {
//             include: { course: { select: { title: true } } },
//           },
//           oneToOneSession: {
//             include: {
//               teacherAvailability: {
//                 include: {
//                   profile: {
//                     include: {
//                       teacher: {
//                         include: {
//                           user: { select: { name: true, email: true } },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       processedBy: {
//         select: { name: true },
//       },
//     },
//   });

//   if (!refund) {
//     throw new AppError("Refund not found", 404);
//   }

//   res.json({
//     success: true,
//     data: refund,
//   });
// });

/**
 * Approve Refund
 * PATCH /api/refunds/:id/approve
 */
export const approveRefund = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = approveRefundSchema.parse(req.body);
		const { internalNotes } = validated;
		const processedById = req.user?.id;

		const refund = await prisma.refund.findUnique({
			where: { id },
			include: {
				payment: true,
			},
		});

		if (!refund) {
			throw new AppError("Refund not found", 404);
		}

		if (refund.status !== "PENDING") {
			throw new AppError("Can only approve pending refunds", 400);
		}

		// Update refund status
		const updatedRefund = await prisma.refund.update({
			where: { id },
			data: {
				status: "COMPLETED",
				processedById,
				processedAt: new Date(),
				internalNotes,
			},
		});

		// TODO: Process actual refund via payment provider
		// For now, just update the payment status
		await prisma.payment.update({
			where: { id: refund.paymentId },
			data: {
				status: "REFUNDED",
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Refund",
			entityId: updatedRefund.id,
			description: `Approved refund of $${refund.amount.toNumber()}`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			data: updatedRefund,
			message: "Refund approved and processed",
		});
	},
);

/**
 * Reject Refund
 * PATCH /api/refunds/:id/reject
 */
export const rejectRefund = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const validated = rejectRefundSchema.parse(req.body);
		const { rejectionReason } = validated;
		const processedById = req.user?.id;

		if (!processedById) {
			throw new AppError("processedById is required", 400);
		}

		const refund = await prisma.refund.findUnique({
			where: { id },
		});

		if (!refund) {
			throw new AppError("Refund not found", 404);
		}

		if (refund.status !== "PENDING") {
			throw new AppError("Can only reject pending refunds", 400);
		}

		const updatedRefund = await prisma.refund.update({
			where: { id },
			data: {
				status: "FAILED",
				processedById,
				processedAt: new Date(),
				internalNotes: rejectionReason,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Refund",
			entityId: updatedRefund.id,
			description: `Rejected refund: ${rejectionReason}`,
			performedById: req.user?.id,
		});

		res.json({
			success: true,
			data: updatedRefund,
			message: "Refund request rejected",
		});
	},
);
