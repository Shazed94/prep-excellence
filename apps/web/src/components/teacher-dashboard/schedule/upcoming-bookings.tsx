import { Clock, MapPin, Video } from "lucide-react";
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig = {
	confirmed: {
		label: "Confirmed",
		className: "bg-green-100 text-green-700 border-green-200",
	},
	pending: {
		label: "Pending",
		className: "bg-blue-100 text-blue-700 border-blue-200",
	},
	rescheduled: {
		label: "Rescheduled",
		className: "bg-orange-100 text-orange-700 border-orange-200",
	},
	cancelled: {
		label: "Cancelled",
		className: "bg-red-100 text-red-700 border-red-200",
	},
	completed: {
		label: "Completed",
		className: "bg-gray-100 text-gray-700 border-gray-200",
	},
};

export function UpcomingBookings() {
	const bookedSessions = useScheduleStore((s) => s.bookedSessions);
	const openBookingDetails = useScheduleStore((s) => s.openBookingDetails);

	const upcoming = bookedSessions
		.filter((s) => s.status === "confirmed" || s.status === "pending")
		.sort((a, b) => {
			const dateA = new Date(`${a.date}T${a.startTime}`);
			const dateB = new Date(`${b.date}T${b.startTime}`);
			return dateA.getTime() - dateB.getTime();
		})
		.slice(0, 5);

	if (upcoming.length === 0) {
		return (
			<div className="px-4 py-3 text-center">
				<p className="text-xs text-muted-foreground">No upcoming bookings</p>
			</div>
		);
	}

	return (
		<div className="space-y-2 px-4">
			{upcoming.map((booking) => {
				const [hour, minute] = booking.startTime.split(":").map(Number);
				const period = hour >= 12 ? "PM" : "AM";
				const adjustedHour = hour % 12 || 12;
				const timeStr = `${adjustedHour}:${String(minute).padStart(2, "0")} ${period}`;
				const config = statusConfig[booking.status];

				return (
					<button
						key={booking.id}
						type="button"
						onClick={() => openBookingDetails(booking)}
						className="w-full text-left p-2.5 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer"
					>
						<div className="flex items-start justify-between gap-2">
							<p className="text-sm font-medium text-foreground truncate">
								{booking.studentName}
							</p>
							<Badge
								variant="outline"
								className={`text-[10px] px-1.5 py-0 leading-none ${config.className}`}
							>
								{config.label}
							</Badge>
						</div>
						<div className="flex items-center gap-1.5 mt-1.5">
							<Clock className="size-3 text-muted-foreground shrink-0" />
							<span className="text-xs text-muted-foreground">
								{timeStr} · {booking.duration}min
							</span>
						</div>
						<div className="flex items-center gap-1.5 mt-0.5">
							{booking.isOnline ? (
								<Video className="size-3 text-muted-foreground shrink-0" />
							) : (
								<MapPin className="size-3 text-muted-foreground shrink-0" />
							)}
							<span className="text-xs text-muted-foreground truncate">
								{booking.sessionType}
							</span>
						</div>
					</button>
				);
			})}
			<Button variant="ghost" size="sm" className="w-full text-xs text-primary">
				View all bookings
			</Button>
		</div>
	);
}
