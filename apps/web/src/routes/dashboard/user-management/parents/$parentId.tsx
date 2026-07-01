import { createFileRoute } from "@tanstack/react-router";
import EditParentForm from "@/components/userManagement/parents/edit-parents";

export const Route = createFileRoute(
	"/dashboard/user-management/parents/$parentId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { parentId } = Route.useParams();
	return <EditParentForm parentId={parentId} />;
}
