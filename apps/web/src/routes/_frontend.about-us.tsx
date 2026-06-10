import { createFileRoute } from "@tanstack/react-router";
import { AboutHero } from "@/components/about-us/AboutHero";
import OurInstructors from "@/components/about-us/OurInstructors";
import OurLeaders from "@/components/about-us/OurLeaders";
import StorySection from "@/components/about-us/OurStory";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";

export const Route = createFileRoute("/_frontend/about-us")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<AboutHero />
			<StorySection />
			<OurLeaders />
			<OurInstructors />
			<FAQSectionTwo />
		</div>
	);
}
