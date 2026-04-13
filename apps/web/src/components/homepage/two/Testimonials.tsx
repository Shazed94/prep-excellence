"use client";

import { MoveRight, Star } from "lucide-react"; // or your own Star component
import { motion } from "motion/react";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../../SectionSubtitle";
import { Button } from "../../ui/button";

// type
type Testimonial = {
	id: number;
	quote: string;
	name: string;
	role: string;
	avatar: string;
};

// Your testimonials data (add as many as you want)
const testimonials: Testimonial[] = [
	{
		id: 1,
		quote:
			"Prep Excellence boosted my son's confidence and score! They truly care about their students.",
		name: "Veres Viktor",
		role: "Parent",
		avatar: "https://i.pravatar.cc/150?img=11",
	},
	{
		id: 2,
		quote:
			"Thanks to Prep Excellence, I got into my dream college! The personalized feedback and practice tests were a game-changer.",
		name: "Csatár Géza",
		role: "Student",
		avatar: "https://i.pravatar.cc/150?img=14",
	},
	{
		id: 3,
		quote:
			"The structured approach made SAT prep manageable. I felt prepared and confident on test day, all thanks to Prep Excellence!",
		name: "Orosz Boldizsár",
		role: "Student",
		avatar: "https://i.pravatar.cc/150?img=17",
	},
	{
		id: 4,
		quote:
			"The instructors at Prep Excellence are amazing! They break down complex concepts and make learning fun and engaging.",
		name: "Fekete Csanád",
		role: "Student",
		avatar: "https://i.pravatar.cc/150?img=20",
	},
	{
		id: 5,
		quote:
			"Prep Excellence provided the tools and support I needed to succeed. I highly recommend them to any student preparing for the SAT.",
		name: "Simon Árpád",
		role: "Student",
		avatar: "https://i.pravatar.cc/150?img=23",
	},
	{
		id: 6,
		quote:
			"The 1-on-1 tutoring was invaluable. My tutor helped me identify my weaknesses and develop strategies to improve my score.",
		name: "Szücs Endre",
		role: "Student",
		avatar: "https://i.pravatar.cc/150?img=26",
	},
];
function StarRating() {
	return (
		<div className="flex gap-1 mb-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star key={i} size={18} className="fill-amber-400 text-amber-400" />
			))}
		</div>
	);
}

function TestimonialCard({ quote, name, role, avatar }: Testimonial) {
	return (
		<div className="bg-white h-full border border-gray-200 rounded-2xl p-6 flex flex-col justify-between gap-8">
			<div>
				<StarRating />
				<h4 className="h4 font-inter! font-medium! -tracking-[1.3px]!">
					"{quote}"
				</h4>
			</div>
			<div className="flex items-center gap-3">
				<img
					src={avatar}
					alt={name}
					className="w-10 h-10 rounded-full object-cover shrink-0"
				/>
				<div>
					<p className="p mb-0!">{name}</p>
					<p className="small text-[#6C7179]!">{role}</p>
				</div>
			</div>
		</div>
	);
}

