import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/content-management/contact-us",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/content-management/contact-us"!</div>;
}
