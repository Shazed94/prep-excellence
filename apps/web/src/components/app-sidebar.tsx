"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import {
	BookCheckIcon,
	BookOpenCheck,
	FileText,
	Home,
	LandmarkIcon,
	LayoutList,
	LogOut,
	ShieldUser,
	User,
	UserCog2,
	Users,
	X,
} from "lucide-react";
import type * as React from "react";
import { useCallback } from "react";
import { NavMain } from "@/components/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getUser, useAuth } from "@/store/useAuth";
import { NavContentManagement } from "./nav-content-management";
import { NavUserManagement } from "./nav-user-management";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Learning Management",
			url: "/admin/learning-management",
			icon: BookOpenCheck,
			items: [
				{
					title: "Create",
					url: "/admin/learning-management/create",
				},
				{
					title: "All Courses",
					url: "/admin/learning-management/all-courses",
				},
			],
		},
		{
			title: "Students Dashboard",
			url: "/dashboard/students-dashboard",
			icon: ShieldUser,
			items: [
				{
					title: "My Profile",
					url: "/dashboard/students-dashboard/my-profile",
				},
				{
					title: "My Course",
					url: "/dashboard/students-dashboard/my-course",
				},
				{
					title: "Explorer",
					url: "/dashboard/students-dashboard/explorer",
				},
				{
					title: "SAT-Result",
					url: "/dashboard/students-dashboard/result",
				},
			],
		},
		{
			title: "Instructor Portal",
			url: "/dashboard/instructor-portal/course",
			icon: UserCog2,
			items: [
				{
					title: "Course",
					url: "/dashboard/instructor-portal/courses",
				},
				{
					title: "Add Course",
					url: "/dashboard/instructor-portal/create-course",
				},
				// {
				//   title: "Add Instructor",
				//   url: "/dashboard/instructor-portal/add-instructor",
				// },
				{
					title: "All Instructor",
					url: "/dashboard/instructor-portal/view-instructor",
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
			title: "Question Bank",
			url: "#",
			icon: LandmarkIcon,
			items: [
				{
					title: "Question Taxonomy",
					url: "/dashboard/question-bank/question-configuration",
				},
				{
					title: "All Questions",
					url: "/dashboard/question-bank/practice-test-configuration",
				},
			],
		},
		{
			title: "Test Configuration",
			url: "#",
			icon: BookCheckIcon,
			items: [
				{
					title: "Test Practice",
					url: "/dashboard/question-bank/practice-test",
				},
				{
					title: "Full Length Practice",
					url: "/dashboard/question-bank/full_length_practice/",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: FileText,
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
		// {
		//   title: "Settings",
		//   url: "#",
		//   icon: Settings2,
		//   items: [
		//     {
		//       title: "General",
		//       url: "#",
		//     },
		//     {
		//       title: "Team",
		//       url: "#",
		//     },
		//     {
		//       title: "Billing",
		//       url: "#",
		//     },
		//     {
		//       title: "Limits",
		//       url: "#",
		//     },
		//   ],
		// },
	],
	contentManagement: [
		{
			title: "Content Management",
			icon: LayoutList,
			items: [
				{
					title: "Guidance Form Submissions",
					url: "/dashboard/content-management/guidance-form-submissions",
				},
				{
					title: "Newsletter",
					url: "/dashboard/content-management/newsletter",
				},
				{
					title: "Trusted Companies",
					url: "/dashboard/content-management/trusted-companies",
				},
				{
					title: "Free Seminars",
					url: "/dashboard/content-management/free-seminars",
				},
				{
					title: "Contact Us",
					url: "/dashboard/content-management/contact-us",
				},
				{
					title: "Tutor Requests",
					url: "/dashboard/content-management/tutor-requests",
				},
				{
					title: "College Essay Reviews",
					url: "/dashboard/content-management/college-essay-reviews",
				},
				{
					title: "Blogs",
					url: "#",
					items: [
						{
							title: "Blog Categories",
							url: "/dashboard/content-management/blog-categories",
						},
						{
							title: "All Blogs",
							url: "/dashboard/content-management/blogs-list",
						},
						{
							title: "Create Blog",
							url: "/dashboard/content-management/create-blog",
						},
					],
				},
			],
		},
	],

	userManagement: [
		{
			title: "User Management",
			url: "#",
			icon: Users,
			items: [
				{
					title: "Students",
					url: "/dashboard/user-management/students",
				},
				{
					title: "Teachers",
					url: "/dashboard/user-management/teachers",
				},
				{
					title: "Parents",
					url: "/dashboard/user-management/parents",
				},
				{
					title: "System Users",
					url: "/dashboard/user-management/system-users",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const user = getUser();
	const navigate = useNavigate();
	const { open, openMobile, setOpenMobile, isMobile } = useSidebar();
	const { logout } = useAuth();

	// Close sidebar on mobile when navigation occurs
	const handleNavigate = useCallback(
		(to: string) => {
			if (isMobile && openMobile) {
				setOpenMobile(false);
			}
			navigate({ to });
		},
		[isMobile, openMobile, setOpenMobile, navigate],
	);

	const handleCloseSidebar = useCallback(() => {
		setOpenMobile(false);
	}, [setOpenMobile]);

	const handleLogout = useCallback(() => {
		logout();
		handleNavigate("/");
		setOpenMobile(false);
	}, [logout, handleNavigate, setOpenMobile]);

	if (!user) {
		return null;
	}

	return (
		<Sidebar collapsible="icon" {...props} className="">
			<SidebarHeader>
				<div className="flex items-center justify-between w-full gap-2">
					<Link
						to="/"
						target="_blank"
						className={cn(
							" px-2",
							!open && "px-0", // shorten padding
						)}
					>
						<div className="max-w-36 mx-auto ">
							{open ? (
								<img
									src="/logo-white.png"
									alt={user.name}
									className="h-full w-full rounded-lg object-cover"
								/>
							) : (
								<img
									src="/favicon-white.png"
									alt={user.name}
									className="h-full w-full rounded-lg object-cover"
								/>
							)}
						</div>
					</Link>
					{/* Mobile only close button */}
					{isMobile && openMobile && (
						<button
							type="button"
							onClick={handleCloseSidebar}
							className="p-2 rounded hover:bg-gray-700 transition-colors flex-shrink-0"
							aria-label="Close sidebar"
						>
							<X size={20} className="text-white" />
						</button>
					)}
				</div>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavContentManagement contentManagement={data.contentManagement} />
				<NavUserManagement items={data.userManagement} />

				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>
				<div className="border-t pt-5 space-y-2">
					<button
						type="button"
						onClick={() => navigate({ to: "/" })}
						className="w-full flex items-center gap-2 p-2 rounded text-blue-500 bg-gray-100 hover:bg-gray-200 cursor-pointer"
					>
						<Home size={18} />
						{open && <span>Back to Website</span>}
					</button>

					<button
						type="button"
						onClick={handleLogout}
						className="w-full flex items-center gap-2 p-2 rounded text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer"
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
