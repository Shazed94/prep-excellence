import { createFileRoute } from "@tanstack/react-router";
import FullLongPracticeBuilder from "@/components/admin-sat-tabs/full-long-practice-form";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test/full-long-practice",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<FullLongPracticeBuilder />
		</div>
	);
}
