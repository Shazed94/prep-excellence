import { createFileRoute } from "@tanstack/react-router";
import { PanelLeftOpen } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetOwnTeacherProfile, useGetTeacherMe } from "@/hooks/teacher";
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
import { ScheduleHeader } from "@/components/teacher-dashboard/schedule/components/schedule-header";
import { MonthView } from "@/components/teacher-dashboard/schedule/components/month-view";
import { WeekView } from "@/components/teacher-dashboard/schedule/components/week-view";
import { DayView } from "@/components/teacher-dashboard/schedule/components/day-view";
import { ScheduleSidebar } from "@/components/teacher-dashboard/schedule/components/schedule-sidebar";
import { AddAvailabilityModal } from "@/components/teacher-dashboard/schedule/components/add-availability-modal";
import { EditAvailabilityModal } from "@/components/teacher-dashboard/schedule/components/edit-availability-modal";
import { BlockTimeModal } from "@/components/teacher-dashboard/schedule/components/block-time-modal";
import { ManageRatesModal } from "@/components/teacher-dashboard/schedule/components/manage-rates-modal";


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
	const { data: profileRes } = useGetOwnTeacherProfile(teacherMe?.id);

	// Fetch availability from API and populate store
	useEffect(() => {
		if (!profileRes?.data?.id) return;

		const fetchAvailability = async () => {
			try {
				const { default: axiosInstance } = await import("@/lib/axios");
				const res = await axiosInstance.get(
					`/onetoone/teachers/${teacherMe?.id}/availability`,
				);
				const data: any[] = res.data?.data ?? [];

				// Split into available vs blocked
				const available = data.filter((s) => s.category === "AVAILABLE");
				const blocked = data.filter((s) => s.category === "BLOCKED");

				setAvailabilitySlots(available);
				setBlockedTimes(blocked);
			} catch {
				// silently fail — views will show empty state
			}
		};

		fetchAvailability();
	}, [
		profileRes?.data?.id,
		teacherMe?.id,
		setAvailabilitySlots,
		setBlockedTimes,
	]);

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
