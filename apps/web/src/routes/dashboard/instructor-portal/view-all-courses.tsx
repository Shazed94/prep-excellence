import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/view-all-courses",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/instructor-portal/view-all-courses"!</div>;
}
