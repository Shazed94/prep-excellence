import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAccessToken } from "@/store/useAuth";

function AdminLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader />
				<main className="flex-1 p-6 bg-[#FAFAFA] mt-[72px]">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		// Only check auth on client side
		if (typeof window !== "undefined") {
			const accessToken = getAccessToken();

			if (!accessToken) {
				throw redirect({
					to: "/",
					replace: true,
				});
			}
		}
	},
	component: AdminLayout,
});
