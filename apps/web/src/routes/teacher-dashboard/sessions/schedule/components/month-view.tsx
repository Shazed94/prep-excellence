import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { availabilitySlots, blockedTimes, bookedSessions } from "../dummy-data";
import { useScheduleStore } from "../store";

const statusColors: Record<string, string> = {
	confirmed: "bg-green-500",
	pending: "bg-blue-500",
	rescheduled: "bg-orange-500",
	cancelled: "bg-red-400",
	completed: "bg-gray-400",
};

function getDayEvents(date: Date) {
	const dateStr = format(date, "yyyy-MM-dd");
	const dayOfWeek = date.getDay();

	const slotsForDay = availabilitySlots.filter((slot) => {
		if (slot.daysOfWeek && slot.daysOfWeek.length > 0) {
			return slot.daysOfWeek.includes(dayOfWeek);
		}
		return dateStr >= slot.startDate && dateStr <= slot.endDate;
	});

	const blockedForDay = blockedTimes.filter((bt) => {
		if (bt.daysOfWeek && bt.daysOfWeek.length > 0) {
			return bt.daysOfWeek.includes(dayOfWeek);
		}
		return dateStr >= bt.startDate && dateStr <= bt.endDate;
	});

	const sessionsForDay = bookedSessions.filter((s) => s.date === dateStr);

	return { slotsForDay, blockedForDay, sessionsForDay };
}

export function MonthView() {
	const { currentDate, setCurrentDate, setView, openBookingDetails } =
		useScheduleStore();

	const calendarDays = useMemo(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
		const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
		return eachDayOfInterval({ start: calStart, end: calEnd });
	}, [currentDate]);

	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<div className="flex-1 p-4">
			<div className="grid grid-cols-7 mb-2">
				{dayNames.map((name) => (
					<div
						key={name}
						className="text-center text-xs font-semibold text-muted-foreground py-2"
					>
						{name}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 border-l border-t rounded-lg overflow-hidden">
				{calendarDays.map((date) => {
					const { slotsForDay, blockedForDay, sessionsForDay } =
						getDayEvents(date);
					const isCurrentMonth = isSameMonth(date, currentDate);
					const isTodayDate = isToday(date);
					const isBlockedDay = blockedForDay.some((bt) => bt.fullDay);

					return (
						<div
							key={date.toISOString()}
							className={cn(
								"min-h-[100px] border-r border-b p-1.5 transition-colors cursor-pointer hover:bg-primary-light/30 relative group",
								!isCurrentMonth && "bg-gray-50/50",
								isTodayDate && "bg-primary-light/40",
								isBlockedDay && "bg-gray-100",
							)}
							onClick={() => {
								setCurrentDate(date);
								setView("day");
							}}
						>
							<div className="flex items-center justify-between mb-1">
								<span
									className={cn(
										"text-xs font-medium size-6 flex items-center justify-center rounded-full",
										isTodayDate && "bg-primary text-primary-foreground size-6",
										!isCurrentMonth && "text-muted-foreground/50",
									)}
								>
									{format(date, "d")}
								</span>
								{slotsForDay.length > 0 && !isBlockedDay && (
									<span className="text-[10px] text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded-full">
										{slotsForDay.length} slots
									</span>
								)}
							</div>

							<div className="space-y-0.5">
								{sessionsForDay.slice(0, 3).map((session) => (
									<div
										key={session.id}
										className={cn(
											"text-[10px] px-1.5 py-0.5 rounded truncate text-white cursor-pointer",
											statusColors[session.status] || "bg-gray-400",
										)}
										onClick={(e) => {
											e.stopPropagation();
											openBookingDetails(session);
										}}
									>
										{session.studentName.split(" ")[0]}
									</div>
								))}
								{sessionsForDay.length > 3 && (
									<span className="text-[10px] text-muted-foreground pl-1">
										+{sessionsForDay.length - 3} more
									</span>
								)}
							</div>

							<div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity rounded pointer-events-none" />
						</div>
					);
				})}
			</div>
		</div>
	);
}
