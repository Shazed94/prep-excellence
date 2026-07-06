import { format } from "date-fns";
import {
	AlertTriangle,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	Clock,
	Plus,
	Settings,
	User,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetOwnTeacherProfile, useGetTeacherMe } from "@/hooks/teacher";
import { useScheduleStore } from "../store";
import { TeacherProfileDialog } from "./teacher-profile-dialog";

export function ScheduleHeader() {
	const {
		currentDate,
		view,
		setView,
		navigateNext,
		navigatePrev,
		goToToday,
		openAddAvailability,
		openBlockTime,
	} = useScheduleStore();

	const [profileDialogOpen, setProfileDialogOpen] = useState(false);

	const { data: teacherMe, isLoading: loadingMe } = useGetTeacherMe();
	const { data: profileRes, isLoading: loadingProfile } =
		useGetOwnTeacherProfile(teacherMe?.id);

	const hasProfile = !!profileRes?.data?.id;
	const isLoading = loadingMe || loadingProfile;
	const name = teacherMe?.name ?? "";
	const email = teacherMe?.email ?? "";
	const image = teacherMe?.image ?? "";

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	const viewLabel =
		view === "month"
			? format(currentDate, "MMMM yyyy")
			: view === "week"
				? `${format(currentDate, "MMM d")} - ${format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}`
				: format(currentDate, "EEEE, MMMM d, yyyy");

	return (
		<>
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b bg-background">
				<div className="flex items-center gap-3">
					<CalendarDays className="size-5 text-primary" />
					<h1 className="text-lg font-semibold text-foreground">My Schedule</h1>
					{!isLoading && !hasProfile && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge
									variant="outline"
									className="border-amber-300 bg-amber-50 text-amber-700 gap-1 text-xs cursor-help"
								>
									<AlertTriangle className="size-3" />
									Profile Incomplete
								</Badge>
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-60">
								<p className="text-xs">
									Complete your one-to-one teaching profile to start accepting
									bookings and adding availability.
								</p>
							</TooltipContent>
						</Tooltip>
					)}
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

					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Button
									variant="gradient"
									size="sm"
									onClick={hasProfile ? openAddAvailability : undefined}
									disabled={!hasProfile || isLoading}
									className="gap-1.5"
								>
									<Plus className="size-4" />
									<span className="hidden sm:inline">Add Availability</span>
								</Button>
							</span>
						</TooltipTrigger>
						{!hasProfile && !isLoading && (
							<TooltipContent side="bottom">
								<p className="text-xs">
									Complete your profile first to add availability
								</p>
							</TooltipContent>
						)}
					</Tooltip>

					<Button
						variant="outline"
						size="sm"
						onClick={hasProfile ? openBlockTime : undefined}
						disabled={!hasProfile || isLoading}
						className="gap-1.5"
					>
						<Clock className="size-4" />
						<span className="hidden sm:inline">Block Time</span>
					</Button>

					{/* Teacher Avatar & Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon-sm"
								className="rounded-full size-9 p-0 border-2 border-primary/10 hover:border-primary/30 transition-colors"
							>
								{isLoading ? (
									<Skeleton className="size-full rounded-full" />
								) : (
									<Avatar size="sm">
										<AvatarImage src={image} alt={name} />
										<AvatarFallback className="text-xs bg-primary/10 text-primary">
											{initials || <User className="size-4" />}
										</AvatarFallback>
									</Avatar>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel className="font-normal">
								<div className="flex items-center gap-2">
									<Avatar size="sm">
										<AvatarImage src={image} alt={name} />
										<AvatarFallback className="text-xs bg-primary/10 text-primary">
											{initials || <User className="size-3" />}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm font-medium truncate max-w-40">
											{name || "Teacher"}
										</span>
										<span className="text-xs text-muted-foreground truncate max-w-40">
											{email || ""}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setProfileDialogOpen(true)}
								className="gap-2 cursor-pointer"
							>
								{hasProfile ? (
									<>
										<Settings className="size-4" />
										<span>Update Profile</span>
									</>
								) : (
									<>
										<User className="size-4" />
										<span>Complete Profile</span>
									</>
								)}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			<TeacherProfileDialog
				open={profileDialogOpen}
				onOpenChange={setProfileDialogOpen}
			/>
		</>
	);
}
