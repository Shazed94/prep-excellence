import { Bell, Check } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	useGetNotifications,
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
	useUnreadNotificationCount,
} from "@/hooks/notifications";

/**
 * Student notification bell — lives in the dashboard header.
 * Backed by the /api/v1/notifications endpoints.
 */
export default function NotificationBell() {
	const { data: unread } = useUnreadNotificationCount();
	const { data, isLoading } = useGetNotifications(false);
	const markAll = useMarkAllNotificationsRead();
	const markOne = useMarkNotificationRead();

	const notifications = data?.data ?? [];
	const unreadCount = unread ?? 0;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="Notifications"
					className="relative flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
				>
					<Bell size={18} />
					{unreadCount > 0 && (
						<span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-80 p-0 text-foreground"
				sideOffset={8}
			>
				<div className="flex items-center justify-between border-b border-border px-4 py-3">
					<p className="font-switzer text-sm font-semibold">Notifications</p>
					{unreadCount > 0 && (
						<button
							type="button"
							onClick={() => markAll.mutate()}
							className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark"
						>
							<Check size={12} /> Mark all read
						</button>
					)}
				</div>

				<div className="max-h-96 overflow-y-auto">
					{isLoading ? (
						<div className="space-y-2 p-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-12 animate-pulse rounded-md bg-muted/10"
								/>
							))}
						</div>
					) : notifications.length === 0 ? (
						<div className="flex flex-col items-center gap-2 py-10 text-center">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
								<Bell size={18} className="text-primary/50" />
							</div>
							<p className="text-sm text-muted">No notifications yet</p>
						</div>
					) : (
						<ul className="divide-y divide-border">
							{notifications.map((n) => (
								<li key={n.id}>
									<button
										type="button"
										onClick={() => !n.isRead && markOne.mutate(n.id)}
										className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/5 ${
											n.isRead ? "" : "bg-primary-light/40"
										}`}
									>
										<div className="flex w-full items-center justify-between gap-2">
											<span className="text-sm font-medium text-foreground">
												{n.title}
											</span>
											{!n.isRead && (
												<span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
											)}
										</div>
										<span className="text-xs text-muted">{n.message}</span>
										<span className="mt-0.5 text-[11px] text-muted/70">
											{new Date(n.createdAt).toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