export default function TestimonialsSection() {
	// const [emblaRef, emblaApi] = useEmblaCarousel(
	//   {
	//     loop: true,
	//     align: "center",
	//     containScroll: "trimSnaps",
	//   },
	//   [
	//     Autoplay({
	//       delay: 6000,
	//       stopOnInteraction: false,
	//       stopOnMouseEnter: true,
	//     }),
	//   ],
	// );

	// const scrollPrev = () => emblaApi?.scrollPrev();
	// const scrollNext = () => emblaApi?.scrollNext();

	return (
		// <section className="relative py-8 md:py-20">
		// 	<span className="bg-[#6965EB] w-56 h-56 rounded-full blur-[200px] z-10 absolute left-0 top-18"></span>
		// 	<div className="max-w-6xl mx-auto px-6">
		// 		{/* Header */}
		// 		<div className="text-center mb-12">
		// 			<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
		// 				What Our Students Say
		// 			</SectionTitle>
		// 			<p className="text-muted text-lg max-w-[980px] mx-auto leading-relaxed mt-6">
		// 				Others might promise you great results, but the instructors at Prep
		// 				Excellence deliver. No matter what your current score is, we can
		// 				help you improve it and guarantee improvement. See what our students
		// 				say!!!
		// 			</p>
		// 		</div>

		// 		{/* Carousel Wrapper */}
		// 		<div className="relative max-w-4xl mx-auto">
		// 			{/* Embla Viewport */}
		// 			<div className="overflow-hidden" ref={emblaRef}>
		// 				<div className="flex">
		// 					{testimonials.map((t) => (
		// 						<div
		// 							key={t.id}
		// 							className="flex-[0_0_100%] min-w-0 px-4" // 1 slide per view
		// 						>
		// 							{/* Your EXACT original card — untouched */}
		// 							<div className="relative">
		// 								{/* Large Quote Mark */}
		// 								<div className="absolute top-0 right-8 pointer-events-none">
		// 									<img
		// 										src="/home/quote.png"
		// 										alt=""
		// 										className="h-10 w-12 md:h-20 md:w-20"
		// 									/>
		// 								</div>

		// 								{/* Testimonial Content */}
		// 								<div className="text-center py-6 md:py-12">
		// 									{/* Student Photo */}
		// 									<div className="flex justify-center mb-6">
		// 										<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
		// 											<img
		// 												src={t.photo}
		// 												alt={t.name}
		// 												width={96}
		// 												height={96}
		// 												className="object-cover"
		// 											/>
		// 										</div>
		// 									</div>

		// 									{/* Student Name */}
		// 									<h3 className=" text-md md:text-xl font-bold text-[#191919] mb-3">
		// 										{t.name}
		// 									</h3>

		// 									{/* Rating */}
		// 									<div className="flex items-center justify-center gap-1 mb-6">
		// 										{[1, 2, 3, 4, 5].map((i) => (
		// 											<Star
		// 												key={i}
		// 												className="w-5 h-5 fill-[#ef782e] text-[#ef782e]"
		// 											/>
		// 										))}
		// 									</div>

		// 									{/* Testimonial Text */}
		// 									<p className="text-[#191919] text-sm md:text-lg leading-relaxed max-w-3xl mx-auto px-1">
		// 										{t.text}
		// 									</p>
		// 								</div>
		// 							</div>
		// 						</div>
		// 					))}
		// 				</div>
		// 			</div>

		// 			{/* Your EXACT original arrows — now functional */}
		// 			<Button
		// 				type="button"
		// 				onClick={scrollPrev}
		// 				className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5  lg:-translate-x-16 rounded-lg p-1 md:p-2.5 shadow-lg cursor-pointer"
		// 			>
		// 				<ChevronLeft />
		// 			</Button>

		// 			<Button
		// 				type="button"
		// 				onClick={scrollNext}
		// 				className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5  lg:translate-x-16 rounded-lg p-1  md:p-2.5 shadow-lg cursor-pointer"
		// 			>
		// 				<ChevronRight />
		// 			</Button>
		// 		</div>
		// 	</div>
		// </section>

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
					<h2 className="h2">Hear From Students and Parents</h2>
					<Subtitle className=" max-w-[488px] mx-auto ">
						Students who follow the system improve both performance and
						confidence with our guided structure.
					</Subtitle>
				</motion.div>

				{/* Grid */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{testimonials.map((t) => (
						<motion.div key={t.id} variants={scaleIn}>
							<TestimonialCard {...t} />
						</motion.div>
					))}
				</motion.div>

				{/* View More */}
				<motion.div
					className="flex justify-center"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					viewport={viewportOnce}
				>
					<Button
						variant="outline"
						className="group flex items-center justify-center gap-2 w-fit h-[44px] mx-auto"
					>
						Learn More About Us
						<MoveRight />
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
