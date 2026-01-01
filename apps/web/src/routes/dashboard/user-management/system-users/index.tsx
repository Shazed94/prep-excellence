import { createFileRoute } from "@tanstack/react-router";
import { SystemUserListPage } from "@/components/userManagement/system-users/system-user-list-page";

export const Route = createFileRoute(
	"/dashboard/user-management/system-users/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <SystemUserListPage />;
}
