import { Link, useNavigate } from "@tanstack/react-router";
import {
	BookCheckIcon,
	CalendarClock,
	Home,
	LandmarkIcon,
	LayoutList,
	LogOut,
	MonitorCheck,
	UserCog2,
	Users,
	X,
} from "lucide-react";
import type * as React from "react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
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
import { NavCouponManagement } from "./nav-coupon-management";
import { NavUserManagement } from "./nav-user-management";

// Helper function to get user role name
const getUserRole = (user: any): string => {
	return user?.role || "Student";
};

// Helper function to check if menu should be visible for role
const isMenuVisibleForRole = (menuTitle: string, roleName: string): boolean => {
	const rolePermissions: Record<string, string[]> = {
		SuperAdmin: [
			"Course Management",
			"Coaching Management",
			"Question Bank",
			"Test Configuration",
			"Student Activity",
			"One-to-One Sessions",
			"Content Management",
			"User Management",
			"Coupon Management",
		],
	};

	const allowedMenus = rolePermissions[roleName] || [];
	return allowedMenus.includes(menuTitle);
};

// Navigation data
const data = {
	navMain: [
		// ── SuperAdmin only ──────────────────────────────────────────
		{
			title: "Course Management",
			url: "/dashboard/course-management",
			icon: UserCog2,
			items: [
				{
					title: "All Courses",
					url: "/dashboard/course-management",
				},
				{
					title: "Create Course",
					url: "/dashboard/course-management/create",
				},
				{
					title: "All Instructors",
					url: "/dashboard/course-management/teachers",
				},
			],
		},
		{
			title: "Coaching Management",
			url: "/dashboard/coaching-management",
			icon: Users,
			items: [
				{
					title: "All Courses",
					url: "/dashboard/coaching-management",
				},
				{
					title: "Create Course",
					url: "/dashboard/coaching-management/create",
				},
				{
					title: "All Teachers",
					url: "/dashboard/coaching-management/teachers",
				},
			],
		},
		{
			title: "Student Activity",
			url: "/dashboard/student-test-attempts",
			icon: MonitorCheck,
			items: [
				{
					title: "Student Test Attempts",
					url: "/dashboard/student-test-attempts",
				},
			],
		},
		{
			title: "One-to-One Sessions",
			url: "/dashboard/one-to-one-session",
			icon: CalendarClock,
			items: [
				{
					title: "All Sessions",
					url: "/dashboard/one-to-one-session",
				},
			],
		},
		// ── Teacher only ──────────────────────────────────────────────
		{
			title: "Teachers Dashboard",
			url: "/dashboard/course-management",
			icon: UserCog2,
			items: [
				{
					title: "My Course",
					url: "/dashboard/course-management",
				},
				{
					title: "Course Category",
					url: "/dashboard/course-management/course-category",
				},
				{
					title: "Student Test Attempts",
					url: "/dashboard/student-test-attempts",
				},
			],
		},
		// ── Instructor only ───────────────────────────────────────────
		{
			title: "Instructor Portal",
			url: "/dashboard/instructor-portal/courses",
			icon: UserCog2,
			items: [
				{
					title: "My Courses",
					url: "/dashboard/instructor-portal/courses",
				},
				{
					title: "Create Course",
					url: "/dashboard/instructor-portal/create-course",
				},
			],
		},
		// ── Student only ──────────────────────────────────────────────
		{
			title: "Students Dashboard",
			url: "/dashboard/student/my-profile",
			icon: UserCog2,
			items: [
				{
					title: "My Profile",
					url: "/dashboard/student/my-profile",
				},
				{
					title: "My Courses",
					url: "/dashboard/student/my-course",
				},
				{
					title: "SAT Result",
					url: "/dashboard/student/result",
				},
			],
		},
		// ── Shared (SuperAdmin + Teacher) ─────────────────────────────
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
	],
	contentManagement: [
		{
			title: "Content Management",
			icon: LayoutList,
			items: [
				// {
				// 	title: "Guidance Form Submissions",
				// 	url: "/dashboard/content-management/guidance-form-submissions",
				// },
				{
					title: "Newsletter",
					url: "/dashboard/content-management/newsletter",
				},
				{
					title: "Trusted Companies",
					url: "/dashboard/content-management/trusted-companies",
				},
				// {
				// 	title: "Free Seminars",
				// 	url: "/dashboard/content-management/free-seminars",
				// },
				{
					title: "Contact Us",
					url: "/dashboard/content-management/contact-us",
				},
				// {
				// 	title: "Tutor Requests",
				// 	url: "/dashboard/content-management/tutor-requests",
				// },
				// {
				// 	title: "College Essay Reviews",
				// 	url: "/dashboard/content-management/college-essay-reviews",
				// },
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

	couponManagement: [
		{
			title: "Coupon Management",
			url: "/dashboard/coupon-management",
			icon: LayoutList,
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

	// Get user role
	const userRole = useMemo(() => getUserRole(user), [user]);

	// Filter menus based on role
	const filteredNavMain = useMemo(() => {
		return data.navMain.filter((item) =>
			isMenuVisibleForRole(item.title, userRole),
		);
	}, [userRole]);

	const filteredContentManagement = useMemo(() => {
		if (!isMenuVisibleForRole("Content Management", userRole)) {
			return [];
		}
		return data.contentManagement;
	}, [userRole]);

	const filteredUserManagement = useMemo(() => {
		if (!isMenuVisibleForRole("User Management", userRole)) {
			return [];
		}
		return data.userManagement;
	}, [userRole]);
	const filteredCouponManagement = useMemo(() => {
		if (!isMenuVisibleForRole("Coupon Management", userRole)) {
			return [];
		}
		return data.couponManagement;
	}, [userRole]);

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
		toast.success("Logged out successfully");
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
							className="p-2 rounded hover:bg-gray-700 transition-colors shrink-0"
							aria-label="Close sidebar"
						>
							<X size={20} className="text-white" />
						</button>
					)}
				</div>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={filteredNavMain} />
				{filteredContentManagement.length > 0 && (
					<NavContentManagement contentManagement={filteredContentManagement} />
				)}
				{filteredUserManagement.length > 0 && (
					<NavUserManagement items={filteredUserManagement} />
				)}
				{filteredCouponManagement.length > 0 && (
					<NavCouponManagement items={filteredCouponManagement} />
				)}
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
