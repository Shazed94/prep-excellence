import { createFileRoute } from "@tanstack/react-router";
import OurLeaders from "@/components/about-us/OurLeaders";
import { AboutHero } from "@/components/about-us/AboutHero";
import StorySection from "@/components/about-us/OurStory";
// import TrustedByCarousel from "@/components/homepage/TrustedBySection";

export const Route = createFileRoute("/_frontend/about-us")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<AboutHero />
			<StorySection />
			<section className="bg-[#F8F8F9] flex items-center justify-center py-8 md:py-20 "></section>
			<OurLeaders />
			{/* <div className="bg-[#d9e6ed]/40! ">
				<TrustedByCarousel />
			</div> */}
		</div>
	);
}
