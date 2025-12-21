"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Bot, LogOut, User } from "lucide-react";
import type * as React from "react";
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
import { getUser } from "@/store/useAuth";
import { NavContentManagement } from "./nav-content-management";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Learning Management",
			url: "/admin/learning-management",
			icon: Bot,
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
			title: "Instructor Portal",
			url: "/dashboard/instructor-portal/course",
			icon: Bot,
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
			icon: Bot,
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
			title: "Practice Test",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Practice Configuration",
					url: "/dashboard/question-bank/practice-test",
				},
				// {
				// 	title: "Full Long Practice",
				// 	url: "/dashboard/question-bank/practice-test/full-long-practice",
				// },
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
			icon: Bot,
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
	//   projects: [
	//     {
	//       name: "Design Engineering",
	//       url: "#",
	//       icon: Frame,
	//     },
	//     {
	//       name: "Sales & Marketing",
	//       url: "#",
	//       icon: PieChart,
	//     },
	//   ],
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
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavContentManagement contentManagement={data.contentManagement} />
				{/* <NavProjects projects={data.projects} /> */}
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
