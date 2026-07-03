import type { Request, Response } from "express";
import { notificationService } from "@/apps/shared/services/notification.service";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Student-facing notification endpoints.
 *
 * Notifications are stored per-student (see `notification.service.ts`). These
 * endpoints expose the service that was previously wired to nothing, so the
 * student dashboard can list, count and mark notifications.
 */

function requireStudentId(req: Request): string {
	const studentId = req.user?.student?.id;
	if (!studentId) {
		throw new AppError("Student profile not found", 404);
	}
	return studentId;
}

/** GET /notifications?unreadOnly=true&page=1&limit=20 */
export const listNotifications = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = requireStudentId(req);
		const { unreadOnly, page, limit } = req.query as Record<string, string>;

		const result = await notificationService.listByStudent(studentId, {
			isRead: unreadOnly === "true" ? false : undefined,
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 20,
		});

		return res.json({ success: true, ...result });
	},
);

/** GET /notifications/unread-count */
export const getUnreadCount = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = requireStudentId(req);
		const count = await notificationService.getUnreadCount(studentId);
		return res.json({ success: true, data: { count } });
	},
);

/** PATCH /notifications/:id/read */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
	const studentId = requireStudentId(req);
	const { id } = req.params;
	await notificationService.markAsRead(id, studentId);
	return res.json({ success: true });
});

/** PATCH /notifications/read-all */
export const markAllAsRead = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = requireStudentId(req);
		await notificationService.markAllAsRead(studentId);
		return res.json({ success: true });
	},
);

/** DELETE /notifications/:id */
export const deleteNotification = asyncHandler(
	async (req: Request, res: Response) => {
		const studentId = requireStudentId(req);
		const { id } = req.params;
		await notificationService.delete(id, studentId);
		return res.json({ success: true });
	},
);
