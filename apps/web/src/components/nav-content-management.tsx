import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

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
} from "@/components/ui/sidebar";

export function NavContentManagement({
	contentManagement,
}: {
	contentManagement: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const location = useLocation();
	const pathname = location.pathname;

	// Check if any sub-item is active (current path matches)
	const isItemActive = (item: (typeof contentManagement)[0]) => {
		if (item.url && pathname === item.url) return true;
		if (item.items) {
			return item.items.some((subItem) => pathname === subItem.url);
		}
		return false;
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Website Manager</SidebarGroupLabel>
			<SidebarMenu>
				{contentManagement.map((item) =>
					item.items ? (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={isItemActive(item)}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items.map((subItem) => {
											const isActive = pathname === subItem.url;
											return (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild isActive={isActive}>
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
					) : (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={pathname === item.url}
							>
								<Link to={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					),
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}
