import { createFileRoute } from "@tanstack/react-router";
import AddParentForm from "@/components/userManagement/parents/add-parents";

export const Route = createFileRoute(
	"/dashboard/user-management/parents/add-parent",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AddParentForm />;
}
