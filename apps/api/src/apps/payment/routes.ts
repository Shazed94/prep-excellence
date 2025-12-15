import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireStaff } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import * as paymentController from "./payment.controller";
import * as refundController from "./refund.controller";

const router = Router();

// Payment routes

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Create a payment
 *     description: Create a new payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 99.99
 *               type:
 *                 type: string
 *                 enum: [COURSE, SESSION, SERVICE]
 *               itemId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/payments", authenticate, paymentController.createPayment);

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Get payment history
 *     description: Retrieve payment history for authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/payments", authenticate, paymentController.getPaymentHistory);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     description: Retrieve details of a specific payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/payments/:id",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	paymentController.getPayment,
);

/**
 * @swagger
 * /api/v1/payments/{id}/status:
 *   post:
 *     summary: Update payment status
 *     description: Update the status of a payment (requires PAYMENT.CHANGE permission)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/payments/:id/status",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.CHANGE),
	paymentController.updatePaymentStatus,
);

// Refund routes

/**
 * @swagger
 * /api/v1/payments/{paymentId}/refunds:
 *   post:
 *     summary: Request a refund
 *     description: Submit a refund request for a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Service not satisfactory
 *     responses:
 *       201:
 *         description: Refund request submitted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/payments/:paymentId/refunds",
	authenticate,
	refundController.requestRefund,
);

/**
 * @swagger
 * /api/v1/refunds:
 *   get:
 *     summary: Get all refund requests
 *     description: Retrieve all refund requests (requires PAYMENT.VIEW permission)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Refund requests retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/refunds",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	refundController.getRefundRequests,
);

/**
 * @swagger
 * /api/v1/refunds/{id}:
 *   get:
 *     summary: Get refund by ID
 *     description: Retrieve details of a specific refund request
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refund retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/refunds/:id",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	refundController.getRefund,
);

/**
 * @swagger
 * /api/v1/refunds/{id}/approve:
 *   patch:
 *     summary: Approve refund request
 *     description: Approve a refund request (staff only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refund approved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/refunds/:id/approve",
	requireStaff(),
	refundController.approveRefund,
);

/**
 * @swagger
 * /api/v1/refunds/{id}/reject:
 *   patch:
 *     summary: Reject refund request
 *     description: Reject a refund request (staff only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund rejected successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
	"/refunds/:id/reject",
	requireStaff(),
	refundController.rejectRefund,
);

export default router;
