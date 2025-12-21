import { createFileRoute } from "@tanstack/react-router";
import OurLeaders from "@/components/about-us/OurLeaders";
import { OurPassion } from "@/components/about-us/OurPassion";
import OurPhilosophy from "@/components/about-us/OurPhilosophy";
import StorySection from "@/components/about-us/OurStory";
import TrustedByCarousel from "@/components/homepage/TrustedBySection";

export const Route = createFileRoute("/_frontend/about-us")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<OurPassion />
			<StorySection />
			<OurPhilosophy />
			<section className="bg-[#d9e6ed]/40 flex items-center justify-center py-8 md: py-8 md:py-20 ">
				<div className="w-full container mx-auto bg-primary-dark rounded-2xl p-12">
					<div className="text-center mb-12">
						<h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
							Achieve your Goals with PrepExcellence
						</h1>
						<p className="text-white text-lg md:text-xl">
							98% of Prep Excellence students achieve a 100+ point score
							improvement within six weeks
						</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0 md:divide-x md:divide-white/30">
						<div className="text-center">
							<div className="text-white text-3xl md:text-4xl font-bold mb-1">
								350+
							</div>
							<div className="text-white text-base md:text-lg">Events</div>
						</div>

						<div className="text-center">
							<div className="text-white text-3xl md:text-4xl font-bold mb-1">
								1300+
							</div>
							<div className="text-white text-base md:text-lg">Teachers</div>
						</div>

						<div className="text-center">
							<div className="text-white text-3xl md:text-4xl font-bold mb-1">
								35k+
							</div>
							<div className="text-white text-base md:text-lg">Students</div>
						</div>

						<div className="text-center">
							<div className="text-white text-3xl md:text-4xl font-bold mb-1">
								3211
							</div>
							<div className="text-white text-base md:text-lg">Courses</div>
						</div>

						{/* Countries - centered on mobile */}
						<div className="text-center col-span-2 md:col-span-1">
							<div className="text-white text-3xl md:text-4xl font-bold mb-1">
								13
							</div>
							<div className="text-white text-base md:text-lg">Countries</div>
						</div>
					</div>
				</div>
			</section>
			<OurLeaders />
			<div className="bg-[#d9e6ed]/40! ">
				<TrustedByCarousel />
			</div>
		</div>
	);
}
