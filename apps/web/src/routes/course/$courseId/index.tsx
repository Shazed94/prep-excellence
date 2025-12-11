// routes/Course/$courseId/index.tsx

// import { CourseDetailPage } from "@/components/course/course-details";
// import CourseDetailsSection from "@/components/course/courseDetailsSection";
// import { createFileRoute } from "@tanstack/react-router";

// export const Route = createFileRoute("/course/$courseId/")({
// 	component: () => {
// 		const { courseId } = Route.useParams();
// 		// return <CourseDetailPage courseId={courseId} />;
// 		return <CourseDetailsSection courseId={courseId}
// 	}
// });

import { createFileRoute } from "@tanstack/react-router";
// routes/course/$courseId/index.tsx
import CourseDetailsSection from "@/components/course/courseDetailsSection";

export const Route = createFileRoute("/course/$courseId/")({
	component: () => {
		const { courseId } = Route.useParams();
		return <CourseDetailsSection courseId={courseId} />;
	},
});
