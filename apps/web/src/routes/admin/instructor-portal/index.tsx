import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/instructor-portal/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/instructor-portal/"!</div>;
}
