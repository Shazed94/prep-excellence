import { createFileRoute } from "@tanstack/react-router";
import FullLengthPracticeBuilder from "@/components/admin-sat-tabs/full-long-practice-form";

export const Route = createFileRoute(
	"/dashboard/question-bank/full_length_practice/full-length-practice",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<FullLengthPracticeBuilder />
		</div>
	);
}
