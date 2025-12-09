import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireStaff } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import * as paymentController from "./payment.controller";
import * as refundController from "./refund.controller";

const router = Router();

// Payment routes
router.post("/payments", authenticate, paymentController.createPayment); // Students only
router.get("/payments", authenticate, paymentController.getPaymentHistory); // Own payments
router.get(
	"/payments/:id",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	paymentController.getPayment,
);
router.post(
	"/payments/:id/status",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.CHANGE),
	paymentController.updatePaymentStatus,
);

// Refund routes
router.post(
	"/payments/:paymentId/refunds",
	authenticate,
	refundController.requestRefund,
); // Students only
router.get(
	"/refunds",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	refundController.getRefundRequests,
);
router.get(
	"/refunds/:id",
	authenticate,
	authorize(PERMISSIONS.PAYMENT.VIEW),
	refundController.getRefund,
);
router.patch(
	"/refunds/:id/approve",
	requireStaff(),
	refundController.approveRefund,
); // Staff only
router.patch(
	"/refunds/:id/reject",
	requireStaff(),
	refundController.rejectRefund,
); // Staff only

export default router;
