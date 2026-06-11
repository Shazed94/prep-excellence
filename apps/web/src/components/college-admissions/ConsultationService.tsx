import { Asterisk, BookOpenCheck, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { FeatureCard } from "../homepage/two/WhyPrepExcellence";
import { Subtitle } from "../SectionSubtitle";

export default function ConsultationService() {
	const features = [
		{
			id: 1,
			icon: "/icons/ai-idea.png",
			title: "Initial Planning",
			description:
				"It is important to accentuate strengths and emphasize weaknesses. We help with choosing the right high school subjects, extracurricular activities, summer activities, internships, testing, campus visits, and more.",
		},
		{
			id: 2,
			icon: "/icons/ai-search.png",
			title: "Find and Apply to the right school",
			description:
				"You should apply to schools that fit your academic interests and personality. In the top schools, grades, test scores, and recommendation letters are not enough. Your application should help you stand out.",
		},
		{
			id: 3,
			icon: "/icons/whiteboard-white.png",
			title: "Admission Test Preparation",
			description:
				"We provide industry-leading test prep programs and will help you prepare for the test. Select from instructor-led classes or individual tutoring. Work with the best instructors and tutors for SAT, ACT, and other exams.",
		},
		{
			id: 4,
			icon: "/icons/text-font.png",
			title: "College Essay Review",
			description:
				"We teach you how to compose essays that “work.” Without proper help, it is easy to make common mistakes that can severely weaken your essay.",
		},
		{
			id: 5,
			icon: "/icons/coins.png",
			title: "Scholarship Sources",
			description:
				"Work with the best instructors and tutors for SAT, ACT, and other exams. Receive major discounts with Admissions Consulting packages.",
		},
		{
			id: 6,
			icon: "/icons/help-circle.png",
			title: "Post Application Help",
			description:
				"We advise you on how to follow up after submitting your application, including making sure that your application is complete. ",
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
						<h2 className="h2">Consultation Services</h2>
						<Subtitle className="max-w-[620px] mx-auto ">
							We can help with your complete application package or whichever
						</Subtitle>
					</motion.div>

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
		</div>
	);
}
