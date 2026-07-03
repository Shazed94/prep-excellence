import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as notificationController from "./notification.controller";

const router = Router();

// All notification endpoints are for the authenticated student.
router.get("/", authenticate, notificationController.listNotifications);
router.get(
	"/unread-count",
	authenticate,
	notificationController.getUnreadCount,
);
router.patch("/read-all", authenticate, notificationController.markAllAsRead);
router.patch("/:id/read", authenticate, notificationController.markAsRead);
router.delete("/:id", authenticate, notificationController.deleteNotification);

export default router;
