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
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
import type { BookedSession } from "@/components/teacher-dashboard/schedule/types";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
	confirmed: "bg-green-500",
	pending: "bg-blue-500",
	rescheduled: "bg-orange-500",
	cancelled: "bg-red-400",
	completed: "bg-gray-400",
};

function getDayEvents(
	date: Date,
	availabilitySlots: any[],
	blockedTimes: any[],
	bookedSessions: any[],
) {
	const dateStr = format(date, "yyyy-MM-dd");
	const dayOfWeek = date.getDay();

	const slotsForDay = availabilitySlots.filter((slot) => {
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

	const blockedForDay = blockedTimes.filter((bt) => {
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

	const isBlockedDay = blockedForDay.some((bt) => {
		if (!bt.specificStartTime || !bt.specificEndTime) return false;
		const s = format(new Date(bt.specificStartTime), "HH:mm");
		const e = format(new Date(bt.specificEndTime), "HH:mm");
		return s === "00:00" && e === "23:59";
	});

	const sessionsForDay: BookedSession[] = bookedSessions.filter(
		(s) => s.date === dateStr,
	);

	return { slotsForDay, blockedForDay, sessionsForDay, isBlockedDay };
}

export function MonthView() {
	const {
		currentDate,
		setCurrentDate,
		setView,
		openBookingDetails,
		availabilitySlots,
		blockedTimes,
		bookedSessions,
	} = useScheduleStore();

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
					const { slotsForDay, sessionsForDay, isBlockedDay } = getDayEvents(
						date,
						availabilitySlots,
						blockedTimes,
						bookedSessions,
					);
					const isCurrentMonth = isSameMonth(date, currentDate);
					const isTodayDate = isToday(date);

					return (
						<button
							type="button"
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
									<button
										type="button"
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
									</button>
								))}
								{sessionsForDay.length > 3 && (
									<span className="text-[10px] text-muted-foreground pl-1">
										+{sessionsForDay.length - 3} more
									</span>
								)}
							</div>

							<div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity rounded pointer-events-none" />
						</button>
					);
				})}
			</div>
		</div>
	);
}
