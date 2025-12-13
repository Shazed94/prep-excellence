import { createFileRoute } from "@tanstack/react-router";
import { CreateQuestionForm } from "@/components/admin-sat-tabs/create-question-form";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test-configuration/add-question/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<CreateQuestionForm />
		</div>
	);
}
