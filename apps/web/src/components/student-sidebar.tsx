import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  LogOut,
  Receipt,
  TrendingUp,
  User,
  UserSearch,
  X,
} from "lucide-react";
import type * as React from "react";
import { useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getUser, useAuth } from "@/store/useAuth";

const studentNav = [
  { title: "Overview", url: "/student-dashboard", icon: Home, exact: true },
  { title: "My Courses", url: "/student-dashboard/my-courses", icon: BookOpen },
  {
    title: "My Coaching",
    url: "/student-dashboard/coaching",
    icon: GraduationCap,
  },
  {
    title: "Find Tutors",
    url: "/student-dashboard/find-tutor",
    icon: UserSearch,
  },
  {
    title: "My Sessions",
    url: "/student-dashboard/sessions",
    icon: CalendarDays,
  },
  {
    title: "SAT Results",
    url: "/student-dashboard/sat-results",
    icon: TrendingUp,
  },
  { title: "My Orders", url: "/student-dashboard/orders", icon: Receipt },
  { title: "My Profile", url: "/student-dashboard/profile", icon: User },
];

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = getUser();
  const navigate = useNavigate();
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar();
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (url: string, exact?: boolean) => {
    if (exact) return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  const handleCloseSidebar = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  const handleLogout = useCallback(() => {
    logout();
    navigate({ to: "/" });
    setOpenMobile(false);
  }, [logout, navigate, setOpenMobile]);

  if (!user) return null;

  const initials = (user.name ?? "S")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full gap-2 py-1">
          <Link to="/" className={cn("px-2 flex-1", !open && "px-0")}>
            {open ? (
              <img
                src="/logo-white.png"
                alt="Prep Excellence"
                className="h-14 w-auto object-contain"
              />
            ) : (
              <img
                src="/favicon-white.png"
                alt="Prep Excellence"
                className="h-7 w-7 object-contain mx-auto"
              />
            )}
          </Link>
          {isMobile && openMobile && (
            <button
              type="button"
              onClick={handleCloseSidebar}
              className="p-2 rounded hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X size={18} className="text-white/70" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4">
        {open && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 px-2 mb-2">
            Menu
          </p>
        )}
        <SidebarMenu className="gap-0.5">
          {studentNav.map((item) => {
            const active = isActive(item.url, item.exact);
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className={cn(
                    "rounded-lg transition-all duration-150 h-10 text-white/70 hover:text-white hover:bg-white/10",
                    active && "bg-white/15 text-white font-medium",
                  )}
                >
                  <Link to={item.url}>
                    <item.icon size={17} />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        {/* User info */}
        {open && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2 rounded-lg bg-white/8">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-white/50 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-red-300/80 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm",
            !open && "justify-center px-0",
          )}
        >
          <LogOut size={16} />
          {open && <span>Logout</span>}
        </button>
      </SidebarFooter>

      <SidebarRail className="after:bg-transparent" />
    </Sidebar>
  );
}
