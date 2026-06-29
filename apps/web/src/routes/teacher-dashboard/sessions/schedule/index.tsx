import { createFileRoute } from "@tanstack/react-router";
import { PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddAvailabilityModal } from "./components/add-availability-modal";
import { BlockTimeModal } from "./components/block-time-modal";
import { BookingDetailsModal } from "./components/booking-details-modal";
import { DayView } from "./components/day-view";
import { ManageRatesModal } from "./components/manage-rates-modal";
import { MonthView } from "./components/month-view";
import { ScheduleHeader } from "./components/schedule-header";
import { ScheduleSidebar } from "./components/schedule-sidebar";
import { WeekView } from "./components/week-view";
import { useScheduleStore } from "./store";

export const Route = createFileRoute("/teacher-dashboard/sessions/schedule/")({
	component: RouteComponent,
});

function RouteComponent() {
	const view = useScheduleStore((s) => s.view);
	const sidebarOpen = useScheduleStore((s) => s.sidebarOpen);
	const toggleSidebar = useScheduleStore((s) => s.toggleSidebar);

	return (
		<div className="flex flex-col h-[calc(100vh-72px)] bg-[#FAFAFA]">
			<ScheduleHeader />

			<div className="flex flex-1 overflow-hidden">
				<main
					className={`flex-1 overflow-auto transition-all duration-300 ${
						sidebarOpen ? "lg:mr-0" : ""
					}`}
				>
					{view === "month" && <MonthView />}
					{view === "week" && <WeekView />}
					{view === "day" && <DayView />}
				</main>

				<div className="hidden lg:block">
					<ScheduleSidebar />
				</div>
			</div>

			{!sidebarOpen && (
				<Button
					variant="outline"
					size="icon-sm"
					onClick={toggleSidebar}
					className="fixed right-4 bottom-4 z-50 lg:right-4 lg:top-24 lg:bottom-auto shadow-lg bg-background border-2 border-primary/20 hover:border-primary"
				>
					<PanelLeftOpen className="size-4" />
				</Button>
			)}

			<AddAvailabilityModal />
			<BookingDetailsModal />
			<BlockTimeModal />
			<ManageRatesModal />
		</div>
	);
}
