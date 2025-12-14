import { Link, useLocation, useMatches } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

// Helper function to format breadcrumb text
function formatBreadcrumb(segment: string): string {
	return segment
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function DashboardHeader() {
	const { open } = useSidebar();
	const location = useLocation();
	const matches = useMatches();

	// Get all valid route paths from the matched routes
	const validRoutes = new Set(
		matches.map((match) => match.pathname).filter((path) => path !== "/"),
	);

	// Generate breadcrumbs from the current pathname
	const pathSegments = location.pathname
		.split("/")
		.filter((segment) => segment !== "");

	// Build breadcrumb items, only including segments that are part of valid routes
	const breadcrumbs = pathSegments
		.map((segment, index) => {
			const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
			const isValidRoute = validRoutes.has(path);
			const isLast = index === pathSegments.length - 1;

			return {
				label: formatBreadcrumb(segment),
				path: path,
				isLast: isLast,
				isValidRoute: isValidRoute || isLast, // Always include the last segment
			};
		})
		.filter((crumb) => crumb.isValidRoute); // Only show segments that are valid routes

	return (
		<motion.header
			initial={{ left: open ? "242px" : "45px" }}
			animate={{ left: open ? "242px" : "45px" }}
			transition={{ duration: 0.2, ease: "linear" }}
			className={`flex bg-sidebar fixed top-0 right-0 z-99! text-white h-14 rounded-r-sm shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12`}
		>
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1 cursor-pointer" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb className="">
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => (
							<div key={crumb.path} className="flex items-center gap-2">
								{index > 0 && <BreadcrumbSeparator className="text-white" />}
								<BreadcrumbItem className="text-white">
									{crumb.isLast ? (
										<BreadcrumbPage className="text-white">
											{crumb.label}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link
												to={crumb.path}
												className="text-white hover:text-white/80"
											>
												{crumb.label}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</motion.header>
	);
}
