// dashboard/instructor-portal/create-quiz.tsx

import { createFileRoute } from "@tanstack/react-router";
import { CreateQuizForm } from "@/components/course/quiz";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-quiz",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container py-6">
			<CreateQuizForm moduleId="module-id" />
		</div>
	);
}
