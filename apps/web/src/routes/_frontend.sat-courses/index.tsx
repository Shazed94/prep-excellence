import { createFileRoute } from "@tanstack/react-router";
import SATBoost from "@/components/sat-courses/SATBoost";
import SATSection from "@/components/sat-courses/SATSection";
import WhatWeTaughtSection from "@/components/sat-courses/WhatWeTaught";
import UpcomingCoursesSectionTwo from "@/components/homepage/two/UpcomingCoursesTwo";

export const Route = createFileRoute("/_frontend/sat-courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SATSection />
      <UpcomingCoursesSectionTwo />
      <SATBoost />
      <WhatWeTaughtSection />
    </div>
  );
}
