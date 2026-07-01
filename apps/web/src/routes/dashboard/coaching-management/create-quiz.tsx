// dashboard/instructor-portal/create-quiz.tsx

import { createFileRoute } from "@tanstack/react-router";
import { CreateQuizForm } from "@/components/course/quiz";

interface SearchParams {
	moduleId: string;
	lessonId?: string;
	courseTitle?: string;
	lessonTitle?: string;
	moduleTitle?: string;
}

export const Route = createFileRoute(
	"/dashboard/coaching-management/create-quiz",
)({
	validateSearch: (search: Record<string, any>): SearchParams => {
		return {
			moduleId: search.moduleId as string,
			lessonId: search.lessonId as string | undefined,
			courseTitle: search.courseTitle as string | undefined,
			lessonTitle: search.lessonTitle as string | undefined,
			moduleTitle: search.moduleTitle as string | undefined,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const searchParams = Route.useSearch();
	const { moduleId, lessonTitle, moduleTitle, courseTitle } = searchParams;

	return (
		<div className="container py-6">
			{(courseTitle || moduleTitle || lessonTitle) && (
				<div className="mb-6">
					<h1 className="text-2xl font-bold">
						{courseTitle && <span>{courseTitle}</span>}
						{courseTitle && moduleTitle && <span> / </span>}
						{moduleTitle && <span>{moduleTitle}</span>}
					</h1>
					{lessonTitle && (
						<p className="text-slate-600 mt-2">Quiz for: {lessonTitle}</p>
					)}
				</div>
			)}
			<CreateQuizForm moduleId={moduleId} />
		</div>
	);
}
