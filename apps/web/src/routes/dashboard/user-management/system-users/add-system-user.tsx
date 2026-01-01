import { createFileRoute } from "@tanstack/react-router";
import AddSystemUserForm from "@/components/userManagement/system-users/add-system-user";

export const Route = createFileRoute(
	"/dashboard/user-management/system-users/add-system-user",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AddSystemUserForm />;
}
