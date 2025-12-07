import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { getAccessToken, getUser, useAuth } from "@/store/useAuth";

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
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r">
        <div className="p-4 ">
          <h4 className="min-w-max font-bold text-xl">Admin Panel</h4>
          <small className="text-gray-600 text-md">
            {" "}
            {user?.role?.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </small>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink to="/admin" label="Dashboard" />
          <NavLink to="/admin/users" label="Users" />
        </nav>
        {/* Logout Button at Bottom */}
        <div className="p-4 border-t">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
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
