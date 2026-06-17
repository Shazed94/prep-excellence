import {
	approveRefundSchema,
	createRefundSchema,
	rejectRefundSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireStaff } from "@/middleware/authorize";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import * as paymentController from "./order.controller";
import * as refundController from "./refund.controller";

const router = Router();

// ==================== Cart Routes ====================

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get or create cart
 *     description: Retrieve the current user's cart or create one if it doesn't exist
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       201:
 *         description: Cart created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/cart", authenticate, paymentController.getOrCreateCart);

/**
 * @swagger
 * /api/v1/cart/items:
 *   post:
 *     summary: Add item to cart
 *     description: Add a course to the user's cart or increment quantity if already present
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the coaching course to add
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/cart/items", authenticate, paymentController.addToCart);

/**
 * @swagger
 * /api/v1/cart/items:
 *   delete:
 *     summary: Clear cart items
 *     description: Remove all items from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All items removed from cart successfully
 *       404:
 *         description: Cart not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/cart/items", authenticate, paymentController.clearCartItems);

// ==================== Order Routes ====================

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create an order
 *     description: Create an order from the user's cart items, process payment, and enroll in courses
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 *       404:
 *         description: User profile not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/orders", authenticate, paymentController.createOrder);

/**
 * @swagger
 * /api/v1/orders/my:
 *   get:
 *     summary: Get my orders
 *     description: Retrieve the authenticated user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/orders/my", authenticate, paymentController.getMyOrders);

/**
 * @swagger
 * /api/v1/orders/my/{id}:
 *   get:
 *     summary: Get my order by ID
 *     description: Retrieve a specific order of the authenticated user by ID
 *     tags: [Orders]
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
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/orders/my/:id",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	authenticate,
	paymentController.getMyOrder,
);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     description: Retrieve paginated order history with filtering and caching (requires PAYMENT.VIEW permission)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, FAILED, CANCELLED, REFUNDED]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/orders",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	paymentController.getOrders,
);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID (Admin)
 *     description: Retrieve a specific order with full details (requires PAYMENT.VIEW permission)
 *     tags: [Orders]
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
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/orders/:id",
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	paymentController.getOrder,
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
	validateId(z.object({ paymentId: z.cuid({ message: "Invalid paymentId" }) })),
	validate(createRefundSchema),
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
	validateQuery(ZQueryParams),
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
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
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
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	validate(approveRefundSchema),
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
	validateId(z.object({ id: z.cuid({ message: "Invalid id" }) })),
	validate(rejectRefundSchema),
	requireStaff(),
	refundController.rejectRefund,
);

export default router;
