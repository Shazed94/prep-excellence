import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users")({
	beforeLoad: () => {
		throw redirect({
			to: "/dashboard/user-management/students",
			replace: true,
		});
	},
	component: () => null,
});
