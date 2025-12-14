import { SATBuilderPage } from "@/components/admin-sat-tabs/sats-builder-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test/create-practice",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<SATBuilderPage />
		</div>
	);
}
