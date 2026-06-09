import { Award, GraduationCap, Microscope, Users } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Subtitle } from "../SectionSubtitle";
export default function OurLeaders() {
	const founders = [
		{
			name: "Dr. Kaiser Alam",
			designation: "Founder and CEO",
			image: "/leader-bg.png",
			description: [
				"Dr. Kaisar Alam is an educator and a biomedical engineer. He has a passion for teaching. In fact, he has been teaching since high school (starting with his own 9th-grade classmates and in college with his IIT, Kharagpur classmates).",
				"He has been teaching at Central Jersey schools and also at TCNJ and Rutgers. Dr. Alam has been working with high school students to help improve their SAT and ACT scores. Many of our students got top scores, made large score improvements, and received admission into top universities.",
			],
			highlights: [
				{
					icon: Award,
					label: "15+ years teaching experience",
				},
				{
					icon: Users,
					label: "2,500+ students trained",
				},
				{
					icon: Microscope,
					label: "Biomedical Engineer",
				},
				{
					icon: GraduationCap,
					label: "B.Tech. (Hons) from IIT, India",
				},
			],
		},
		{
			name: "Andaleeb Mahmud",
			designation: "Co Founder",
			image: "/leader2.png",
			description: [
				"Andaleeb Mahmud is an IT management professional with experience in complex business problems and providing creative solutions. He is an Award-Winning Leader of product teams who has spearheaded substantial revenues for many companies.",
				"He excels in building organization, guiding enterprise level initiatives, guiding international programs and highly adept in managing the quality of the project as well as the resulting product.",
			],
			highlights: [
				{
					icon: Award,
					label: "15+ years leadership experience",
				},
				{
					icon: Users,
					label: "Multiple successful products",
				},
				{
					icon: Microscope,
					label: "Technology Strategist",
				},
				{
					icon: GraduationCap,
					label: "B.Tech. (Hons) from IIT, India",
				},
			],
		},
	];
	return (
		<section className="bg-[#F8F8F9] py-8 md:py-20 ">
			<div className="container mx-auto ">
				<div className="text-center">
					<h2 className="h2">Leadership Team</h2>
					<Subtitle className="max-w-[620px] mx-auto ">
						Meet our leadership team to know the root
					</Subtitle>
				</div>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{founders.map((founder, i) => (
						<motion.div
							key={founder.name}
							variants={fadeUp}
							className=" overflow-hidden"
						>
							{/* Image */}
							<div className="aspect-[16/9] overflow-hidden rounded-xl">
								<img
									src={founder.image}
									alt={founder.name}
									className="w-full h-full object-cover"
								/>
							</div>

							{/* Content */}
							<div className="pt-6">
								<p className="body-lg mb-2.5">{founder.designation}</p>

								<h3 className="bold_h4 mb-4">{founder.name}</h3>

								<div className="space-y-4  leading-relaxed">
									{founder.description.map((paragraph, idx) => (
										<h5
											key={idx}
											className="h5 text-[#6C7179]! font-normal! -tracking-[0.64px]!"
										>
											{paragraph}
										</h5>
									))}
								</div>

								{/* Stats */}
								<div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
									{founder.highlights.slice(0, 2).map((item, idx) => (
										<div key={idx} className="flex items-center gap-3 mb-1">
											<item.icon className="w-6 h-6 text-[#2563FF] shrink-0" />
											<span className="h6_class font-medium!">
												{item.label}
											</span>
										</div>
									))}
									{founder.highlights.splice(2).map((item, idx) => (
										<div key={idx} className="flex items-center gap-3 mb-5">
											<item.icon className="w-6 h-6 text-[#2563FF] shrink-0" />
											<span className="h6_class font-medium!">
												{item.label}
											</span>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
