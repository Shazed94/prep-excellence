import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon, Users } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavUserManagement({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const location = useLocation();
	const pathname = location.pathname;
	const { isMobile, setOpenMobile } = useSidebar();

	// Check if any sub-item is active
	const isItemActive = (item: (typeof items)[0]) => {
		if (item.url && item.url !== "#" && pathname === item.url) return true;

		if (item.items) {
			return item.items.some(
				(subItem) =>
					pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
			);
		}

		return false;
	};

	const handleNavigationClick = () => {
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>User Management</SidebarGroupLabel>

			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={isItemActive(item)}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon ? <item.icon /> : <Users />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => {
										const isActive =
											pathname === subItem.url ||
											pathname.startsWith(`${subItem.url}/`);

										return (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													asChild
													isActive={isActive}
													onClick={handleNavigationClick}
												>
													<Link to={subItem.url}>
														<span>{subItem.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										);
									})}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
