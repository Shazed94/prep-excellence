import { createFileRoute } from "@tanstack/react-router";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import SATSection from "@/components/sat-courses/SATSection";
import ChooseSATCourses from "@/components/sat-courses/sat_courses";

export const Route = createFileRoute("/_frontend/sat-courses/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<SATSection />
			<ChooseSATCourses />
			<FAQSectionTwo />
		</div>
	);
}
