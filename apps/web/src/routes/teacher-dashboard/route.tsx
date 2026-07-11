import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import DashboardHeader from "@/components/DashboardHeader";
import { TeacherSidebar } from "@/components/teacher-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAccessToken } from "@/store/useAuth";

function TeacherLayout() {
  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset className="flex flex-col  overflow-x-hidden">
        <DashboardHeader />
        <main className="flex-1 p-2 md:p-6 bg-[#ffffff] mt-[55px] overflow-x-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/teacher-dashboard")({
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
  component: TeacherLayout,
});
