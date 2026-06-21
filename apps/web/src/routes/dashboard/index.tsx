import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/store/useAuth";
export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const user = getUser();
	console.log("user in dashboard", user);
	return (
		<div>
			<h1 className="text-3xl font-bold">
				Welcome, {user?.name} to{" "}
				{user?.role === "Student" ? "Student" : "Admin"} Dashboard
			</h1>
			<p>This is the main dashboard page.</p>
		</div>
	);
}
