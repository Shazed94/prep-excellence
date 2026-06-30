import { Clock, MapPin, Plus, Video } from "lucide-react";
import { availabilityTemplates } from "@/components/teacher-dashboard/schedule/dummy-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AvailabilityTemplates() {
	return (
		<div className="space-y-2 px-4">
			{availabilityTemplates.map((template) => {
				const slot = template.slots[0];
				return (
					<div
						key={template.id}
						className="p-2.5 rounded-lg border bg-card hover:bg-accent/5 transition-colors group"
					>
						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0 flex-1">
								<p className="text-sm font-medium text-foreground truncate">
									{template.name}
								</p>
								<p className="text-xs text-muted-foreground mt-0.5">
									{template.description}
								</p>
								<div className="flex items-center gap-2 mt-1.5">
									<div className="flex items-center gap-1">
										<Clock className="size-3 text-muted-foreground shrink-0" />
										<span className="text-[11px] text-muted-foreground">
											{slot.startTime} - {slot.endTime}
										</span>
									</div>
									<Badge
										variant="outline"
										className={cn(
											"text-[10px] px-1.5 py-0 gap-0.5",
											slot.isOnline
												? "border-blue-200 text-blue-600 bg-blue-50"
												: "border-amber-200 text-amber-600 bg-amber-50",
										)}
									>
										{slot.isOnline ? (
											<Video className="size-2.5" />
										) : (
											<MapPin className="size-2.5" />
										)}
										{slot.isOnline ? "Online" : "In-person"}
									</Badge>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon-sm"
								className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
							>
								<Plus className="size-3.5" />
							</Button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
