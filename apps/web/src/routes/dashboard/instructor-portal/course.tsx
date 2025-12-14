import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/instructor-portal/course")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/instructor-portal/course"!</div>;
}
