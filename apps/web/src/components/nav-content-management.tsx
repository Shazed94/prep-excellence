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
	useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
	title: string;
	url?: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: NavItem[];
}

export function NavContentManagement({
	contentManagement,
}: {
	contentManagement: NavItem[];
}) {
	const location = useLocation();
	const pathname = location.pathname;
	const { isMobile, setOpenMobile } = useSidebar();

	const handleNavigationClick = () => {
		// Close mobile sidebar on navigation
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	// Check if any sub-item is active (current path matches or is under the route)
	const isItemActive = (item: NavItem): boolean => {
		if (
			item.url &&
			item.url !== "#" &&
			(pathname === item.url || pathname.startsWith(`${item.url}/`))
		)
			return true;
		if (item.items) {
			return item.items.some((subItem) => {
				if (pathname === subItem.url || pathname.startsWith(`${subItem.url}/`))
					return true;
				// Check nested items
				if (subItem.items) {
					return subItem.items.some(
						(nestedItem) =>
							pathname === nestedItem.url ||
							pathname.startsWith(`${nestedItem.url}/`),
					);
				}
				return false;
			});
		}
		return false;
	};

	// Render a sub-item which might have its own nested items
	const renderSubItem = (subItem: NavItem) => {
		const isActive =
			pathname === subItem.url || pathname.startsWith(`${subItem.url}/`);

		if (subItem.items && subItem.items.length > 0) {
			// This sub-item has nested items
			const hasActiveNested = subItem.items.some(
				(nested) =>
					pathname === nested.url || pathname.startsWith(`${nested.url}/`),
			);

			return (
				<Collapsible
					key={subItem.title}
					asChild
					defaultOpen={hasActiveNested}
					className="group/nested"
				>
					<SidebarMenuSubItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuSubButton>
								<span>{subItem.title}</span>
								<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested:rotate-90" />
							</SidebarMenuSubButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{subItem.items.map((nestedItem) => {
									const nestedActive =
										pathname === nestedItem.url ||
										pathname.startsWith(`${nestedItem.url}/`);
									return (
										<SidebarMenuSubItem key={nestedItem.title}>
											<SidebarMenuSubButton
												asChild
												isActive={nestedActive}
												onClick={handleNavigationClick}
											>
												<Link to={nestedItem.url}>
													<span>{nestedItem.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									);
								})}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuSubItem>
				</Collapsible>
			);
		}

		// Regular sub-item without nested items
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
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Website Manager</SidebarGroupLabel>
			<SidebarMenu>
				{contentManagement.map((item) =>
					"items" in item ? (
						// ✅ dropdown group
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
										{item?.items?.map((subItem) => renderSubItem(subItem))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					) : (
						// ✅ single link
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
