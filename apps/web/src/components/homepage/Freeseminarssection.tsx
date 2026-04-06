import { CalendarDays, CircleCheckBig } from "lucide-react";
import { Subtitle } from "../SectionSubtitle";
import { Button } from "../ui/button";

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
		image:
			"https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&q=80",
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
		image:
			"https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
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
		<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
			{/* Image */}
			<div className="h-72 overflow-hidden">
				<img src={image} alt={title} className="w-full h-full object-cover" />
			</div>

			{/* Body */}
			<div className="p-6 flex flex-col gap-4 flex-1">
				{/* Date badge */}
				<div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-fit">
					<CalendarDays size={15} className="text-gray-500 shrink-0" />
					<span className="text-xs text-gray-600 font-medium">{date}</span>
				</div>

				{/* Title */}
				<div>
					<h3 className="text-xl font-bold text-[#0d1b2a] mb-1">{title}</h3>
					<p className="text-sm text-gray-500">{subtitle}</p>
				</div>

				{/* What you'll learn */}
				<div>
					<p className="text-sm font-bold text-[#0d1b2a] mb-2">
						What you'll learn
					</p>
					<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
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
							className="w-full border border-primary text-primary rounded-xl py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
						>
							Join Free Seminar
						</Button>
					) : (
						<button
							type="button"
							disabled
							className="w-full bg-gray-100 text-gray-400 rounded-xl py-3 text-sm font-semibold cursor-not-allowed"
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
				<div className="text-center mb-12">
					<h2 className="h2">Free Strategic Seminars</h2>
					<Subtitle className="">
						Pick ongoing strategy seminars to know the process first
					</Subtitle>
				</div>

				{/* Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{seminars.map((seminar) => (
						<SeminarCard key={seminar.id} {...seminar} />
					))}
				</div>
			</div>
		</section>
	);
}
