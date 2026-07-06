import {
	Calendar,
	CheckCircle2,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	Mail,
	MapPin,
	MessageSquare,
	Phone,
	RotateCcw,
	Video,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useScheduleStore } from "../store";

const statusConfig = {
	confirmed: {
		label: "Confirmed",
		className: "bg-green-100 text-green-700 border-green-200",
	},
	pending: {
		label: "Pending Confirmation",
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

export function BookingDetailsModal() {
	const { bookingDetailsOpen, selectedBooking, closeBookingDetails } =
		useScheduleStore();

	if (!selectedBooking) return null;

	const config = statusConfig[selectedBooking.status];

	const formatTime12 = (time: string) => {
		const [h, m] = time.split(":").map(Number);
		const period = h >= 12 ? "PM" : "AM";
		const adjusted = h % 12 || 12;
		return `${adjusted}:${String(m).padStart(2, "0")} ${period}`;
	};

	return (
		<Dialog open={bookingDetailsOpen} onOpenChange={closeBookingDetails}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Session with {selectedBooking.studentName}
						<Badge variant="outline" className={`text-xs ${config.className}`}>
							{config.label}
						</Badge>
					</DialogTitle>
					<DialogDescription className="flex items-center gap-2">
						{selectedBooking.sessionType}
						{selectedBooking.rate && (
							<span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
								${selectedBooking.totalAmount?.toFixed(2)}
							</span>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								<Calendar className="size-3" />
								Date
							</p>
							<p className="text-sm font-medium">
								{new Date(
									`${selectedBooking.date}T00:00:00`,
								).toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
									year: "numeric",
								})}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								<Clock className="size-3" />
								Time
							</p>
							<p className="text-sm font-medium">
								{formatTime12(selectedBooking.startTime)} -{" "}
								{formatTime12(selectedBooking.endTime)}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								<DollarSign className="size-3" />
								Rate
							</p>
							<p className="text-sm font-medium">
								{selectedBooking.rate ? `$${selectedBooking.rate}/hr` : "—"}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								<DollarSign className="size-3" />
								Total
							</p>
							<p className="text-sm font-semibold text-green-700">
								{selectedBooking.totalAmount
									? `$${selectedBooking.totalAmount.toFixed(2)}`
									: "—"}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								{selectedBooking.isOnline ? (
									<Video className="size-3" />
								) : (
									<MapPin className="size-3" />
								)}
								Type
							</p>
							<p className="text-sm font-medium">
								{selectedBooking.isOnline ? "Online" : "In-person"}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								<CreditCard className="size-3" />
								Payment
							</p>
							<p className="text-sm font-medium capitalize">
								{selectedBooking.paymentStatus === "paid" ? (
									<span className="text-green-600">Paid</span>
								) : selectedBooking.paymentStatus === "pending" ? (
									<span className="text-amber-600">Pending Payment</span>
								) : (
									<span className="text-red-600">Refunded</span>
								)}
							</p>
						</div>
					</div>

					<Separator />

					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-foreground">
							Student Contact
						</h4>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Mail className="size-3.5 shrink-0" />
								{selectedBooking.studentEmail}
							</div>
							{selectedBooking.studentPhone && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Phone className="size-3.5 shrink-0" />
									{selectedBooking.studentPhone}
								</div>
							)}
						</div>
					</div>

					{selectedBooking.meetingLink &&
						selectedBooking.status !== "cancelled" && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-3">
								<p className="text-xs text-green-700 font-medium mb-1">
									Session Link
								</p>
								<a
									href={selectedBooking.meetingLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-primary underline break-all"
								>
									{selectedBooking.meetingLink}
								</a>
							</div>
						)}

					<div className="grid grid-cols-2 gap-2">
						<Button variant="outline" size="sm" className="gap-1.5">
							<RotateCcw className="size-3.5" />
							Reschedule
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
						>
							<XCircle className="size-3.5" />
							Cancel Session
						</Button>
						<Button variant="outline" size="sm" className="gap-1.5">
							<MessageSquare className="size-3.5" />
							Send Message
						</Button>
						<Button variant="outline" size="sm" className="gap-1.5">
							<FileText className="size-3.5" />
							Add Notes
						</Button>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="gradient"
						size="sm"
						className="gap-1.5 w-full sm:w-auto"
					>
						<CheckCircle2 className="size-3.5" />
						Mark as Completed
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
