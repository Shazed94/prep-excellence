import { format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "../store";

export function ScheduleHeader() {
	const {
		currentDate,
		view,
		setView,
		navigateNext,
		navigatePrev,
		goToToday,
		openAddAvailability,
	} = useScheduleStore();

	const viewLabel =
		view === "month"
			? format(currentDate, "MMMM yyyy")
			: view === "week"
				? `${format(currentDate, "MMM d")} - ${format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}`
				: format(currentDate, "EEEE, MMMM d, yyyy");

	return (
		<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b bg-background">
			<div className="flex items-center gap-3">
				<CalendarDays className="size-5 text-primary" />
				<h1 className="text-lg font-semibold text-foreground">My Schedule</h1>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex items-center gap-1 bg-muted/20 rounded-lg p-1">
					<Button
						variant={view === "day" ? "default" : "ghost"}
						size="sm"
						onClick={() => setView("day")}
						className="text-xs"
					>
						Day
					</Button>
					<Button
						variant={view === "week" ? "default" : "ghost"}
						size="sm"
						onClick={() => setView("week")}
						className="text-xs"
					>
						Week
					</Button>
					<Button
						variant={view === "month" ? "default" : "ghost"}
						size="sm"
						onClick={() => setView("month")}
						className="text-xs"
					>
						Month
					</Button>
				</div>

				<div className="flex items-center gap-1">
					<Button variant="outline" size="icon-sm" onClick={navigatePrev}>
						<ChevronLeft className="size-4" />
					</Button>
					<span className="text-sm font-medium min-w-[180px] text-center">
						{viewLabel}
					</span>
					<Button variant="outline" size="icon-sm" onClick={navigateNext}>
						<ChevronRight className="size-4" />
					</Button>
				</div>

				<Button variant="outline" size="sm" onClick={goToToday}>
					Today
				</Button>

				<Button
					variant="gradient"
					size="sm"
					onClick={openAddAvailability}
					className="gap-1.5"
				>
					<Plus className="size-4" />
					<span className="hidden sm:inline">Add Availability</span>
				</Button>
			</div>
		</header>
	);
}
