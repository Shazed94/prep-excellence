"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	LogOut,
	PieChart,
	Settings2,
	SquareTerminal,
	User,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getUser } from "@/store/useAuth";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "User",
					url: "/dashboard/users",
				},
				{
					title: "All Courses",
					url: "/dashboard/all-courses",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
		{
			title: "Students Dashboard",
			url: "Students-dashboard",
			icon: Bot,
			items: [
				{
					title: "My Course",
					url: "my-course",
				},
				{
					title: "Explorer",
					url: "explorer",
				},
				{
					title: "My Profile",
					url: "my-profile",
				},
			],
		},
		{
			title: "Teachers Dashboard",
			url: "Teachers-dashboard",
			icon: User,
			items: [
				{
					title: "My Course",
					url: "my-course",
				},
				{
					title: "One to One Sessions",
					url: "one-to-one-session",
				},
				{
					title: "Explorer",
					url: "explorer",
				},
				{
					title: "My Profile",
					url: "my-profile",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "/admin/instructor-portal/tutorials",
				},
				{
					title: "Discussion Board",
					url: "/admin/instructor-portal/discussion-board",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const user = getUser();
	const navigate = useNavigate();

	const { open } = useSidebar();

	if (!user) {
		return null;
	}

	const handleLogout = () => {
		// Remove tokens from localStorage
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");

		// Redirect to home page
		navigate({ to: "/" });
	};
	return (
		<Sidebar collapsible="icon" {...props} className="">
			<SidebarHeader>
				<Link
					to="/"
					target="_blank"
					className={cn(
						" px-2",
						!open && "px-0", // shorten padding
					)}
				>
					<div className="max-w-32 mx-auto ">
						<img
							src="/Logo.png"
							alt={user.name}
							className="h-full w-full rounded-lg object-cover"
						/>
					</div>

					{/* hide text when collapsed */}
					{/* {open && (
            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.role}</span>
            </div>
          )} */}
				</Link>
			</SidebarHeader>

			<SidebarContent className="">
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<div className={` border-t pt-5`}>
					<button
						type="button"
						onClick={handleLogout}
						className="w-full flex items-center gap-2 p-2 rounded text-red-500 bg-red-50 transition cursor-pointer hover:bg-red-100"
					>
						<LogOut size={18} />
						{open && <span>Logout</span>}
					</button>
				</div>
			</SidebarFooter>
			<SidebarRail className="after:bg-transparent" />
		</Sidebar>
	);
}
