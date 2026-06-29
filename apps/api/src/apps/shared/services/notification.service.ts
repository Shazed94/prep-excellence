import type { NOTIFICATION_TYPE } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";

export interface SendNotificationInput {
	type: NOTIFICATION_TYPE;
	title: string;
	message: string;
	studentId: string;
	courseId?: string;
	referenceId?: string;
	referenceType?: string;
	actionUrl?: string;
}

class NotificationService {
	/**
	 * Send a notification to a student.
	 */
	async send(input: SendNotificationInput) {
		const notification = await prisma.notification.create({
			data: {
				type: input.type as any,
				title: input.title,
				message: input.message,
				studentId: input.studentId,
				courseId: input.courseId,
				referenceId: input.referenceId,
				referenceType: input.referenceType,
				actionUrl: input.actionUrl,
			},
		});

		return notification;
	}

	/**
	 * Send bulk notifications to multiple students.
	 */
	async sendBulk(inputs: SendNotificationInput[]) {
		const notifications = await prisma.notification.createMany({
			data: inputs.map((input) => ({
				type: input.type as any,
				title: input.title,
				message: input.message,
				studentId: input.studentId,
				courseId: input.courseId,
				referenceId: input.referenceId,
				referenceType: input.referenceType,
				actionUrl: input.actionUrl,
			})),
		});

		return notifications;
	}

	/**
	 * Notify all enrolled students in a course.
	 */
	async notifyAllEnrolled(
		courseId: string,
		input: Omit<SendNotificationInput, "studentId" | "courseId">,
	) {
		const enrollments = await prisma.enrollment.findMany({
			where: { courseId, status: "ACTIVE" },
			select: { studentId: true },
		});

		const notifications = enrollments.map((enrollment) => ({
			...input,
			studentId: enrollment.studentId,
			courseId,
		}));

		if (notifications.length === 0) return { count: 0 };

		const result = await prisma.notification.createMany({
			data: notifications.map((n) => ({
				type: n.type as string,
				title: n.title,
				message: n.message,
				studentId: n.studentId,
				courseId: n.courseId,
				referenceId: n.referenceId,
				referenceType: n.referenceType,
				actionUrl: n.actionUrl,
			})),
		});

		return { count: result.count };
	}

	/**
	 * Get notifications for a student.
	 */
	async listByStudent(
		studentId: string,
		options?: { isRead?: boolean; limit?: number; page?: number },
	) {
		const { isRead, limit = 20, page = 1 } = options || {};
		const skip = (page - 1) * limit;

		const where: any = { studentId };
		if (isRead !== undefined) where.isRead = isRead;

		const [data, total] = await Promise.all([
			prisma.notification.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.notification.count({ where }),
		]);

		return { data, total, page, limit };
	}

	/**
	 * Mark a notification as read.
	 */
	async markAsRead(id: string, studentId: string) {
		return prisma.notification.updateMany({
			where: { id, studentId },
			data: { isRead: true, readAt: new Date() },
		});
	}

	/**
	 * Mark all notifications as read for a student.
	 */
	async markAllAsRead(studentId: string) {
		return prisma.notification.updateMany({
			where: { studentId, isRead: false },
			data: { isRead: true, readAt: new Date() },
		});
	}

	/**
	 * Get unread count for a student.
	 */
	async getUnreadCount(studentId: string): Promise<number> {
		return prisma.notification.count({
			where: { studentId, isRead: false },
		});
	}

	/**
	 * Delete a notification.
	 */
	async delete(id: string, studentId: string) {
		return prisma.notification.deleteMany({
			where: { id, studentId },
		});
	}
}

export const notificationService = new NotificationService();
