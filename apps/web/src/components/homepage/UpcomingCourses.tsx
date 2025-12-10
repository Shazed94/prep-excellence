// components/upcoming-courses-section.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "../Course/course-card";

const coursesData = [
	{
		id: 1,
		title: "SAT 1500+ Elite Coaching",
		description:
			"Focused on advanced strategies for top-tier scores. Master the challenges.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #a8b5a0 0%, #c9d4c1 100%)",
		price: 299,
		rating: 4.8,
		enrolledCount: 245,
	},
	{
		id: 2,
		title: "Digital SAT Essentials",
		description:
			"Comprehensive coverage of all test sections and foundational concepts.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #d4d8e8 0%, #e8eaf6 100%)",
		price: 199,
		rating: 4.6,
		enrolledCount: 187,
	},
	{
		id: 3,
		title: "The Math Matrix",
		description:
			"Go beyond the basics with intensive focus on the core mathematics.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #4a9b8e 0%, #6fb5a8 100%)",
		price: 249,
		rating: 4.9,
		enrolledCount: 312,
	},
	{
		id: 4,
		title: "Reading & Writing",
		description: "Develop critical reading skills and a precise understanding.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Science",
		image: "linear-gradient(135deg, #2980b9 0%, #3d9ed9 100%)",
		price: 179,
		rating: 4.5,
		enrolledCount: 156,
	},
	{
		id: 5,
		title: "Adaptive 1550+ Mastery Cohort",
		description:
			"Focused on advanced strategies for top-tier scores. Master the challenges.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Technology",
		image: "linear-gradient(135deg, #34495e 0%, #5d6d7e 100%)",
		price: 349,
		rating: 4.9,
		enrolledCount: 89,
	},
	{
		id: 6,
		title: "Digital SAT Strategy Sprint",
		description:
			"Comprehensive coverage of all test sections and foundational concepts.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Science",
		image: "linear-gradient(135deg, #1e8b7e 0%, #2ca896 100%)",
		price: 229,
		rating: 4.7,
		enrolledCount: 201,
	},
	{
		id: 7,
		title: "Math Conqueror Workshop",
		description:
			"Go beyond the basics with intensive focus on the core mathematics.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
		price: 189,
		rating: 4.6,
		enrolledCount: 178,
	},
	{
		id: 8,
		title: "Reading & Rhetoric Accelerator",
		description: "Develop critical reading skills and a precise understanding.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Machine learning",
		image: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
		price: 279,
		rating: 4.8,
		enrolledCount: 134,
	},
];

const categories = [
	"All",
	"Science",
	"Machine learning",
	"Marketing",
	"Technology",
	"Math",
];

export default function UpcomingCoursesSection() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		containScroll: "trimSnaps",
		slidesToScroll: 1,
		breakpoints: {
			"(max-width: 768px)": { slidesToScroll: 1 },
			"(min-width: 768px) and (max-width: 1024px)": { slidesToScroll: 2 },
			"(min-width: 1024px)": { slidesToScroll: 3 },
		},
	});
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const filteredCourses =
		selectedCategory === "All"
			? coursesData
			: coursesData.filter((course) => course.category === selectedCategory);

	const scrollPrev = React.useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = React.useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const onSelect = React.useCallback(() => {
		if (!emblaApi) return;
		setCanScrollPrev(emblaApi.canScrollPrev());
		setCanScrollNext(emblaApi.canScrollNext());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
	}, [emblaApi, onSelect]);

	// Update slide width based on screen size
	// const getSlideWidth = () => {
	// 	if (typeof window === "undefined") return "calc(25%-18px)";

	// 	if (window.innerWidth < 768) return "calc(100%-12px)";
	// 	if (window.innerWidth < 1024) return "calc(50%-12px)";
	// 	return "calc(33.333%-16px)";
	// };

	return (
		<section className="py-16 px-4 bg-[#FAFAFA]">
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Upcoming Courses
					</h2>
					<p className="text-gray-600 max-w-3xl mx-auto text-base">
						Explore our comprehensive catalog of upcoming courses, designed to
						equip you with the most in-demand skills across technology, science,
						and business.
					</p>
				</div>

				{/* Category Tabs */}
				<div className="flex justify-center mb-8">
					<div className="w-full max-w-4xl">
						<Tabs
							value={selectedCategory}
							onValueChange={setSelectedCategory}
							className="w-full"
						>
							<TabsList className="flex flex-wrap justify-center bg-transparent gap-2">
								{categories.map((category) => (
									<TabsTrigger
										key={category}
										value={category}
										className="data-[state=active]:bg-[#0891b2] data-[state=active]:text-white text-sm md:text-base font-normal px-4 py-3 md:px-6 md:py-4 rounded-md transition-all border"
									>
										{category}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</div>
				</div>

				{/* Carousel Container */}
				<div className="relative">
					<div className="overflow-hidden" ref={emblaRef}>
						<div className="flex gap-4 md:gap-6 py-8">
							<AnimatePresence mode="sync">
								{filteredCourses.map((course) => (
									<motion.div
										key={course.id}
										layout
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{
											layout: { duration: 0.3 },
											opacity: { duration: 0.3 },
											scale: { duration: 0.3 },
										}}
										className="flex-[0_0_calc(100%-12px)] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0 pl-4 md:pl-0"
									>
										<CourseCard course={course} />
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>

					{/* Navigation Buttons - Only show if needed */}
					{canScrollPrev && (
						<button
							type="button"
							onClick={scrollPrev}
							className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
							aria-label="Previous"
						>
							<ChevronLeft className="w-6 h-6 text-gray-700" />
						</button>
					)}

					{canScrollNext && (
						<button
							type="button"
							onClick={scrollNext}
							className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
							aria-label="Next"
						>
							<ChevronRight className="w-6 h-6 text-gray-700" />
						</button>
					)}
				</div>

				{/* Mobile indicators */}
				<div className="flex justify-center items-center gap-2 mt-6 md:hidden">
					{filteredCourses.map((_, index) => (
						<div
							key={index}
							className={`w-2 h-2 rounded-full ${
								index === 0 ? "bg-[#0891b2]" : "bg-gray-300"
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
