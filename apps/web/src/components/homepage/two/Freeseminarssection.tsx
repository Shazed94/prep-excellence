import { CircleCheckBig } from "lucide-react";
import { motion } from "motion/react";
import { CalenderNewSvg } from "@/components/SvgComponents";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../../SectionSubtitle";
import { Button } from "../../ui/button";

// type
type Seminar = {
	id: number;
	image: string;
	date: string;
	title: string;
	subtitle: string;
	learnings: string[];
	hasSeats: boolean;
};

const seminars: Seminar[] = [
	{
		id: 1,
		image: "home/seminar-banner-1.png",
		date: "July 18-19, 2026 • Saturday, 10:00 AM to 11:30 AM",
		title: "SAT Fundamentals Session",
		subtitle: "For students and parents starting SAT preparation.",
		learnings: [
			"SAT structure and sections",
			"How scoring works",
			"Common mistakes to avoid",
			"How to plan your timeline",
		],
		hasSeats: true,
	},
	{
		id: 2,
		image: "home/seminar-banner-2.png",
		date: "July 18-19, 2026 • Saturday, 11:30 AM to 12:30 PM",
		title: "Score Improvement Strategy Session",
		subtitle: "For students aiming to increase scores significantly",
		learnings: [
			"How to improve weak sections",
			"Time management strategies",
			"Practice and review system",
			"How to reach your target score faster",
		],
		hasSeats: false,
	},
];

function SeminarCard({
	image,
	date,
	title,
	subtitle,
	learnings,
	hasSeats,
}: Seminar) {
	return (
		<div className="bg-white p-3 md:p-6 border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full">
			{/* Image */}
			<div className="h-[385px] overflow-hidden">
				<img
					src={image}
					alt={title}
					className="w-full h-full object-cover rounded-[6px]"
				/>
			</div>

			{/* Body */}
			<div className="pt-6 flex flex-col flex-1">
				{/* Date badge */}
				<div className="flex items-center gap-2 bg-[#F8F8F9] border border-gray-200 rounded-[6px] px-2 md:px-4 py-[9px] mb-4 w-fit">
					<CalenderNewSvg className="size-[14px] md:size-[27px]" />
					<span className="p mb-0!">{date}</span>
				</div>

				{/* Title */}
				<div>
					<h3 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-[6px]">
						{title}
					</h3>
					<p className="p mb-4!">{subtitle}</p>
				</div>

				{/* What you'll learn */}
				<div className="mb-3.5">
					<p className="p mb-2!">What you'll learn</p>
					<div className="grid grid-cols-2 gap-x-4 gap-y-2">
						{learnings.map((item, i) => (
							<div key={i} className="flex items-center gap-1.5">
								<CircleCheckBig size={14} className="text-gray-400 shrink-0" />
								<span className="text-xs text-gray-500">{item}</span>
							</div>
						))}
					</div>
				</div>

				{/* CTA */}
				<div className="mt-auto pt-2">
					{hasSeats ? (
						<Button
							variant={"outline"}
							className="w-full border border-primary text-primary rounded-[6px] h-[42px] text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
						>
							Join Free Seminar
						</Button>
					) : (
						<button
							type="button"
							disabled
							className="w-full bg-[#EBEBEB] text-[#A3A3A3] rounded-[6px] py-3 text-sm font-semibold cursor-not-allowed"
						>
							No Seats Remaining
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default function FreeSeminarsSection() {
	return (
		<section className="bg-[#F8F8F9] py-16 px-4">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h2 className="h2">Free Strategic Seminars</h2>
					<Subtitle className="">
						Pick ongoing strategy seminars to know the process first
					</Subtitle>
				</motion.div>

				{/* Cards */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 gap-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{seminars.map((seminar) => (
						<motion.div key={seminar.id} variants={scaleIn}>
							<SeminarCard {...seminar} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
