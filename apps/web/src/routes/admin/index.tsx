import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/store/useAuth";
export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
});

function RouteComponent() {
	const user = getUser();
	return (
		<div>
			<h1 className="text-3xl font-bold">
				Welcome, {user?.name} to Admin Dashboard
			</h1>
			<p>This is the main admin page.</p>
		</div>
	);
}
