import { TCollegeAdmissionsGuidanceForm } from "@prepexcellence/shared-validators";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import AdminssionProcess from "@/components/college-admissions/AdminssionProcess";
import ConsultingService from "@/components/college-admissions/ConsultingService";
import EssayReview from "@/components/college-admissions/EssayReview";
import GuidanceBanner from "@/components/college-admissions/GuidanceBanner";
import GuidenceForm from "@/components/college-admissions/GuidenceForm";
import OurAdvisors from "@/components/college-admissions/OurAdvisors";

export const Route = createFileRoute("/_frontend/college-admissions")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<GuidanceBanner />
			<AdminssionProcess />
			<EssayReview />
			<ConsultingService />
			<OurAdvisors />
			<GuidenceForm />
		</div>
	);
}
