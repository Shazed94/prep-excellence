import { createFileRoute } from "@tanstack/react-router";
import EssayReviewBanner from "@/components/college-essay-review-registration/EssayReviewBanner";
import EssayReviewHero from "@/components/college-essay-review-registration/EssayReviewHero";
import EssayReviewRegistrationForm from "@/components/college-essay-review-registration/EssayReviewRegistrationForm";

export const Route = createFileRoute(
	"/_frontend/college-essay-review-registration",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<EssayReviewBanner />
			<EssayReviewHero />
			<EssayReviewRegistrationForm />
		</div>
	);
}
