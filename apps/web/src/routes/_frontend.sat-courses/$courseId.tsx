import { createFileRoute } from "@tanstack/react-router";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import CourseBanner from "@/components/sat-courses/singleCourse/CourseBanner";
import SATCoursePage from "@/components/sat-courses/singleCourse/Details";
import { useGetPublishedSATCourse } from "@/hooks/lms-course";
// Import shadcn/ui Tabs

export const Route = createFileRoute("/_frontend/sat-courses/$courseId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { courseId } = Route.useParams();
	const { data } = useGetPublishedSATCourse(courseId);

	return (
		<div>
			<CourseBanner data={data} courseId={courseId} />
			<SATCoursePage data={data} />
			<FAQSectionTwo isGetDiscount />
			<FooterTwo />
		</div>
	);
}
