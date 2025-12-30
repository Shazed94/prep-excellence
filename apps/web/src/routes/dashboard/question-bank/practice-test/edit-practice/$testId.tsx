import { createFileRoute } from "@tanstack/react-router";
import { SATBuilderPage } from "@/components/admin-sat-tabs/sats-builder-form";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test/edit-practice/$testId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { testId } = Route.useParams();
	return (
		<div>
			<SATBuilderPage practiceId={testId} />
		</div>
	);
}
