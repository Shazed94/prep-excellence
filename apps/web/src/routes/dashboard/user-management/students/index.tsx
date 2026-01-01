import { createFileRoute } from "@tanstack/react-router";
import { StudentListPage } from "@/components/userManagement/students/StudentListPage";

export const Route = createFileRoute("/dashboard/user-management/students/")({
	component: StudentsRoute,
});

function StudentsRoute() {
	return <StudentListPage />;
}
