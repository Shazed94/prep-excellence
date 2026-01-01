import { createFileRoute } from "@tanstack/react-router";
import TeacherListPage from "@/components/userManagement/teachers/teacherListPage";

export const Route = createFileRoute("/dashboard/user-management/teachers/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <TeacherListPage />;
}
