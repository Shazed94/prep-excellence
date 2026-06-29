import { format, isToday } from "date-fns";
import { MapPin, Plus, Video } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { availabilitySlots, blockedTimes, bookedSessions } from "../dummy-data";
import { useScheduleStore } from "../store";
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
	return Math.max(durationMinutes * (HOUR_HEIGHT / 60), 28);
}

export function DayView() {
	const { currentDate, openBookingDetails, openAddAvailability } =
		useScheduleStore();

	const dateStr = format(currentDate, "yyyy-MM-dd");
	const dayOfWeek = currentDate.getDay();

	const sessions = useMemo(
		() => bookedSessions.filter((s) => s.date === dateStr),
		[dateStr],
	);

	const blocked = useMemo(
		() =>
			blockedTimes.filter((bt) => {
				if (bt.daysOfWeek && bt.daysOfWeek.length > 0) {
					return bt.daysOfWeek.includes(dayOfWeek);
				}
				return dateStr >= bt.startDate && dateStr <= bt.endDate;
			}),
		[dateStr, dayOfWeek],
	);

	const availabilities = useMemo(
		() =>
			availabilitySlots.filter((slot) => {
				if (slot.daysOfWeek && slot.daysOfWeek.length > 0) {
					return slot.daysOfWeek.includes(dayOfWeek);
				}
				return dateStr >= slot.startDate && dateStr <= slot.endDate;
			}),
		[dateStr, dayOfWeek],
	);

	return (
		<div className="flex-1 overflow-auto">
			<div className="flex items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-10">
				<div>
					<h2
						className={cn(
							"text-lg font-semibold",
							isToday(currentDate) && "text-primary",
						)}
					>
						{format(currentDate, "EEEE, MMMM d, yyyy")}
					</h2>
					<p className="text-xs text-muted-foreground mt-0.5">
						{availabilities.length > 0
							? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} booked`
							: "No availability set for this day"}
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

			<div className="relative mx-6 my-4">
				{HOURS.map((hour) => (
					<div
						key={hour}
						className="flex border-b border-gray-100"
						style={{ height: HOUR_HEIGHT }}
					>
						<div className="w-16 text-xs text-muted-foreground pt-0 shrink-0 text-right pr-3">
							<span className="relative -top-2.5">{formatHour(hour)}</span>
						</div>
						<div className="flex-1 relative">
							<div
								className="absolute inset-0 hover:bg-primary-light/20 cursor-pointer transition-colors rounded"
								onClick={() => openAddAvailability()}
							/>
						</div>
					</div>
				))}

				{availabilities.map((avail) => {
					const top = getTopFromTime(avail.startTime);
					const height = getHeightFromDuration(avail.startTime, avail.endTime);
					return (
						<div
							key={avail.id}
							className={cn(
								"absolute left-16 right-0 rounded-sm pointer-events-none z-10 flex items-center justify-between px-2 py-0.5",
								avail.isOnline
									? "bg-blue-100/50 border border-blue-200"
									: "bg-amber-100/50 border border-amber-200",
							)}
							style={{
								top,
								height,
								marginLeft: "0.75rem",
								marginRight: 0,
								minHeight: 24,
							}}
						>
							<span className="text-xs text-muted-foreground font-medium">
								Available
							</span>
							{avail.isOnline ? (
								<Video className="size-3.5 text-blue-500 shrink-0" />
							) : (
								<MapPin className="size-3.5 text-amber-600 shrink-0" />
							)}
						</div>
					);
				})}

				{blocked.map((bt) => {
					const top = bt.fullDay ? 0 : getTopFromTime(bt.startTime);
					const height = bt.fullDay
						? HOURS.length * HOUR_HEIGHT
						: getHeightFromDuration(bt.startTime, bt.endTime);
					return (
						<div
							key={bt.id}
							className="absolute left-16 right-0 bg-gray-200/60 border border-gray-300 rounded-sm z-10 flex items-center justify-center"
							style={{
								top,
								height,
								marginLeft: "0.75rem",
								marginRight: 0,
							}}
						>
							<span className="text-xs text-gray-500 font-medium">
								{bt.fullDay ? "Full Day - " : ""}
								{bt.reason}
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
					const isCancelled = session.status === "cancelled";
					return (
						<Popover key={session.id}>
							<PopoverTrigger asChild>
								<button
									type="button"
									className={cn(
										"absolute left-16 right-0 rounded-md border px-3 py-2 text-left cursor-pointer z-20 transition-shadow hover:shadow-md",
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
									style={{
										top,
										height,
										marginLeft: "0.75rem",
										marginRight: 0,
									}}
									onClick={() => openBookingDetails(session)}
								>
									<div className="flex items-start justify-between gap-2">
										<p
											className={cn(
												"text-sm font-semibold truncate",
												isCancelled && "line-through",
											)}
										>
											{session.studentName}
										</p>
										<span
											className={cn(
												"text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
												session.status === "confirmed" &&
													"bg-green-200 text-green-800",
												session.status === "pending" &&
													"bg-blue-200 text-blue-800",
												session.status === "rescheduled" &&
													"bg-orange-200 text-orange-800",
												session.status === "cancelled" &&
													"bg-red-200 text-red-800",
												session.status === "completed" &&
													"bg-gray-200 text-gray-800",
											)}
										>
											{session.status}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-0.5">
										{session.sessionType} &middot; {session.duration}min
									</p>
									<p className="text-xs text-muted-foreground">
										{session.startTime} - {session.endTime}
									</p>
									{session.rate && (
										<p className="text-xs font-semibold text-green-700 mt-0.5">
											${session.totalAmount?.toFixed(2)}
										</p>
									)}
								</button>
							</PopoverTrigger>
							<PopoverContent side="right" align="start" className="w-64 p-3">
								<SessionPopover session={session} />
							</PopoverContent>
						</Popover>
					);
				})}
			</div>
		</div>
	);
}
