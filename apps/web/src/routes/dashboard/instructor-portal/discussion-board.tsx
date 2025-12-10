import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/admin/instructor-portal/discussion-board",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/instructor-portal/discussion-board"!</div>;
}
