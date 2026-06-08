import { Asterisk, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import {
	fadeLeft,
	fadeRight,
	fadeUp,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { AboutAnimatedText } from "../homepage/two/AnimatedParagraph";
import { FeatureCard } from "../homepage/two/WhyPrepExcellence";
import { Subtitle } from "../SectionSubtitle";

export default function StorySection() {
	const features = [
		{
			id: 1,
			icon: Asterisk,
			title: "Mission",
			description:
				"To help students improve SAT scores through structured preparation and consistent practice",
		},
		{
			id: 2,
			icon: Asterisk,
			title: "Vision",
			description:
				"To become a trusted SAT preparation platform known for consistent score improvement",
		},
		{
			id: 3,
			icon: ShieldCheck,
			title: "Solution",
			description:
				"We follow a structured system where students learn concepts, apply strategies, and improve through guided practice and feedback.",
		},
	];
	return (
		<section className="py-16 px-4 bg-white">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h2 className="h2">Our Story</h2>
					<Subtitle>
						Helping students improve scores with clarity and structure
					</Subtitle>
				</motion.div>

				<div className="flex flex-col md:flex-row gap-12 items-cente mb-10 justify-between">
					{/* Left Content */}
					<motion.div
						className="space-y-8 w-full md:w-[58%]"
						variants={fadeLeft}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<AboutAnimatedText />
					</motion.div>

					{/* Stats Card */}
					<motion.div
						className="bg-blue-50 rounded-2xl p-3 sm:p-5 lg:p-[55px] h-full border border-blue-100"
						variants={fadeRight}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<motion.div
							className="grid grid-cols-2 gap-10 h-full"
							variants={staggerContainer}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							{[
								{ label: "Avg. Score Improvement", value: "150+" },
								{ label: "2000 Reviews", value: "4.9" },
								{ label: "Students Worldwide", value: "2000+" },
								{ label: "Expert Instructors", value: "32+" },
							].map((stat) => (
								<motion.div key={stat.label} variants={fadeUp}>
									<div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
										<span className="inline-block bg-primary size-1.5 rounded-full me-1.5" />
										<span className="f14 -tracking-[0.5px]! font-medium text-[#141B34] pb-2  border-b border-b-[#EBEBEB]">
											{stat.label}
										</span>
									</div>
									<div className="text-[48px] leading-[56px] -tracking-[2px] font-semibold text-primary">
										{stat.value}
									</div>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</div>
			<section className="bg-white py-8 md:py-16 px-4">
				<div className="container mx-auto">
					{/* Grid */}
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
		</section>
	);
}
