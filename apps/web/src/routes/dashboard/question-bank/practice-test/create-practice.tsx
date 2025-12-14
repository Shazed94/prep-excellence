import { createFileRoute } from "@tanstack/react-router";
import { SATBuilderPage } from "@/components/admin-sat-tabs/sats-builder-form";

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
