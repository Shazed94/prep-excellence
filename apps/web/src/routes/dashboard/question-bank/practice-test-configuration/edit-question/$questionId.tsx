import { createFileRoute } from "@tanstack/react-router";
import { EditQuestionForm } from "@/components/admin-sat-tabs/edit-question-form";
import { useGetQuestionById } from "@/hooks/question-back";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test-configuration/edit-question/$questionId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { questionId } = Route.useParams();

	const { data: questionData, isLoading } = useGetQuestionById(questionId);

	return (
		<div>
			<EditQuestionForm
				questionId={questionId}
				questionData={questionData?.data}
				isLoading={isLoading}
			/>
		</div>
	);
}
