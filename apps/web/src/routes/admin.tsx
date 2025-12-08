import {
	createFileRoute,
	Outlet,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getAccessToken, useAuth } from "@/store/useAuth";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function AdminLayout() {
	const navigate = useNavigate();
	const { hydrate, isHydrated, accessToken } = useAuth();

	// Hydrate auth state from localStorage on mount
	useEffect(() => {
		if (!isHydrated) {
			hydrate();
		}
	}, [hydrate, isHydrated]);

	// Redirect if not authenticated after hydration
	useEffect(() => {
		if (isHydrated && !accessToken) {
			navigate({ to: "/" });
		}
	}, [isHydrated, accessToken, navigate]);

	//   const handleLogout = () => {
	//     // Remove tokens from localStorage
	//     localStorage.removeItem("accessToken");
	//     localStorage.removeItem("refreshToken");
	//     localStorage.removeItem("user");

  //     // Redirect to home page
  //     navigate({ to: "/" });
  //   };
  return (
    <SidebarProvider>
      <AppSidebar />{" "}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/admin")({
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
