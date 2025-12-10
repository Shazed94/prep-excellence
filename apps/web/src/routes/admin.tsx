import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar />{" "}
			<SidebarInset>
				<header className="flex bg-sidebar text-white h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1 cursor-pointer" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb className="">
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block text-white">
									<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block text-white" />
								<BreadcrumbItem>
									<BreadcrumbPage className="text-white">
										Instructor portal
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<main className="flex-1 p-6 bg-[#FAFAFA]">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
});
