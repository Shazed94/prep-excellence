import { createFileRoute } from "@tanstack/react-router";
import { PanelLeftOpen } from "lucide-react";
import { useEffect } from "react";
import { AddAvailabilityModal } from "@/components/teacher-dashboard/schedule/components/add-availability-modal";
import { BlockTimeModal } from "@/components/teacher-dashboard/schedule/components/block-time-modal";
import { DayView } from "@/components/teacher-dashboard/schedule/components/day-view";
import { EditAvailabilityModal } from "@/components/teacher-dashboard/schedule/components/edit-availability-modal";
import { ManageRatesModal } from "@/components/teacher-dashboard/schedule/components/manage-rates-modal";
import { MonthView } from "@/components/teacher-dashboard/schedule/components/month-view";
import { ScheduleHeader } from "@/components/teacher-dashboard/schedule/components/schedule-header";
import { ScheduleSidebar } from "@/components/teacher-dashboard/schedule/components/schedule-sidebar";
import { WeekView } from "@/components/teacher-dashboard/schedule/components/week-view";
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
import { Button } from "@/components/ui/button";
import { useGetOwnAvailability, useGetTeacherMe } from "@/hooks/teacher";

export const Route = createFileRoute("/teacher-dashboard/sessions/schedule/")({
	component: RouteComponent,
});

function RouteComponent() {
	const view = useScheduleStore((s) => s.view);
	const sidebarOpen = useScheduleStore((s) => s.sidebarOpen);
	const toggleSidebar = useScheduleStore((s) => s.toggleSidebar);
	const setAvailabilitySlots = useScheduleStore((s) => s.setAvailabilitySlots);
	const setBlockedTimes = useScheduleStore((s) => s.setBlockedTimes);

	const { data: teacherMe } = useGetTeacherMe();

	// Use TanStack Query to fetch availability reactively
	// Mutations invalidate KEYS.availability, which triggers automatic refetch
	const { data: availRes } = useGetOwnAvailability(teacherMe?.id);

	// Sync availability data into Zustand store whenever query refetches
	useEffect(() => {
		if (!availRes?.data) return;

		const data: any[] = availRes.data;

		// Split into available vs blocked
		const available = data.filter((s) => s.category === "AVAILABLE");
		const blocked = data.filter((s) => s.category === "BLOCKED");

		setAvailabilitySlots(available);
		setBlockedTimes(blocked);
	}, [availRes, setAvailabilitySlots, setBlockedTimes]);

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
					className="fixed right-4 bottom-4 z-50 lg:right-4 lg:top-24 lg:bottom-auto shadow-sm bg-background border-2 border-primary/20 hover:border-primary"
				>
					<PanelLeftOpen className="size-4" />
				</Button>
			)}

			<AddAvailabilityModal />
			<EditAvailabilityModal />
			<BlockTimeModal />
			<ManageRatesModal />
		</div>
	);
}
