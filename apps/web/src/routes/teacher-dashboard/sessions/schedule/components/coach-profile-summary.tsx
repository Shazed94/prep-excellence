import { Award, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { coachProfile } from "../dummy-data";

export function CoachProfileSummary() {
	const initials = coachProfile.name
		.split(" ")
		.map((n) => n[0])
		.join("");

	return (
		<div className="flex items-center gap-3 px-4 py-3">
			<Avatar size="lg">
				<AvatarImage src={coachProfile.photoUrl} alt={coachProfile.name} />
				<AvatarFallback className="bg-primary/10 text-primary text-sm">
					{initials}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold text-foreground truncate">
					{coachProfile.name}
				</p>
				<p className="text-xs text-muted-foreground truncate">
					{coachProfile.email}
				</p>
				<div className="flex items-center gap-3 mt-1">
					<div className="flex items-center gap-1">
						<Star className="size-3 fill-secondary text-secondary" />
						<span className="text-xs font-medium text-foreground">
							{coachProfile.rating}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Award className="size-3 text-primary" />
						<span className="text-xs text-muted-foreground">
							{coachProfile.totalSessions} sessions
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
