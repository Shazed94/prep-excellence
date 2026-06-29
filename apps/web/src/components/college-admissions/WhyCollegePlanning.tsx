import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { FeatureCard } from "../homepage/two/WhyPrepExcellence";
import { Subtitle } from "../SectionSubtitle";

export default function WhyCollegePlanning() {
	const features = [
		{
			id: 1,
			icon: "/icons/idea-01.png",
			title: "Application Strategy",
			description:
				"A clear strategy helps students present their strengths in a focused and competitive way.",
		},
		{
			id: 2,
			icon: "/icons/hourglass-white.png",
			title: "Timeline Planning",
			description:
				"Starting early ensures enough time to prepare, improve scores, and avoid last minute pressure",
		},
		{
			id: 3,
			icon: "/icons/cursor-pointer.png",
			title: "College Selection",
			description:
				"Choosing the right colleges increases admission chances and aligns with long term goals",
		},
		{
			id: 4,
			icon: "/icons/user-story.png",
			title: "Profile Development",
			description:
				"Strong academics, activities, and consistency build a well rounded application",
		},
	];

	return (
		<div className="mx-auto container bg-white">
			<section className="bg-white py-8 md:py-16 px-4">
				<div className="container mx-auto">
					{/* Header */}
					<motion.div
						className="text-center mb-12"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<h2 className="h2">Why College Planning Matters</h2>
						<Subtitle className="max-w-[620px] mx-auto ">
							A strong SAT score helps, but admissions decisions also depend on
							planning, timing, and positioning.
						</Subtitle>
					</motion.div>

					{/* Grid */}
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						{features.map((feature) => (
							<FeatureCard key={feature.id} {...feature} />
						))}
					</motion.div>
				</div>
			</section>
		</div>
	);
}
