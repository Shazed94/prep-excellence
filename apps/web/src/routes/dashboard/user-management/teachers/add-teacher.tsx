import { createFileRoute } from "@tanstack/react-router";
import AddTeacherForm from "@/components/userManagement/teachers/add-teacher";
export const Route = createFileRoute(
	"/dashboard/user-management/teachers/add-teacher",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AddTeacherForm />;
}
