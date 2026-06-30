import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, PanelRightClose } from "lucide-react";
import { useScheduleStore } from "../store";
import { CoachProfileSummary } from "./coach-profile-summary";
import { RatesCard } from "./rates-card";
import { UpcomingBookings } from "./upcoming-bookings";

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
        </div>
      </ScrollArea>
    </aside>
  );
}
