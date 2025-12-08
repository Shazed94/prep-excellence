import SATLiveClasslistSection from "@/components/sat-courses/SATLiveClasslist";
import SATLiveClasslistBanner from "@/components/sat-courses/SATLiveClasslistBanner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_frontend/register-sat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SATLiveClasslistBanner />
      <SATLiveClasslistSection />
    </div>
  );
}
