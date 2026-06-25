import { Link, useNavigate } from "@tanstack/react-router";
import {
	BookCheckIcon,
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
import { useCallback, useMemo } from "react";
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
	return user?.systemUser?.role || user?.role || "Student";
};

// Helper function to check if menu should be visible for role
const isMenuVisibleForRole = (menuTitle: string, roleName: string): boolean => {
	const rolePermissions: Record<string, string[]> = {
		SuperAdmin: [
			"Learning Management",
			"Question Bank",
			"Test Configuration",
			"Content Management",
			"User Management",
			"Teachers Dashboard",
			"Students Dashboard",
			"Coupon Management",
		],
		Teacher: [
			"Teachers Dashboard",
			"Question Bank",
			"Test Configuration",
			"Documentation",
		],
		Student: ["Students Dashboard", "Documentation"],
		Instructor: ["Instructor Portal", "Documentation"],
	};

	const allowedMenus = rolePermissions[roleName] || [];
	return allowedMenus.includes(menuTitle);
};

// This is sample data.
const data = {
	navMain: [
		// {
		// 	title: "Learning Management",
		// 	url: "/admin/learning-management",
		// 	icon: BookOpenCheck,
		// 	items: [
		// 		{
		// 			title: "Create",
		// 			url: "/admin/learning-management/create",
		// 		},
		// 		{
		// 			title: "All Courses",
		// 			url: "/admin/learning-management/all-courses",
		// 		},
		// 	],
		// },
		{
			title: "Students Dashboard",
			url: "/dashboard/students-dashboard",
			icon: ShieldUser,
			items: [
				{
					title: "My Profile",
					url: "/dashboard/student/my-profile",
				},
				{
					title: "My Course",
					url: "/dashboard/student/my-course",
				},
				// {
				// 	title: "Explorer",
				// 	url: "/dashboard/student/explorer",
				// },
				{
					title: "SAT-Result",
					url: "/dashboard/student/result",
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
				{
					title: "Add Instructor",
					url: "/dashboard/instructor-portal/add-instructor",
				},
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
					url: "/dashboard/course-management",
				},
				{
					title: "Course Category",
					url: "/dashboard/course-management/course-category",
				},
				// {
				// 	title: "One to One Sessions",
				// 	url: "/dashboard/one-to-one-session",
				// },
				// {
				// 	title: "Explorer",
				// 	url: "/dashboard/explorer",
				// },
				// {
				// 	title: "My Profile",
				// 	url: "/dashboard/teacher/my-profile",
				// },
				{
					title: "Student Test Attempts",
					url: "/dashboard/student-test-attempts",
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
				// {
				// 	title: "Parents",
				// 	url: "/dashboard/user-management/parents",
				// },
				// {
				// 	title: "System Users",
				// 	url: "/dashboard/user-management/system-users",
				// },
			],
		},
	],
};

export function StudentSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
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
