import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { getAccessToken, getUser, useAuth } from "@/store/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function AdminLayout() {
  const user = getUser();
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

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirect to home page
    navigate({ to: "/" });
  };
  return (
    <SidebarProvider>
      {/* <AppSidebar />{" "} */}
      {/* This replaces your fixed sidebar; customize AppSidebar with your nav content */}
      <main className="flex-1 p-6">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <a className="p-2 rounded hover:bg-gray-200 transition" href={to}>
      {label}
    </a>
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
