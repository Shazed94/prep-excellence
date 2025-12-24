// dashboard/instructor-portal/create-quiz.tsx

import { createFileRoute } from "@tanstack/react-router";
import { CreateQuizForm } from "@/components/course/create-quiz-form";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-quiz",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container py-6">
			<CreateQuizForm
				lessonId="lesson-id"
				moduleId="module-id"
				courseTitle="Sample Course"
				lessonTitle="Sample Lesson"
				moduleTitle="Sample Module"
			/>
		</div>
	);
}
