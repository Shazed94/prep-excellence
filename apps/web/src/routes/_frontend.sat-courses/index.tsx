import { createFileRoute } from "@tanstack/react-router";
import SATBoost from "@/components/sat-courses/SATBoost";
import SATSection from "@/components/sat-courses/SATSection";
import UpcomingCoursesSection from "@/components/sat-courses/UpcomingCourses";
import WhatWeTaughtSection from "@/components/sat-courses/WhatWeTaught";

export const Route = createFileRoute("/_frontend/sat-courses/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<SATSection />
			<UpcomingCoursesSection />
			<SATBoost />
			<WhatWeTaughtSection />
		</div>
	);
}
