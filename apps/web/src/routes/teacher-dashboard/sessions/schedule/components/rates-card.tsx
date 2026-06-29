import { DollarSign, MapPin, Pencil, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coachProfile } from "../dummy-data";
import { useScheduleStore } from "../store";

export function RatesCard() {
	const openManageRates = useScheduleStore((s) => s.openManageRates);

	return (
		<div className="rounded-lg border bg-card p-3">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-1.5">
					<DollarSign className="size-3.5 text-primary" />
					<span className="text-xs font-semibold text-foreground">
						Hourly Rates
					</span>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={openManageRates}
					className="size-6"
				>
					<Pencil className="size-3" />
				</Button>
			</div>
			<div className="space-y-1.5">
				<div className="flex items-center justify-between text-xs">
					<div className="flex items-center gap-1.5">
						<Video className="size-3 text-blue-500" />
						<span className="text-muted-foreground">Online</span>
					</div>
					<span className="font-semibold text-foreground">
						${coachProfile.defaultOnlineRate}/hr
					</span>
				</div>
				<div className="flex items-center justify-between text-xs">
					<div className="flex items-center gap-1.5">
						<MapPin className="size-3 text-amber-600" />
						<span className="text-muted-foreground">In-Person</span>
					</div>
					<span className="font-semibold text-foreground">
						${coachProfile.defaultInPersonRate}/hr
					</span>
				</div>
			</div>
		</div>
	);
}
