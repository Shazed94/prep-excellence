import { createFileRoute } from "@tanstack/react-router";
import FullLengthPracticeBuilder from "@/components/admin-sat-tabs/full-long-practice-form";

export const Route = createFileRoute(
	"/dashboard/question-bank/full_length_practice/edit-practice/$practiceId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { practiceId } = Route.useParams();
	return (
		<div>
			<FullLengthPracticeBuilder practiceId={practiceId} />
		</div>
	);
}
