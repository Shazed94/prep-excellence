import { Calendar, HelpCircle, PanelRightClose, Settings } from "lucide-react";
import { AvailabilityTemplates } from "@/components/teacher-dashboard/schedule/availability-templates";
import { CoachProfileSummary } from "@/components/teacher-dashboard/schedule/coach-profile-summary";
import { RatesCard } from "@/components/teacher-dashboard/schedule/rates-card";
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
import { UpcomingBookings } from "@/components/teacher-dashboard/schedule/upcoming-bookings";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ScheduleSidebar() {
	const { sidebarOpen, toggleSidebar } = useScheduleStore();

	return (
		<aside
			data-state={sidebarOpen ? "open" : "closed"}
			className="border-l bg-background flex flex-col overflow-hidden transition-all duration-300 data-[state=closed]:w-0 data-[state=open]:w-72 lg:data-[state=open]:w-80"
		>
			<div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
				<div className="flex items-center gap-2">
					<Calendar className="size-4 text-primary" />
					<span className="text-sm font-semibold text-foreground">Coach</span>
				</div>
				<Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
					<PanelRightClose className="size-4" />
				</Button>
			</div>

			<ScrollArea className="flex-1">
				<div className="py-1 space-y-2">
					<CoachProfileSummary />
					<div className="px-4">
						<RatesCard />
					</div>
					<Separator />

					<div>
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
							Upcoming Bookings
						</h3>
						<UpcomingBookings />
					</div>
					<Separator />

					<div>
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
							Availability Templates
						</h3>
						<AvailabilityTemplates />
					</div>
				</div>
			</ScrollArea>

			<div className="border-t p-3 shrink-0">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs">
						<Settings className="size-3.5" />
						Settings
					</Button>
					<Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs">
						<HelpCircle className="size-3.5" />
						Help
					</Button>
				</div>
			</div>
		</aside>
	);
}
