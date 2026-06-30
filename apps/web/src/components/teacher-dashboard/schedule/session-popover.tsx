import {
	Circle,
	CircleCheck,
	Clock,
	DollarSign,
	MapPin,
	Video,
} from "lucide-react";
import type { BookedSession } from "@/components/teacher-dashboard/schedule/types";
import { Badge } from "@/components/ui/badge";

interface SessionPopoverProps {
	session: BookedSession;
}

const statusConfig = {
	confirmed: { label: "Confirmed", className: "bg-green-100 text-green-700" },
	pending: { label: "Pending", className: "bg-blue-100 text-blue-700" },
	rescheduled: {
		label: "Rescheduled",
		className: "bg-orange-100 text-orange-700",
	},
	cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
	completed: { label: "Completed", className: "bg-gray-100 text-gray-700" },
};

export function SessionPopover({ session }: SessionPopoverProps) {
	const [startHour, startMinute] = session.startTime.split(":").map(Number);
	const startPeriod = startHour >= 12 ? "PM" : "AM";
	const startAdjusted = startHour % 12 || 12;
	const startStr = `${startAdjusted}:${String(startMinute).padStart(2, "0")} ${startPeriod}`;

	const [endHour, endMinute] = session.endTime.split(":").map(Number);
	const endPeriod = endHour >= 12 ? "PM" : "AM";
	const endAdjusted = endHour % 12 || 12;
	const endStr = `${endAdjusted}:${String(endMinute).padStart(2, "0")} ${endPeriod}`;

	const config = statusConfig[session.status];

	return (
		<div className="space-y-2.5 p-1">
			<div className="flex items-center justify-between gap-2">
				<p className="text-sm font-semibold text-foreground">
					{session.studentName}
				</p>
				<Badge
					variant="outline"
					className={`text-[10px] px-1.5 py-0 leading-none ${config.className}`}
				>
					{config.label}
				</Badge>
			</div>

			<p className="text-xs text-muted-foreground">{session.sessionType}</p>

			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<Clock className="size-3 shrink-0" />
				<span>
					{startStr} - {endStr}
				</span>
			</div>

			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				{session.isOnline ? (
					<Video className="size-3 shrink-0" />
				) : (
					<MapPin className="size-3 shrink-0" />
				)}
				<span>{session.isOnline ? "Online" : "In-person"}</span>
			</div>

			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				{session.paymentStatus === "paid" ? (
					<CircleCheck className="size-3 shrink-0 text-green-600" />
				) : (
					<Circle className="size-3 shrink-0 text-amber-500" />
				)}
				<span>
					{session.paymentStatus === "paid"
						? "Paid"
						: session.paymentStatus === "pending"
							? "Payment Pending"
							: "Refunded"}
				</span>
			</div>

			{session.rate && (
				<div className="flex items-center gap-1.5 text-xs">
					<DollarSign className="size-3 shrink-0 text-green-600" />
					<span className="font-semibold text-green-700">
						${session.totalAmount?.toFixed(2)} @ ${session.rate}/hr
					</span>
				</div>
			)}
		</div>
	);
}
