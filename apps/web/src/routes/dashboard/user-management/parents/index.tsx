import { createFileRoute } from "@tanstack/react-router";
import { ParentListPage } from "@/components/userManagement/parents/parent-list-page";

export const Route = createFileRoute("/dashboard/user-management/parents/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ParentListPage />;
}
