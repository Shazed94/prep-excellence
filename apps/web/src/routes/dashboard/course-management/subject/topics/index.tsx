import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/course-management/subject/topics/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/course-management/subject/topics/"!</div>;
}
