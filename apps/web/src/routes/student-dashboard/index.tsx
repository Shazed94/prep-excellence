import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/store/useAuth";
export const Route = createFileRoute("/student-dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const user = getUser();
	return (
		<div>
			<h1 className="text-3xl font-bold">
				Welcome, {user?.name} to Student Dashboard
			</h1>
			<p>This is the main dashboard page.</p>
		</div>
	);
}
