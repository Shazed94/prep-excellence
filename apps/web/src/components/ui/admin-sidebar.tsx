import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getUser } from "@/store/useAuth";

export function AppSidebar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirect to home page
    navigate({ to: "/" });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h4 className="min-w-max font-bold text-xl">Admin Panel</h4>
          <small className="text-gray-600 text-md">
            {user?.role?.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </small>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-slate-700! ">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/users">Users</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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
      </SidebarFooter>
    </Sidebar>
  );
}
