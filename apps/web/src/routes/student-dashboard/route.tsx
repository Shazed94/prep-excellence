import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import DashboardHeader from "@/components/DashboardHeader";
import { StudentSidebar } from "@/components/student-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAccessToken } from "@/store/useAuth";

function StudentLayout() {
	return (
		<SidebarProvider>
			<StudentSidebar />
			<SidebarInset className="flex flex-col  overflow-x-hidden">
				<DashboardHeader />
				<main className="flex-1 p-2 md:p-6 bg-[#FAFAFA] mt-[72px] overflow-x-hidden">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export const Route = createFileRoute("/student-dashboard")({
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
	component: StudentLayout,
});
