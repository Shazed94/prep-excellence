import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/instructor-portal/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello</div>;
}
