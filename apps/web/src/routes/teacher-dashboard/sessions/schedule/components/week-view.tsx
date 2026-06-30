import {
	eachDayOfInterval,
	endOfWeek,
	format,
	isToday,
	startOfWeek,
} from "date-fns";
import { MapPin, Video } from "lucide-react";
import { useMemo } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "../store";
import type { AvailabilitySlot, BookedSession } from "../types";
import { SessionPopover } from "./session-popover";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const HOUR_HEIGHT = 64;

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

function getDayTimeStr(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

function getTimeFromISO(iso: string | null): string {
	if (!iso) return "00:00";
	return format(new Date(iso), "HH:mm");
}

export function WeekView() {
	const {
		currentDate,
		openBookingDetails,
		availabilitySlots,
		blockedTimes,
		bookedSessions,
	} = useScheduleStore();

	const days = useMemo(() => {
		const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
		const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
		return eachDayOfInterval({ start: weekStart, end: weekEnd });
	}, [currentDate]);

	return (
		<div className="flex-1 overflow-auto">
			<div className="min-w-[800px]">
				<div className="grid grid-cols-[60px_repeat(7,1fr)] border-b sticky top-0 bg-background z-10">
					<div className="p-2 border-r" />
					{days.map((day) => (
						<div
							key={day.toISOString()}
							className={cn(
								"p-2 text-center border-r",
								isToday(day) && "bg-primary-light/40",
							)}
						>
							<p className="text-xs font-semibold text-muted-foreground">
								{format(day, "EEE")}
							</p>
							<p
								className={cn(
									"text-lg font-semibold mt-1",
									isToday(day) && "text-primary",
								)}
							>
								{format(day, "d")}
							</p>
						</div>
					))}
				</div>

				<div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
					<div className="col-start-1">
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

					{days.map((day) => {
						const dateStr = getDayTimeStr(day);
						const dayOfWeek = day.getDay();

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
								return (
									dateStr === format(new Date(slot.specificDate), "yyyy-MM-dd")
								);
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
								return (
									dateStr === format(new Date(bt.specificDate), "yyyy-MM-dd")
								);
							}
							return false;
						});

						const sessions: BookedSession[] = bookedSessions.filter(
							(s) => s.date === dateStr,
						);

						return (
							<div
								key={day.toISOString()}
								className={cn(
									"border-r relative",
									isToday(day) && "bg-primary-light/20",
								)}
							>
								{HOURS.map((hour) => (
									<div
										key={hour}
										className="border-b border-dashed border-gray-100"
										style={{ height: HOUR_HEIGHT }}
									/>
								))}

								{dayAvail.map((avail) => {
									const start = getTimeFromISO(avail.specificStartTime);
									const end = getTimeFromISO(avail.specificEndTime);
									const top = getTopFromTime(start);
									const height = getHeightFromDuration(start, end);
									return (
										<div
											key={avail.id}
											className={cn(
												"absolute left-0.5 right-0.5 rounded-sm z-10 flex items-start justify-between px-1.5 py-0.5",
												avail.availabilityType === "ONLINE"
													? "bg-blue-100/50 border border-blue-200"
													: "bg-amber-100/50 border border-amber-200",
											)}
											style={{ top, height, minHeight: 22 }}
										>
											<span className="text-[9px] text-muted-foreground font-medium">
												Available
											</span>
											{avail.availabilityType === "ONLINE" ? (
												<Video className="size-3 text-blue-500 shrink-0" />
											) : (
												<MapPin className="size-3 text-amber-600 shrink-0" />
											)}
										</div>
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
											className="absolute left-0.5 right-0.5 bg-gray-200/70 border border-gray-300 rounded-sm z-10 flex items-center justify-center"
											style={{ top, height }}
										>
											<span className="text-[10px] text-gray-500 font-medium">
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
									const isCancelled = session.status === "cancelled";
									return (
										<Popover key={session.id}>
											<PopoverTrigger asChild>
												<button
													type="button"
													className={cn(
														"absolute left-0.5 right-0.5 rounded-md border px-1.5 py-1 text-left cursor-pointer z-20 transition-shadow hover:shadow-md",
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
													style={{ top, height, minHeight: 28 }}
													onClick={() => openBookingDetails(session)}
												>
													<p
														className={cn(
															"text-xs font-medium truncate",
															isCancelled && "line-through",
														)}
													>
														{session.studentName}
													</p>
													<p className="text-[10px] text-muted-foreground truncate">
														{session.sessionType}
													</p>
													{session.rate && (
														<p className="text-[10px] font-medium text-green-700 truncate">
															${session.totalAmount?.toFixed(2)}
														</p>
													)}
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
						);
					})}
				</div>
			</div>
		</div>
	);
}
