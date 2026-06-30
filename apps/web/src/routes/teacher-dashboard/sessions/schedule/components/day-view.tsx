import { format, isToday } from "date-fns";
import { MapPin, Plus, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "../store";
import type { BookedSession } from "../types";
import { SessionPopover } from "./session-popover";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const HOUR_HEIGHT = 80;

function formatHour(hour: number) {
	const period = hour >= 12 ? "PM" : "AM";
	const adjusted = hour % 12 || 12;
	return `${adjusted} ${period}`;
}

function getTopFromTime(time: string) {
	const [h, m] = time.split(":").map(Number);
	return ((h - 8) * 60 + m) * (HOUR_HEIGHT / 60);
}

function getHeightFromDuration(start: string, end: string) {
	const [sh, sm] = start.split(":").map(Number);
	const [eh, em] = end.split(":").map(Number);
	const durationMinutes = (eh - sh) * 60 + (em - sm);
	return durationMinutes * (HOUR_HEIGHT / 60);
}

function getTimeFromISO(iso: string | null): string {
	if (!iso) return "00:00";
	return format(new Date(iso), "HH:mm");
}

const statusConfig: Record<string, { label: string; className: string }> = {
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

export function DayView() {
	const {
		currentDate,
		openBookingDetails,
		openAddAvailability,
		availabilitySlots,
		blockedTimes,
		bookedSessions,
	} = useScheduleStore();

	const dateStr = format(currentDate, "yyyy-MM-dd");
	const dayOfWeek = currentDate.getDay();

	const dayAvail = availabilitySlots.filter((slot) => {
		if (slot.dayOfWeek) {
			const dayNames = [
				"SUNDAY",
				"MONDAY",
				"TUESDAY",
				"WEDNESDAY",
				"THURSDAY",
				"FRIDAY",
				"SATURDAY",
			];
			return dayNames.indexOf(slot.dayOfWeek) === dayOfWeek;
		}
		if (slot.specificDate) {
			return dateStr === format(new Date(slot.specificDate), "yyyy-MM-dd");
		}
		return false;
	});

	const dayBlocked = blockedTimes.filter((bt) => {
		if (bt.dayOfWeek) {
			const dayNames = [
				"SUNDAY",
				"MONDAY",
				"TUESDAY",
				"WEDNESDAY",
				"THURSDAY",
				"FRIDAY",
				"SATURDAY",
			];
			return dayNames.indexOf(bt.dayOfWeek) === dayOfWeek;
		}
		if (bt.specificDate) {
			return dateStr === format(new Date(bt.specificDate), "yyyy-MM-dd");
		}
		return false;
	});

	const sessions: BookedSession[] = bookedSessions.filter(
		(s) => s.date === dateStr,
	);

	return (
		<div className="flex-1 overflow-auto p-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h2
							className={cn(
								"text-lg font-semibold",
								isToday(currentDate) && "text-primary",
							)}
						>
							{format(currentDate, "EEEE, MMMM d, yyyy")}
						</h2>
						<p className="text-sm text-muted-foreground">
							{dayAvail.length} available slots &middot; {sessions.length}{" "}
							sessions
						</p>
					</div>
					<Button
						variant="gradient"
						size="sm"
						onClick={openAddAvailability}
						className="gap-1.5"
					>
						<Plus className="size-4" />
						Quick Add
					</Button>
				</div>

				<div className="flex border rounded-lg bg-background">
					<div className="w-16 shrink-0">
						{HOURS.map((hour) => (
							<div
								key={hour}
								className="border-b text-xs text-muted-foreground pr-2 text-right"
								style={{ height: HOUR_HEIGHT }}
							>
								<span className="relative -top-2.5">{formatHour(hour)}</span>
							</div>
						))}
					</div>

					<div className="flex-1 relative border-l">
						{HOURS.map((hour) => (
							<div
								key={hour}
								className="border-b border-dashed border-gray-100 cursor-pointer hover:bg-primary-light/20 transition-colors"
								style={{ height: HOUR_HEIGHT }}
							/>
						))}

						{dayAvail.map((avail) => {
							const start = getTimeFromISO(avail.specificStartTime);
							const end = getTimeFromISO(avail.specificEndTime);
							const top = getTopFromTime(start);
							const height = getHeightFromDuration(start, end);
							return (
								<button
									type="button"
									key={avail.id}
									className={cn(
										"absolute left-1 right-1 rounded-md z-10 flex items-center justify-between px-3 py-1 cursor-pointer",
										avail.availabilityType === "ONLINE"
											? "bg-blue-100/60 border border-blue-200 hover:bg-blue-100/70"
											: "bg-amber-100/60 border border-amber-200 hover:bg-amber-100/70",
									)}
									style={{ top, height, minHeight: 28 }}
									onClick={() => {
										// Open edit modal for this slot
										const store = useScheduleStore.getState();
										store.openEditAvailability(avail);
									}}
									onContextMenu={(e) => {
										e.preventDefault();
										// Open delete confirmation
										const store = useScheduleStore.getState();
										store.openDeleteConfirm(avail);
									}}
								>
									<span className="text-xs font-medium text-muted-foreground">
										Available
									</span>
									<div className="flex items-center gap-1">
										<span className="text-[10px] text-muted-foreground">
											{start} – {end}
										</span>
										{avail.availabilityType === "ONLINE" ? (
											<Video className="size-3 text-blue-500" />
										) : (
											<MapPin className="size-3 text-amber-600" />
										)}
									</div>
								</button>
							);
						})}

						{dayBlocked.map((bt) => {
							const start = getTimeFromISO(bt.specificStartTime);
							const end = getTimeFromISO(bt.specificEndTime);
							const isFullDay = start === "00:00" && end === "23:59";
							const top = isFullDay ? 0 : getTopFromTime(start);
							const height = isFullDay
								? HOURS.length * HOUR_HEIGHT
								: getHeightFromDuration(start, end);
							return (
								<div
									key={bt.id}
									className="absolute left-1 right-1 bg-gray-200/80 border border-gray-300 rounded-md z-10 flex items-center justify-center"
									style={{ top, height }}
								>
									<span className="text-xs text-gray-500 font-medium">
										{bt.reason || "Blocked"}
									</span>
								</div>
							);
						})}

						{sessions.map((session) => {
							const top = getTopFromTime(session.startTime);
							const height = getHeightFromDuration(
								session.startTime,
								session.endTime,
							);
							const config = statusConfig[session.status];
							return (
								<Popover key={session.id}>
									<PopoverTrigger asChild>
										<button
											type="button"
											className={cn(
												"absolute left-1 right-1 rounded-md border px-2.5 py-1.5 text-left cursor-pointer z-20 transition-shadow hover:shadow-md",
												session.status === "confirmed" &&
													"bg-green-50 border-green-300",
												session.status === "pending" &&
													"bg-blue-50 border-blue-300",
												session.status === "rescheduled" &&
													"bg-orange-50 border-orange-300",
												session.status === "cancelled" &&
													"bg-red-50 border-red-300 opacity-60",
												session.status === "completed" &&
													"bg-gray-50 border-gray-300",
											)}
											style={{ top, height, minHeight: 32 }}
											onClick={() => openBookingDetails(session)}
										>
											<div className="flex items-center justify-between gap-2">
												<span className="text-sm font-semibold truncate">
													{session.studentName}
												</span>
												<Badge
													variant="outline"
													className={`text-[10px] px-1.5 py-0 leading-none shrink-0 ${config.className}`}
												>
													{config.label}
												</Badge>
											</div>
											<div className="flex items-center gap-1.5 mt-0.5">
												{session.isOnline ? (
													<Video className="size-3 text-blue-500" />
												) : (
													<MapPin className="size-3 text-amber-600" />
												)}
												<span className="text-xs text-muted-foreground">
													{session.sessionType}
												</span>
											</div>
											<div className="flex items-center justify-between mt-0.5">
												<span className="text-[10px] text-muted-foreground">
													{session.startTime} – {session.endTime} &middot;{" "}
													{session.duration}min
												</span>
												{session.totalAmount && (
													<span className="text-xs font-semibold text-green-700">
														${session.totalAmount.toFixed(2)}
													</span>
												)}
											</div>
										</button>
									</PopoverTrigger>
									<PopoverContent
										side="right"
										align="start"
										className="w-64 p-3"
									>
										<SessionPopover session={session} />
									</PopoverContent>
								</Popover>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
