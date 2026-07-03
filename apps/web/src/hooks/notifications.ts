import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/**
 * Student notification hooks (backend: /api/v1/notifications).
 * Wire these into a notification bell in the student dashboard.
 */

export interface AppNotification {
	id: string;
	type: string;
	title: string;
	message: string;
	isRead: boolean;
	readAt?: string | null;
	referenceId?: string | null;
	referenceType?: string | null;
	actionUrl?: string | null;
	courseId?: string | null;
	createdAt: string;
}

const KEYS = {
	list: (unreadOnly: boolean) => ["notifications", "list", unreadOnly] as const,
	unread: ["notifications", "unread-count"] as const,
};

export function useGetNotifications(unreadOnly = false) {
	return useQuery({
		queryKey: KEYS.list(unreadOnly),
		queryFn: async (): Promise<{ data: AppNotification[]; total: number }> => {
			const res = await axiosInstance.get("/notifications", {
				params: unreadOnly ? { unreadOnly: true } : {},
			});
			return res.data;
		},
	});
}

export function useUnreadNotificationCount() {
	return useQuery({
		queryKey: KEYS.unread,
		queryFn: async (): Promise<number> => {
			const res = await axiosInstance.get("/notifications/unread-count");
			return res.data?.data?.count ?? 0;
		},
		refetchInterval: 60_000,
	});
}

export function useMarkNotificationRead() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await axiosInstance.patch(`/notifications/${id}/read`);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}

export function useMarkAllNotificationsRead() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await axiosInstance.patch("/notifications/read-all");
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}
