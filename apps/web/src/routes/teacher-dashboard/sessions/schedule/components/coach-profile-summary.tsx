import { Award, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	useGetOwnTeacherProfile,
	useGetTeacherMe,
} from "@/hooks/teacher";
import { Skeleton } from "@/components/ui/skeleton";

export function CoachProfileSummary() {
	const { data: teacherMe, isLoading: loadingMe } = useGetTeacherMe();
	const { data: profileRes, isLoading: loadingProfile } =
		useGetOwnTeacherProfile(teacherMe?.id);

	const name = teacherMe?.name ?? "";
	const email = teacherMe?.email ?? "";
	const image = teacherMe?.image ?? "";
	const rating = profileRes?.data?.rating ?? 0;
	const totalSessions = profileRes?.data?.totalSessions ?? 0;

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("");

	if (loadingMe || loadingProfile) {
		return (
			<div className="flex items-center gap-3 px-4 py-3">
				<Skeleton className="size-10 rounded-full shrink-0" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-3 w-40" />
					<div className="flex gap-3">
						<Skeleton className="h-3 w-12" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3 px-4 py-3">
			<Avatar size="lg">
				<AvatarImage src={image} alt={name} />
				<AvatarFallback className="bg-primary/10 text-primary text-sm">
					{initials}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold text-foreground truncate">
					{name}
				</p>
				<p className="text-xs text-muted-foreground truncate">{email}</p>
				<div className="flex items-center gap-3 mt-1">
					<div className="flex items-center gap-1">
						<Star className="size-3 fill-secondary text-secondary" />
						<span className="text-xs font-medium text-foreground">
							{rating}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Award className="size-3 text-primary" />
						<span className="text-xs text-muted-foreground">
							{totalSessions} sessions
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
