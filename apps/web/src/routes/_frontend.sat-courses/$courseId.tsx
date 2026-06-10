import { createFileRoute } from "@tanstack/react-router";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import CourseBanner from "@/components/sat-courses/singleCourse/CourseBanner";
import SATCoursePage from "@/components/sat-courses/singleCourse/Details";
// Import shadcn/ui Tabs

export const Route = createFileRoute("/_frontend/sat-courses/$courseId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<CourseBanner />

			<SATCoursePage />

			<FAQSectionTwo isGetDiscount />
			<FooterTwo />
		</div>
	);
}
