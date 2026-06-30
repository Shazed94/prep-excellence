import { createFileRoute, redirect } from "@tanstack/react-router";

// Redirect legacy detail route → new canonical tutor profile page
export const Route = createFileRoute("/_frontend/teacher-detail-one-to-one")({
	beforeLoad: () => {
		throw redirect({ to: "/tutoring", replace: true });
	},
	component: () => null,
});
