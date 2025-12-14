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

export default function DashboardHeader() {
	const { open } = useSidebar();
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
						<BreadcrumbItem className="hidden md:block text-white">
							<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block text-white" />
						<BreadcrumbItem>
							<BreadcrumbPage className="text-white">
								Data Fetching
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</motion.header>
	);
}
