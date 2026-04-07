import {
	Calendar,
	Clock,
	DollarSign,
	MoveRight,
	Play,
	Timer,
	User,
} from "lucide-react";
import { motion } from "motion/react";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../SectionSubtitle";
import { Button } from "../ui/button";

// corsedata type
type CourseData = {
	id: number;
	title: string;
	description: string;
	price: string;
	oldPrice: string;
	date: string;
	duration: string;
	schedule: string;
	instructor: string;
	seats: number;
	discount: string;
	image: string;
};

const coursesData: CourseData[] = [
	{
		id: 1,
		title: "SAT Comprehensive — Summer 2026",
		description:
			"Full-length preparation covering all SAT sections with weekly mock tests and personalized feedback.",
		price: "$125 USD",
		oldPrice: "$150 USD",
		date: "June 15, 2026",
		duration: "08 weeks",
		schedule: "Mon, Wed, Fri — 6:00 PM",
		instructor: "Sara Mitchel",
		seats: 4,
		discount: "15% Off",
		image:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
	},
	{
		id: 2,
		title: "SAT Fast Track — August 2026",
		description:
			"Accelerated program focused on high-impact strategies for students with limited prep time.",
		price: "$100 USD",
		oldPrice: "$120 USD",
		date: "August 15, 2026",
		duration: "04 weeks",
		schedule: "Sun, Sat — 6:00 PM",
		instructor: "Karoline",
		seats: 4,
		discount: "15% Off",
		image:
			"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
	},
	{
		id: 3,
		title: "SAT Weekend Intensive",
		description:
			"Weekend-only classes designed for busy students balancing school and SAT preparation.",
		price: "$70 USD",
		oldPrice: "$120 USD",
		date: "April 15, 2026",
		duration: "06 weeks",
		schedule: "Sun, Sat — 6:00 PM",
		instructor: "Sarah Mitchel",
		seats: 0,
		discount: "15% Off",
		image:
			"https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80",
	},
];

function CourseCard({ course }: { course: CourseData }) {
	const hasSeats = course.seats > 0;

	return (
		<div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
			{/* Image */}
			<div className="relative h-60 overflow-hidden">
				<img
					src={course.image}
					alt={course.title}
					className="w-full h-full object-cover"
				/>
				<span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
					{course.discount}
				</span>
				<div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 rounded-[6px] flex items-center justify-center cursor-pointer shadow-md">
					<Play className="size-5 text-primary" />
				</div>
			</div>

			{/* Body */}
			<div className="p-5 flex flex-col flex-1">
				<h3 className="font-bold text-[#0d1b2a] text-base leading-snug mb-2">
					{course.title}
				</h3>
				<p className="text-sm text-gray-500 leading-relaxed mb-4">
					{course.description}
				</p>

				<div className="flex flex-col gap-2 mb-4">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<DollarSign size={15} className="text-gray-400 shrink-0" />
						<span className="font-bold text-[#0d1b2a]">{course.price}</span>
						<span className="text-gray-400 line-through text-xs">
							{course.oldPrice}
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Calendar size={15} className="text-gray-400 shrink-0" />
						<span>{course.date}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Timer size={15} className="text-gray-400 shrink-0" />
						<span>{course.duration}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Clock size={15} className="text-gray-400 shrink-0" />
						<span>{course.schedule}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<User size={15} className="text-gray-400 shrink-0" />
						<span>{course.instructor}</span>
					</div>
				</div>

				<div
					className={`text-center text-xs font-semibold rounded-md py-2 mb-3 ${
						hasSeats
							? "bg-primary-light text-primary"
							: "bg-red-50 text-red-500"
					}`}
				>
					{hasSeats ? `0${course.seats} Seats Remaining` : "No Seats Remaining"}
				</div>

				<Button
					variant="gradient"
					disabled={!hasSeats}
					className={`w-full py-3 rounded-[6px] text-[14px] leading-[20px] -tracking-[0.5px] transition-all duration-200 ${
						hasSeats ? "" : "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}
				>
					Book Your Seat
				</Button>
			</div>
		</div>
	);
}

export default function UpcomingCoursesSection() {
	return (
		<section className="bg-[#F8F8F9] py-16 px-4">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-10"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h2 className="h2">Upcoming SAT Courses</h2>
					<Subtitle className="mx-auto max-w-[600px] ">
						Choose a cohort based on your schedule and target exam date. Seats
						are limited to maintain small group quality.
					</Subtitle>
				</motion.div>

				{/* Cards Grid */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{coursesData.map((course) => (
						<motion.div key={course.id} variants={scaleIn}>
							<CourseCard course={course} />
						</motion.div>
					))}
				</motion.div>

				{/* View More */}
				<motion.div
					className="flex justify-center"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<Button
						variant="outline"
						className="group flex items-center justify-center gap-2 w-fit mx-auto"
					>
						Learn More About Us
						<MoveRight />
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
