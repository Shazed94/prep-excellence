import { createFileRoute } from "@tanstack/react-router";
import AddStudentForm from "@/components/userManagement/students/add-students";

export const Route = createFileRoute(
	"/dashboard/user-management/students/add-student",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AddStudentForm />;
}
