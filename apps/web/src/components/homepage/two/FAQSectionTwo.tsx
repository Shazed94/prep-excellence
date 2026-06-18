import { ArrowRight, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeLeft, fadeRight, fadeUp, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Subtitle } from "../../SectionSubtitle";

const faqs = [
	{
		id: "faq-1",
		question: "When should students start SAT preparation?",
		answer:
			"We recommend starting at least 3–4 months before the target exam date. This allows enough time to cover all sections thoroughly and complete practice tests. Students preparing for competitive scores may benefit from starting even earlier.",
	},
	{
		id: "faq-2",
		question: "How are classes structured?",
		answer:
			"Classes follow a structured weekly schedule covering all SAT sections. Each session includes concept review, guided practice, and targeted feedback to ensure steady progress.",
	},
	{
		id: "faq-3",
		question: "Do you offer private tutoring?",
		answer:
			"Yes, we offer 1:1 tutoring sessions tailored to each student's specific strengths and weaknesses. These sessions are flexible and can be scheduled based on availability.",
	},
	{
		id: "faq-4",
		question: "How do students track progress?",
		answer:
			"Students receive consistent feedback through practice tests, score reports, and instructor evaluations. Parents are also kept informed of their child's progress throughout the program.",
	},
];

function FAQAccordion() {
	const [openItem, setOpenItem] = useState("faq-1");

	return (
		<Accordion
			type="single"
			collapsible
			value={openItem}
			onValueChange={setOpenItem}
			className="flex flex-col gap-3"
		>
			{faqs.map((faq) => {
				const isOpen = openItem === faq.id;
				return (
					<AccordionItem
						key={faq.id}
						value={faq.id}
						className="border border-gray-200 shadow-[0px_0px_3px_0px_#0000001A] rounded-[12px] p-4! bg-white data-[state=open]:shadow-sm"
					>
						<AccordionTrigger className="flex items-center justify-between gap-4 text-sm font-semibold text-[#0d1b2a] hover:no-underline [&>svg]:hidden ] p-0!">
							<span
								className={cn("text-left h6", {
									"mb-3": isOpen,
								})}
							>
								{faq.question}
							</span>
							<span className="shrink-0 text-[#6C7179]">
								{isOpen ? <X size={18} /> : <Plus size={18} />}
							</span>
						</AccordionTrigger>
						<AccordionContent className="text-sm text-gray-500 leading-relaxed">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}

export default function FAQSectionTwo({
	isGetDiscount = false,
}: {
	isGetDiscount?: boolean;
}) {
	return (
		<section className="bg-[#f5f7fa] py-8 md:py-16 px-4">
			{isGetDiscount && (
				<div className="container mx-auto mb-12">
					<div className="gradient rounded-2xl px-12 py-6 flex justify-between items-center gap-8 flex-col md:flex-row">
						<h3 className="text-white text-[32px] font-semibold leading-10 tracking-[-1.5px] ">
							Limited-time course discount:  <br /> SAT Course prices are as low
							as $120
						</h3>

						<button
							type="button"
							className="rounded-sm py-4 px-8 bg-white text-[#141B34] font-semibold! body_lg  hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center"
						>
							Get Discount <ArrowRight size={24} className="ml-2" />
						</button>
					</div>
				</div>
			)}

			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h5 className="h3 font-bold!">Frequently Asked Questions</h5>
					<Subtitle className="">
						Answers to common SAT preparation questions
					</Subtitle>
				</motion.div>

				{/* Content */}
				<div className="flex flex-col lg:flex-row gap-12 items-stretch">
					{/* Left card */}
					<motion.div
						className="bg-primary rounded-2xl p-6 flex flex-col gap-5 w-full h-full lg:w-1/3 shrink-0"
						variants={fadeLeft}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<img
							src="/home/faq.png"
							alt="Support"
							className="w-[86px] h-[86px] rounded-[6px] object-cover object-top"
						/>
						<h3 className="text-white text-[32px] font-medium leading-10 tracking-[-1.5px]">
							Didn't get the answer you were looking for?
						</h3>
						<button
							type="button"
							className="w-full bg-white text-primary font-semibold text-sm rounded-xl py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
						>
							Start Live Chat
						</button>
						<p className="p text-[#EBEBEB]!  text-[14px]! md:text-[16px]! text-center leading-relaxed">
							We will be happy to answer! It should take between 1 to 2 working
							days.
						</p>
					</motion.div>

					{/* Right accordion */}
					<motion.div
						className="flex-1 w-full"
						variants={fadeRight}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<FAQAccordion />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
