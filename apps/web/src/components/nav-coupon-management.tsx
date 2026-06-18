import { Link, useLocation } from "@tanstack/react-router";
import { LayoutList } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
	title: string;
	url?: string;
	icon?: React.ComponentType<any>;
}

export function NavCouponManagement({ items }: { items: NavItem[] }) {
	const location = useLocation();
	const pathname = location.pathname;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Coupon Management</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild isActive={pathname === item.url}>
							<Link to={item.url ?? "#"}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
