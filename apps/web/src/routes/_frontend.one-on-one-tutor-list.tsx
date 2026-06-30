import { createFileRoute, redirect } from "@tanstack/react-router";

// Redirect legacy route → new canonical tutoring listing
export const Route = createFileRoute("/_frontend/one-on-one-tutor-list")({
	beforeLoad: () => {
		throw redirect({ to: "/tutoring", replace: true });
	},
	component: () => null,
});
