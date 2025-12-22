"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react"; // or your own Star component
import { SectionTitle } from "../SectionTitle";
import { Button } from "../ui/button";

// Your testimonials data (add as many as you want)
const testimonials = [
	{
		id: "testimonial-1",
		name: "Elsie Espinosa",
		photo:
			"https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
		text: "I started with a diagnostic score I wasn't proud of, but after taking the Digital SAT Essentials course, everything clicked. The personalized study plan and the instructor's clear explanations helped me focus exactly where I needed to. I boosted my score by 160 points and got accepted into my top university choice! Highly recommend Prep Excellence.",
	},
	{
		id: "testimonial-2",
		name: "Aarav Patel",
		photo:
			"https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
		text: "The live classes and 1-on-1 mentoring made all the difference. My math score jumped 120 points in just 6 weeks. The personalized study plan and the instructor's clear explanations helped me focus exactly where I needed to. I boosted my score by 160 points and got accepted into my top university choice! Highly recommend Prep Excellence.",
	},
	{
		id: "testimonial-3",
		name: "Sofia Chen",
		photo:
			"https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
		text: "Went from 1380 to 1540 in 3 months. The adaptive practice and strategy calls were game-changers! The personalized study plan and the instructor's clear explanations helped me focus exactly where I needed to. I boosted my score by 160 points and got accepted into my top university choice! Highly recommend Prep Excellence.",
	},
	// Add more...
];

export default function TestimonialsSection() {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			align: "center",
			containScroll: "trimSnaps",
		},
		[
			Autoplay({
				delay: 6000,
				stopOnInteraction: false,
				stopOnMouseEnter: true,
			}),
		],
	);

	const scrollPrev = () => emblaApi?.scrollPrev();
	const scrollNext = () => emblaApi?.scrollNext();

	return (
		<section className="relative py-8 md:py-20">
			<span className="bg-[#6965EB] w-56 h-56 rounded-full blur-[200px] z-10 absolute left-0 top-18"></span>
			<div className="max-w-6xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-12">
					<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
						What Our Students Say
					</SectionTitle>
					<p className="text-muted text-lg max-w-[980px] mx-auto leading-relaxed mt-6">
						Others might promise you great results, but the instructors at Prep
						Excellence deliver. No matter what your current score is, we can
						help you improve it and guarantee improvement. See what our students
						say!!!
					</p>
				</div>

				{/* Carousel Wrapper */}
				<div className="relative max-w-4xl mx-auto">
					{/* Embla Viewport */}
					<div className="overflow-hidden" ref={emblaRef}>
						<div className="flex">
							{testimonials.map((t) => (
								<div
									key={t.id}
									className="flex-[0_0_100%] min-w-0 px-4" // 1 slide per view
								>
									{/* Your EXACT original card — untouched */}
									<div className="relative">
										{/* Large Quote Mark */}
										<div className="absolute top-0 right-8 pointer-events-none">
											<img
												src="/home/quote.png"
												alt=""
												className="h-10 w-12 md:h-20 md:w-20"
											/>
										</div>

										{/* Testimonial Content */}
										<div className="text-center py-6 md:py-12">
											{/* Student Photo */}
											<div className="flex justify-center mb-6">
												<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
													<img
														src={t.photo}
														alt={t.name}
														width={96}
														height={96}
														className="object-cover"
													/>
												</div>
											</div>

											{/* Student Name */}
											<h3 className=" text-md md:text-xl font-bold text-[#191919] mb-3">
												{t.name}
											</h3>

											{/* Rating */}
											<div className="flex items-center justify-center gap-1 mb-6">
												{[1, 2, 3, 4, 5].map((i) => (
													<Star
														key={i}
														className="w-5 h-5 fill-[#ef782e] text-[#ef782e]"
													/>
												))}
											</div>

											{/* Testimonial Text */}
											<p className="text-[#191919] text-sm md:text-lg leading-relaxed max-w-3xl mx-auto px-1">
												{t.text}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Your EXACT original arrows — now functional */}
					<Button
						type="button"
						onClick={scrollPrev}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5  lg:-translate-x-16 rounded-lg p-1 md:p-2.5 shadow-lg cursor-pointer"
					>
						<ChevronLeft />
					</Button>

					<Button
						type="button"
						onClick={scrollNext}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5  lg:translate-x-16 rounded-lg p-1  md:p-2.5 shadow-lg cursor-pointer"
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</section>
	);
}
