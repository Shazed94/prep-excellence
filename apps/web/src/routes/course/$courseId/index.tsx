// routes/Course/$courseId.tsx

import { createFileRoute } from "@tanstack/react-router";
import { CourseDetailPage } from "@/components/Course/course-details";

export const Route = createFileRoute("/course/$courseId/")({
	component: () => {
		const { courseId } = Route.useParams();
		return <CourseDetailPage courseId={courseId} />;
	},
});
